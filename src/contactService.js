const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class ContactService {
  /**
   * Main method to identify and reconcile contacts
   */
  async identify(request) {
    const { email, phoneNumber } = request;

    // Find all matching contacts by email or phone number
    const matchingContacts = await this.findMatchingContacts(
      email,
      phoneNumber,
    );

    if (matchingContacts.length === 0) {
      // No existing contact found, create a new primary contact
      const newContact = await this.createPrimaryContact(email, phoneNumber);
      return this.buildResponse([newContact]);
    }

    // Check if this is an exact match (both email and phone match an existing contact)
    const exactMatch = matchingContacts.find(
      (contact) =>
        (email ? contact.email === email : true) &&
        (phoneNumber ? contact.phoneNumber === phoneNumber : true) &&
        (email && phoneNumber
          ? contact.email === email && contact.phoneNumber === phoneNumber
          : false),
    );

    // Get all contacts in the cluster(s)
    let allRelatedContacts = await this.getAllRelatedContacts(matchingContacts);

    // Check if we need to link two separate primary contacts
    const primaryContacts = allRelatedContacts.filter(
      (c) => c.linkPrecedence === "primary",
    );

    if (primaryContacts.length > 1) {
      // Multiple primary contacts exist, need to merge them
      allRelatedContacts = await this.mergePrimaryContacts(primaryContacts);
    }

    // Check if we need to create a new secondary contact
    const needsNewSecondary = this.shouldCreateSecondaryContact(
      email,
      phoneNumber,
      allRelatedContacts,
    );

    if (needsNewSecondary) {
      const primaryContact = allRelatedContacts.find(
        (c) => c.linkPrecedence === "primary",
      );
      const newSecondary = await this.createSecondaryContact(
        email,
        phoneNumber,
        primaryContact.id,
      );
      allRelatedContacts.push(newSecondary);
    }

    return this.buildResponse(allRelatedContacts);
  }

  /**
   * Find contacts that match the given email or phone number
   */
  async findMatchingContacts(email, phoneNumber) {
    const contacts = await prisma.contact.findMany({
      where: {
        OR: [email ? { email } : {}, phoneNumber ? { phoneNumber } : {}].filter(
          (condition) => Object.keys(condition).length > 0,
        ),
        deletedAt: null,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return contacts;
  }

  /**
   * Get all contacts related to the given contacts (including through links)
   */
  async getAllRelatedContacts(contacts) {
    const contactIds = new Set();
    const primaryIds = new Set();

    // Collect all contact IDs and primary IDs
    for (const contact of contacts) {
      contactIds.add(contact.id);
      if (contact.linkPrecedence === "primary") {
        primaryIds.add(contact.id);
      } else if (contact.linkedId) {
        primaryIds.add(contact.linkedId);
      }
    }

    // Fetch all contacts linked to these primary IDs
    const allRelated = await prisma.contact.findMany({
      where: {
        OR: [
          { id: { in: Array.from(primaryIds) } },
          { linkedId: { in: Array.from(primaryIds) } },
        ],
        deletedAt: null,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return allRelated;
  }

  /**
   * Merge multiple primary contacts into one, keeping the oldest as primary
   */
  async mergePrimaryContacts(primaryContacts) {
    // Sort by createdAt to find the oldest
    primaryContacts.sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    );

    const oldestPrimary = primaryContacts[0];
    const contactsToUpdate = primaryContacts.slice(1);

    // Update all other primary contacts to secondary
    for (const contact of contactsToUpdate) {
      await prisma.contact.update({
        where: { id: contact.id },
        data: {
          linkedId: oldestPrimary.id,
          linkPrecedence: "secondary",
          updatedAt: new Date(),
        },
      });

      // Update all contacts that were linked to this contact to link to the oldest primary
      await prisma.contact.updateMany({
        where: { linkedId: contact.id },
        data: {
          linkedId: oldestPrimary.id,
          updatedAt: new Date(),
        },
      });
    }

    // Fetch all related contacts after merge
    return await prisma.contact.findMany({
      where: {
        OR: [{ id: oldestPrimary.id }, { linkedId: oldestPrimary.id }],
        deletedAt: null,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  /**
   * Check if we need to create a new secondary contact
   */
  shouldCreateSecondaryContact(email, phoneNumber, existingContacts) {
    // If both email and phoneNumber are null, don't create
    if (!email && !phoneNumber) {
      return false;
    }

    // Check if exact combination already exists
    const exactMatch = existingContacts.find(
      (contact) =>
        contact.email === (email || null) &&
        contact.phoneNumber === (phoneNumber || null),
    );

    if (exactMatch) {
      return false;
    }

    // Check if this adds new information
    const hasNewEmail = email
      ? !existingContacts.some((c) => c.email === email)
      : false;
    const hasNewPhone = phoneNumber
      ? !existingContacts.some((c) => c.phoneNumber === phoneNumber)
      : false;

    return hasNewEmail || hasNewPhone;
  }

  /**
   * Create a new primary contact
   */
  async createPrimaryContact(email, phoneNumber) {
    return await prisma.contact.create({
      data: {
        email: email || null,
        phoneNumber: phoneNumber || null,
        linkedId: null,
        linkPrecedence: "primary",
      },
    });
  }

  /**
   * Create a new secondary contact
   */
  async createSecondaryContact(email, phoneNumber, primaryId) {
    return await prisma.contact.create({
      data: {
        email: email || null,
        phoneNumber: phoneNumber || null,
        linkedId: primaryId,
        linkPrecedence: "secondary",
      },
    });
  }

  /**
   * Build the response object from a list of contacts
   */
  buildResponse(contacts) {
    const primaryContact = contacts.find((c) => c.linkPrecedence === "primary");
    const secondaryContacts = contacts.filter(
      (c) => c.linkPrecedence === "secondary",
    );

    // Collect unique emails and phone numbers
    const emails = Array.from(
      new Set(contacts.map((c) => c.email).filter((e) => e !== null)),
    );

    const phoneNumbers = Array.from(
      new Set(contacts.map((c) => c.phoneNumber).filter((p) => p !== null)),
    );

    // Sort to ensure primary contact's info comes first
    const sortEmails = (emails) => {
      const primaryEmail = primaryContact.email;
      if (primaryEmail && emails.includes(primaryEmail)) {
        return [primaryEmail, ...emails.filter((e) => e !== primaryEmail)];
      }
      return emails;
    };

    const sortPhoneNumbers = (phones) => {
      const primaryPhone = primaryContact.phoneNumber;
      if (primaryPhone && phones.includes(primaryPhone)) {
        return [primaryPhone, ...phones.filter((p) => p !== primaryPhone)];
      }
      return phones;
    };

    return {
      contact: {
        primaryContatctId: primaryContact.id,
        emails: sortEmails(emails),
        phoneNumbers: sortPhoneNumbers(phoneNumbers),
        secondaryContactIds: secondaryContacts.map((c) => c.id),
      },
    };
  }
}

module.exports = new ContactService();

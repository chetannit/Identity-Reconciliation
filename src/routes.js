const { Router } = require("express");
const contactService = require("./contactService");

const router = Router();

router.post("/identify", async (req, res) => {
  try {
    const identifyRequest = req.body;

    // Validate that at least one of email or phoneNumber is provided
    if (!identifyRequest.email && !identifyRequest.phoneNumber) {
      return res.status(400).json({
        error: "At least one of email or phoneNumber must be provided",
      });
    }

    const result = await contactService.identify(identifyRequest);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in /identify endpoint:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

module.exports = router;

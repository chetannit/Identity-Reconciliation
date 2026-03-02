# Postman Collection for Identity Reconciliation API

You can import this file into Postman or use these curl commands to test the API.

## Test Scenario 1: Create First Contact

```bash
curl -X POST http://localhost:3000/identify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "lorraine@hillvalley.edu",
    "phoneNumber": "123456"
  }'
```

Expected: New primary contact created

## Test Scenario 2: Add Secondary Contact (Same Phone, New Email)

```bash
curl -X POST http://localhost:3000/identify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mcfly@hillvalley.edu",
    "phoneNumber": "123456"
  }'
```

Expected: Secondary contact created, both emails linked

## Test Scenario 3: Query Existing Contact (Phone Only)

```bash
curl -X POST http://localhost:3000/identify \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "123456"
  }'
```

Expected: Returns both email addresses

## Test Scenario 4: Query Existing Contact (Email Only)

```bash
curl -X POST http://localhost:3000/identify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mcfly@hillvalley.edu"
  }'
```

Expected: Returns complete contact info

## Test Scenario 5: Create Second Independent Contact

```bash
curl -X POST http://localhost:3000/identify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "george@hillvalley.edu",
    "phoneNumber": "919191"
  }'
```

Expected: New independent primary contact

## Test Scenario 6: Create Third Independent Contact

```bash
curl -X POST http://localhost:3000/identify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "biffsucks@hillvalley.edu",
    "phoneNumber": "717171"
  }'
```

Expected: Another independent primary contact

## Test Scenario 7: Link Two Primary Contacts

```bash
curl -X POST http://localhost:3000/identify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "george@hillvalley.edu",
    "phoneNumber": "717171"
  }'
```

Expected: Two primary contacts merged, older one remains primary

## Test Scenario 8: Duplicate Request (No New Info)

```bash
curl -X POST http://localhost:3000/identify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "lorraine@hillvalley.edu",
    "phoneNumber": "123456"
  }'
```

Expected: No new contact created, returns existing info

## Test Scenario 9: Invalid Request (No Data)

```bash
curl -X POST http://localhost:3000/identify \
  -H "Content-Type: application/json" \
  -d '{}'
```

Expected: 400 Bad Request error

## Test Scenario 10: Health Check

```bash
curl http://localhost:3000/health
```

Expected: {"status": "ok"}

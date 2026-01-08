# RESTful API Documentation

This directory contains the RESTful API routes for the intercity bus ticket cancellation and refund system. The system provides transparency, trust, and accountability for ticket cancellations and refunds.

## API Routes

### `/api/users`

#### GET `/api/users`
Retrieves a list of all users (passengers).

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "createdAt": "2024-12-15T10:00:00.000Z"
    }
  ]
}
```

#### POST `/api/users`
Creates a new user (passenger).

**Request Body:**
```json
{
  "name": "Alice Brown",        // Required
  "email": "alice@example.com", // Optional
  "phone": "+1122334455"        // Optional
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "4",
    "name": "Alice Brown",
    "email": "alice@example.com",
    "phone": "+1122334455",
    "createdAt": "2024-12-15T10:00:00.000Z"
  },
  "message": "User created successfully"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Name is required and must be a string"
}
```

---

### `/api/tickets`

#### GET `/api/tickets`
Retrieves a paginated list of tickets.

**Query Parameters:**
- `page` (optional): Page number (default: 1, minimum: 1)
- `limit` (optional): Items per page (default: 10, maximum: 100)
- `userId` (optional): Filter by user ID

**Example Request:**
```
GET /api/tickets?page=1&limit=10&userId=1
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "userId": "1",
      "tripId": "1",
      "seatNumber": "A12",
      "price": 45.99,
      "status": "confirmed",
      "createdAt": "2024-12-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

#### POST `/api/tickets`
Creates a new ticket (booking).

**Request Body:**
```json
{
  "userId": "1",      // Required
  "tripId": "1",      // Required
  "seatNumber": "F10" // Required
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "6",
    "userId": "1",
    "tripId": "1",
    "seatNumber": "F10",
    "price": 45.99,
    "status": "confirmed",
    "createdAt": "2024-12-15T10:00:00.000Z"
  },
  "message": "Ticket created successfully"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "userId is required and must be a string"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "User with ID \"999\" not found",
  "message": "Cannot create ticket for a non-existent user. Please create the user first."
}
```

---

### `/api/cancellations`

#### GET `/api/cancellations`
Retrieves a paginated list of cancellations.

**Query Parameters:**
- `page` (optional): Page number (default: 1, minimum: 1)
- `limit` (optional): Items per page (default: 10, maximum: 100)
- `userId` (optional): Filter by user ID
- `ticketId` (optional): Filter by ticket ID

**Example Request:**
```
GET /api/cancellations?page=1&limit=10&userId=1
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "ticketId": "3",
      "userId": "2",
      "reason": "Change of plans",
      "cancelledBy": "user",
      "cancellationPolicy": "Cancellation 24 hours before departure: 80% refund",
      "refundEligibility": true,
      "refundAmount": 26.0,
      "status": "processed",
      "createdAt": "2024-12-15T10:00:00.000Z",
      "processedAt": "2024-12-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

#### POST `/api/cancellations`
Creates a new cancellation request. Automatically calculates refund eligibility based on cancellation policy.

**Request Body:**
```json
{
  "ticketId": "1",           // Required
  "reason": "Change of plans" // Required
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "2",
    "ticketId": "1",
    "userId": "1",
    "reason": "Change of plans",
    "cancelledBy": "user",
    "cancellationPolicy": "Cancellation 24 hours before departure: 80% refund",
    "refundEligibility": true,
    "refundAmount": 36.79,
    "status": "pending",
    "createdAt": "2024-12-15T10:00:00.000Z"
  },
  "message": "Cancellation request created successfully"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Ticket is already cancelled"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Ticket with ID \"999\" not found"
}
```

---

### `/api/refunds`

#### GET `/api/refunds`
Retrieves a paginated list of refunds.

**Query Parameters:**
- `page` (optional): Page number (default: 1, minimum: 1)
- `limit` (optional): Items per page (default: 10, maximum: 100)
- `userId` (optional): Filter by user ID
- `status` (optional): Filter by refund status (pending, processing, completed, failed)

**Example Request:**
```
GET /api/refunds?page=1&limit=10&userId=2&status=processing
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "cancellationId": "1",
      "ticketId": "3",
      "userId": "2",
      "originalAmount": 32.50,
      "refundAmount": 26.0,
      "refundPercentage": 80,
      "reason": "Change of plans",
      "status": "processing",
      "expectedCompletionDate": "2024-12-22T10:00:00.000Z",
      "createdAt": "2024-12-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

#### POST `/api/refunds`
Processes a refund for an approved cancellation. Validates eligibility and creates refund record.

**Request Body:**
```json
{
  "cancellationId": "1" // Required
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "2",
    "cancellationId": "1",
    "ticketId": "3",
    "userId": "2",
    "originalAmount": 32.50,
    "refundAmount": 26.0,
    "refundPercentage": 80,
    "reason": "Change of plans",
    "status": "processing",
    "expectedCompletionDate": "2024-12-22T10:00:00.000Z",
    "createdAt": "2024-12-15T10:00:00.000Z"
  },
  "message": "Refund processed successfully"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "This cancellation is not eligible for refund based on the cancellation policy"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Cancellation with ID \"999\" not found"
}
```

## HTTP Status Codes

- **200 OK**: Successful GET request
- **201 Created**: Successful POST request (resource created)
- **400 Bad Request**: Invalid input data or validation error
- **404 Not Found**: Resource not found (e.g., user doesn't exist)
- **500 Internal Server Error**: Unexpected server error

## Cancellation Policy & Refund Rules

The system uses a rule-based refund calculation:

- **24+ hours before departure**: 80% refund
- **2-24 hours before departure**: 50% refund
- **Less than 2 hours before departure**: No refund (0%)

These rules ensure transparency and accountability. The refund amount and eligibility are automatically calculated when a cancellation is created.

## Testing the API

You can test these APIs using:

1. **Browser**: Navigate to `http://localhost:3000/api/users` (GET requests only)
2. **cURL**:
   ```bash
   # Get all users
   curl http://localhost:3000/api/users

   # Create a user
   curl -X POST http://localhost:3000/api/users \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com"}'

   # Get tickets with pagination
   curl http://localhost:3000/api/tickets?page=1&limit=5

   # Create a ticket
   curl -X POST http://localhost:3000/api/tickets \
     -H "Content-Type: application/json" \
     -d '{"userId":"1","tripId":"1","seatNumber":"A1"}'

   # Create a cancellation
   curl -X POST http://localhost:3000/api/cancellations \
     -H "Content-Type: application/json" \
     -d '{"ticketId":"1","reason":"Change of plans"}'

   # Process a refund
   curl -X POST http://localhost:3000/api/refunds \
     -H "Content-Type: application/json" \
     -d '{"cancellationId":"1"}'

   # Get refunds for a user
   curl http://localhost:3000/api/refunds?userId=1&status=processing
   ```

3. **Postman or Insomnia**: Use the GUI to make requests
4. **Next.js API Routes**: Call from client components or server components

## Notes

- All data is stored in-memory (mock data)
- Data persists only during server runtime
- In production, replace mock data with PostgreSQL database
- All endpoints return JSON responses
- Input validation is performed on all POST requests
- Refund eligibility is automatically calculated based on cancellation policy
- The system maintains full audit trail through cancellation and refund records
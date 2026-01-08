# RESTful API Documentation

This directory contains the RESTful API routes for the intercity bus ticket cancellation and refund system.

## API Routes

### `/api/users`

#### GET `/api/users`
Retrieves a list of all users.

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
Creates a new user.

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

### `/api/bookings`

#### GET `/api/bookings`
Retrieves a paginated list of bookings.

**Query Parameters:**
- `page` (optional): Page number (default: 1, minimum: 1)
- `limit` (optional): Items per page (default: 10, maximum: 100)

**Example Request:**
```
GET /api/bookings?page=1&limit=10
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "userId": "1",
      "route": "New York to Boston",
      "departureDate": "2024-12-20",
      "departureTime": "10:00 AM",
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

#### POST `/api/bookings`
Creates a new booking.

**Request Body:**
```json
{
  "userId": "1",                        // Required
  "route": "New York to Philadelphia",  // Required
  "departureDate": "2024-12-21",        // Required
  "departureTime": "09:00 AM",          // Required
  "seatNumber": "F10",                  // Required
  "price": 35.50                        // Required (positive number)
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "6",
    "userId": "1",
    "route": "New York to Philadelphia",
    "departureDate": "2024-12-21",
    "departureTime": "09:00 AM",
    "seatNumber": "F10",
    "price": 35.50,
    "status": "confirmed",
    "createdAt": "2024-12-15T10:00:00.000Z"
  },
  "message": "Booking created successfully"
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
  "message": "Cannot create booking for a non-existent user. Please create the user first."
}
```

## HTTP Status Codes

- **200 OK**: Successful GET request
- **201 Created**: Successful POST request (resource created)
- **400 Bad Request**: Invalid input data or validation error
- **404 Not Found**: Resource not found (e.g., user doesn't exist)
- **500 Internal Server Error**: Unexpected server error

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

   # Get bookings with pagination
   curl http://localhost:3000/api/bookings?page=1&limit=5

   # Create a booking
   curl -X POST http://localhost:3000/api/bookings \
     -H "Content-Type: application/json" \
     -d '{"userId":"1","route":"NYC to DC","departureDate":"2024-12-20","departureTime":"10:00 AM","seatNumber":"A1","price":50.00}'
   ```

3. **Postman or Insomnia**: Use the GUI to make requests
4. **Next.js API Routes**: Call from client components or server components

## Notes

- All data is stored in-memory (mock data)
- Data persists only during server runtime
- In production, replace mock data with a database
- All endpoints return JSON responses
- Input validation is performed on all POST requests

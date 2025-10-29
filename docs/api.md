# PipeTrack API Reference

Base URL: https://pipe-track-backend.onrender.com/api

This document includes all PipeTrack API endpoints, combined in one place for easy reference and testing in Postman or Insomnia.

AUTHENTICATION:

Register a new user  
Method: POST /auth/register  
Request Body:  
{
  "username": "technician1",
  "password": "Password123"
}  
Response (201 Created):  
{
  "user": {
    "_id": "671e4bf298a5",
    "username": "technician1"
  },
  "token": "eyJhbGciOiJIUzI1..."
}

Login  
Method: POST /auth/login  
Request Body:  
{
  "username": "technician1",
  "password": "Password123"
}  
Response (200 OK):  
{
  "token": "eyJhbGciOiJIUzI1..."
}  
Use this token in the Authorization header for protected routes:  
Authorization: Bearer <JWT_TOKEN>

Logout  
Method: POST /auth/logout  
Headers: Authorization: Bearer <JWT_TOKEN>  
Response (200 OK):  
{
  "message": "User logged out successfully"
}

PARTS (INVENTORY MANAGEMENT):

Get All Parts  
Method: GET /parts  
Headers: Authorization: Bearer <JWT_TOKEN>  
Response (200 OK):  
[
  {
    "_id": "6720e0b1a4",
    "name": "PVC Coupling 3/4",
    "sku": "PVC-075",
    "quantity": 25,
    "price": 2.5,
    "restockThreshold": 5
  }
]

Add a New Part  
Method: POST /parts  
Headers: Authorization: Bearer <JWT_TOKEN>  
Request Body:  
{
  "name": "Copper Elbow 1/2",
  "sku": "CU-ELB-050",
  "quantity": 20,
  "price": 3.0,
  "restockThreshold": 3
}  
Response (201 Created):  
{
  "_id": "6720e0b1a4",
  "name": "Copper Elbow 1/2",
  "sku": "CU-ELB-050",
  "quantity": 20,
  "price": 3.0,
  "restockThreshold": 3
}

Update a Part  
Method: PATCH /parts/:id  
Headers: Authorization: Bearer <JWT_TOKEN>  
Request Body:  
{
  "quantity": 10
}  
Response (200 OK):  
{
  "_id": "6720e0b1a4",
  "name": "Copper Elbow 1/2",
  "sku": "CU-ELB-050",
  "quantity": 10,
  "price": 3.0,
  "restockThreshold": 3
}

Delete a Part  
Method: DELETE /parts/:id  
Headers: Authorization: Bearer <JWT_TOKEN>  
Response (204 No Content): No body

JOBS (WORK ORDERS):

Create a Job  
Method: POST /jobs  
Headers: Authorization: Bearer <JWT_TOKEN>  
Request Body:  
{
  "customerName": "Acme Bakery",
  "vanId": "VAN-12",
  "partsUsed": [
    { "part": "6720e0b1a4", "quantity": 2, "unitPrice": 2.5 },
    { "part": "6720e0b2b7", "quantity": 1, "unitPrice": 3.0 }
  ]
}  
Response (201 Created):  
{
  "_id": "6720e8b6d8",
  "customerName": "Acme Bakery",
  "vanId": "VAN-12",
  "partsUsed": [
    { "part": "6720e0b1a4", "quantity": 2, "unitPrice": 2.5, "lineTotal": 5.0 },
    { "part": "6720e0b2b7", "quantity": 1, "unitPrice": 3.0, "lineTotal": 3.0 }
  ],
  "totalCost": 8.0,
  "createdAt": "2025-10-29T00:00:00.000Z"
}

Get All Jobs  
Method: GET /jobs  
Headers: Authorization: Bearer <JWT_TOKEN>  
Response (200 OK):  
[
  {
    "_id": "6720e8b6d8",
    "customerName": "Acme Bakery",
    "vanId": "VAN-12",
    "totalCost": 8.0,
    "createdAt": "2025-10-29T00:00:00.000Z"
  }
]

Get Job by ID  
Method: GET /jobs/:id  
Headers: Authorization: Bearer <JWT_TOKEN>  
Response (200 OK):  
{
  "_id": "6720e8b6d8",
  "customerName": "Acme Bakery",
  "vanId": "VAN-12",
  "partsUsed": [
    { "part": "6720e0b1a4", "quantity": 2, "unitPrice": 2.5, "lineTotal": 5.0 }
  ],
  "totalCost": 8.0,
  "createdAt": "2025-10-29T00:00:00.000Z"
}

BARCODES:

Generate a Barcode by SKU  
Method: GET /barcodes/:sku  
Headers: Authorization: Bearer <JWT_TOKEN>  
Response (200 OK):  
{
  "sku": "PVC-075",
  "barcode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg..."
}

COMMON STATUS CODES:  
200 - OK  
201 - Created  
204 - No Content  
400 - Bad Request  
401 - Unauthorized  
404 - Not Found  
500 - Server Error
PipeTrack

Plumbing Inventory & Job Management Application

PipeTrack is a full-stack application built with a Next.js frontend and an Express/MongoDB backend. It enables plumbing technicians to manage parts inventory, create jobs, and track items used in the field. Inventory levels update automatically as parts are used on jobs.

⸻

Features
	•	Secure authentication using JSON Web Tokens
	•	Create, view, and manage jobs
	•	Add parts to jobs, with automatic inventory updates
	•	Full inventory management (create/update/delete parts)
	•	Responsive Next.js frontend optimized for field use
	•	Clean separation between backend API and frontend UI

⸻

Tech Stack

Frontend: Next.js (App Router), Tailwind CSS, Fetch API
Backend: Node.js, Express.js, MongoDB, Mongoose
Tools: Render, Vercel, Postman, GitHub

⸻

Project Structure

root/
 ├── app/                   # Next.js frontend
 │   ├── page.jsx
 │   ├── jobs/
 │   ├── inventory/
 │   ├── components/
 │   └── ...
 ├── server/                # Express backend
 │   ├── controllers/
 │   ├── models/
 │   ├── routes/
 │   └── server.js
 └── README.md

Architecture Overview
	•	Models implement the MongoDB schemas (User, Part, Job, Counter).
	•	Controllers handle all business logic and database interaction.
	•	Routes expose backend API endpoints under /api.
	•	The Next.js frontend communicates exclusively through fetch calls.

⸻

Database Schema (ERD)

PipeTrack uses four MongoDB collections:
	•	User — authentication and identity
	•	Part — inventory items
	•	Job — jobs and parts used
	•	Counter — sequence generator for barcodes (supporting model)

erDiagram
  USER ||--o{ JOB : "creates jobs"
  USER ||--o{ PART : "owns parts"
  JOB }o--o{ PART : "uses parts"

  USER {
    ObjectId _id
    string username
    string email
    string passwordHash
    number tokenVersion
    string resetPasswordTokenHash
    date resetPasswordExpiresAt
    date createdAt
    date updatedAt
  }

  PART {
    ObjectId _id
    string name
    string sku
    string barcode
    number quantity
    number price
    number restockThreshold
    date createdAt
    date updatedAt
  }

  JOB {
    ObjectId _id
    string customerName
    string vanId
    PartUsage[] partsUsed
    number totalCost
    date jobDate
    date createdAt
    date updatedAt
  }


⸻

User Flow

This flow reflects the live behavior of your Next.js frontend and Express backend.

flowchart LR
  A[Open PipeTrack] --> B[Login or Register]
  B --> C[POST /api/auth/login or /api/auth/register]
  C --> D[Backend validates and sets auth cookie]
  D --> E[Dashboard (Protected Route)]

  E --> F[View Jobs]
  E --> G[Create Job]
  E --> H[Manage Inventory]

  G --> I[Submit JobForm]
  I --> J[POST /api/jobs]
  J --> K[Backend creates Job and updates Part quantities]

  H --> L[GET /api/parts]
  L --> M[Create Update Delete Parts]

  K --> F
  F --> E
  H --> E


⸻

Installation

1. Clone the repository

git clone https://github.com/YOUR_USERNAME/pipetrack.git
cd pipetrack

2. Install dependencies

Backend:

cd server
npm install

Frontend:

cd app
npm install


⸻

Environment Variables

Create environment variables locally and in deployment.
Do not commit real values to GitHub.

Backend (server/.env)

PORT=5001
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret

Frontend (app/.env.local)

NEXT_PUBLIC_API_BASE_URL=your_backend_url

Example (local development):

NEXT_PUBLIC_API_BASE_URL=http://localhost:5001

Example (deployment):

NEXT_PUBLIC_API_BASE_URL=https://pipetrack-backend.onrender.com


⸻

Running the Application

Start backend:

npm start

Available at:

http://localhost:5001

Start frontend:

npm run dev

Available at:

http://localhost:3000


⸻

Deployment

Backend (Render):

https://pipetrack-backend.onrender.com

Frontend (Vercel or Render):

https://your-frontend-url.vercel.app


⸻

API Endpoints

Authentication
	•	POST /api/auth/register
	•	POST /api/auth/login
	•	GET /api/auth/me

Parts Inventory
	•	GET /api/parts
	•	POST /api/parts
	•	PUT /api/parts/:id
	•	DELETE /api/parts/:id

Jobs
	•	GET /api/jobs
	•	POST /api/jobs
	•	PUT /api/jobs/:id/addItem

Barcodes
	•	GET /api/barcodes/:code (used for lookup)

⸻

Testing

All APIs validated with Postman.
Integration tests may be added using Jest or Supertest.

⸻

Future Enhancements
	•	Barcode scanning for parts
	•	Low-inventory alerts
	•	PDF export for job history
	•	Role-based access
	•	Offline mode

⸻

Author

Kyle Benavides
Full-Stack Web Developer


PipeTrack

Plumbing Inventory & Job Management Application

PipeTrack is a full-stack application built with a Next.js frontend and an Express/MongoDB backend. It provides plumbing technicians with an easy way to manage parts inventory, log jobs, and track items used in the field. Inventory updates automatically as technicians document their work.

⸻

Features
	•	Secure login and authentication using JSON Web Tokens
	•	Create and manage jobs
	•	Add parts to a job and automatically reduce inventory counts
	•	View and manage parts inventory
	•	Mobile-friendly Next.js interface
	•	Clear separation between frontend UI and backend API

⸻

Tech Stack

Frontend: Next.js (App Router), Tailwind CSS, Fetch API
Backend: Node.js, Express.js, MongoDB, Mongoose
Tools: Render, Vercel, GitHub, Postman

⸻

Project Structure

root/
 ├── app/                   # Next.js frontend (App Router)
 ├── server/                # Express backend
 │   ├── controllers/
 │   ├── models/
 │   ├── routes/
 │   └── server.js
 └── README.md

Architecture Overview
	•	Models define Mongoose schemas for Users, Jobs, and Parts Inventory.
	•	Controllers contain business logic and interact with the models.
	•	Routes map HTTP endpoints to controllers.
	•	Next.js frontend communicates with backend through fetch calls.

⸻

Data Models

User

Stores authentication and user profile information.

Typical fields:
	•	name
	•	email
	•	password (hashed)
	•	timestamps

Parts Inventory

Stores all parts and quantities available to the user.

Typical fields:
	•	item name
	•	quantity
	•	cost
	•	description
	•	userId (owner of the inventory item)
	•	timestamps

Jobs

Represents a job performed by a technician.

Typical fields:
	•	title
	•	description
	•	date
	•	userId (technician)
	•	partsUsed (array of parts references and quantities)
	•	timestamps

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

Backend .env:

PORT=5001
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret

Frontend .env.local:

NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.onrender.com


⸻

Running the Application

Start backend:

npm start

Start frontend:

npm run dev


⸻

Deployment

Backend (Render):
https://pipetrack-backend.onrender.com

Frontend (Vercel or Render):
capstone-peagqi0j4-kyle-benaides-projects.vercel.app

Ensure the frontend environment variable points to the correct backend URL.

⸻

API Endpoints (Summary)

Auth
POST /api/auth/register
POST /api/auth/login

Parts Inventory
GET /api/inventory
POST /api/inventory
PUT /api/inventory/:id
DELETE /api/inventory/:id

Jobs
POST /api/jobs
GET /api/jobs
PUT /api/jobs/:id/addItem

⸻

Testing

All endpoints validated using Postman.
Integration testing available with Jest and Supertest.

⸻

Future Enhancements
	•	Barcode scanning
	•	Low-inventory alerts
	•	PDF job export
	•	Role-based permissions
	•	Offline support

⸻

Author

Kyle Benavides
Full-Stack Web Developer

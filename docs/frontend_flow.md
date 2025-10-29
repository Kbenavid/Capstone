# PipeTrack Frontend Control Flow

The PipeTrack frontend is built using React and Vite, styled with Tailwind CSS, and communicates with the backend via RESTful API endpoints hosted on Render. Users can log in, view and manage inventory (parts), track jobs, and generate barcodes for items — all from the browser.

## Overview
The frontend acts as the interface between users and the backend API. It handles user input, displays data returned from the backend, and manages authentication through JSON Web Tokens (JWTs).

## Component Architecture
App.jsx  
 ├── NavBar.jsx  
 ├── Routes  
 │   ├── HomePage.jsx  
 │   ├── LoginPage.jsx → uses AuthContext for authentication  
 │   ├── Dashboard.jsx → central hub for navigation  
 │   ├── PartsPage.jsx → displays inventory (GET /api/parts)  
 │   │    └── PartCard.jsx → renders individual part info  
 │   │    └── PartForm.jsx → handles adding/updating parts (POST/PATCH)  
 │   ├── JobsPage.jsx → shows service jobs (GET /api/jobs)  
 │   │    └── JobForm.jsx → creates new jobs (POST /api/jobs)  
 │   │    └── JobList.jsx → lists all jobs  
 │   ├── BarcodePage.jsx → generates part barcodes (GET /api/barcodes/:sku)  
 │   └── NotFound.jsx  
 └── Footer.jsx

## Data Flow
1. Authentication Flow  
   - LoginPage.jsx sends credentials to /api/auth/login.  
   - Backend returns a JWT token, which is stored in localStorage.  
   - The token is included in all subsequent fetch requests via headers: Authorization: Bearer <JWT_TOKEN>.  

2. Parts Management Flow  
   - PartsPage.jsx fetches all parts from /api/parts.  
   - PartForm.jsx allows creation of new parts via POST /api/parts.  
   - Editing or deleting parts uses PATCH and DELETE requests.  
   - The UI updates state immediately upon successful responses.  

3. Jobs Flow  
   - JobsPage.jsx fetches all jobs from /api/jobs.  
   - JobForm.jsx submits a new job referencing parts used.  
   - The total cost is computed client-side and confirmed via the backend.  

4. Barcode Flow  
   - BarcodePage.jsx requests /api/barcodes/:sku for a part’s barcode.  
   - The backend returns a Base64 image string displayed directly in the browser.  

## State Management
The app uses React hooks (useState, useEffect) for component-level state. AuthContext manages global user authentication state. All network calls use the base API URL stored in the .env file:
VITE_API_BASE_URL=https://pipe-track-backend.onrender.com/api

## File Structure Summary
frontend/  
 ├── src/  
 │   ├── App.jsx  
 │   ├── main.jsx  
 │   ├── components/  
 │   │    ├── NavBar.jsx  
 │   │    ├── PartCard.jsx  
 │   │    ├── PartForm.jsx  
 │   │    ├── JobForm.jsx  
 │   │    ├── JobList.jsx  
 │   │    └── Footer.jsx  
 │   ├── pages/  
 │   │    ├── HomePage.jsx  
 │   │    ├── LoginPage.jsx  
 │   │    ├── Dashboard.jsx  
 │   │    ├── PartsPage.jsx  
 │   │    ├── JobsPage.jsx  
 │   │    └── BarcodePage.jsx  
 │   ├── context/  
 │   │    └── AuthContext.jsx  
 │   └── assets/  
 │        └── styles.css

## Summary
Purpose: Manage and visualize plumbing inventory, jobs, and barcodes.  
Framework: React (Vite)  
State Management: Context + Hooks  
API Communication: Fetch requests to the backend via REST endpoints.  
Auth: JWT-based; token persisted in localStorage.  
Styling: Tailwind CSS.  

This control flow document outlines how the frontend React structure interacts with the backend API and manages state across the application.

Author: Kyle Benavides  
Last Updated: October 2025
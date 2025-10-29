PipeTrack — Plumbing Van Inventory Manager

Project Overview
PipeTrack is a MERN-stack (MongoDB, Express, React, Node.js) web application that allows plumbing businesses to track and manage the inventory of each service van. The system provides a barcode-driven solution for monitoring parts usage on jobs, issuing restock alerts, and generating printable invoices with calculated totals. Designed with mobile and tablet access in mind, PipeTrack empowers field technicians and office staff to stay on top of materials in real time.

Target Demographic
PipeTrack is designed for small to mid-sized plumbing companies with multiple service vans and field technicians. These businesses often struggle with tracking parts across vans, calculating job costs, and avoiding delays caused by missing inventory. PipeTrack directly addresses those pain points with a lightweight, mobile-friendly app.

Data & Sources
Custom Data: All data will be user-generated, including:
- Part name, SKU, quantity, price
- Job records (customer, van, parts used, total cost)
- Barcode data (auto-generated)
- User authentication info

Barcode Generation: Uses bwip-js to generate barcodes dynamically without relying on external APIs.  
Export: Invoices will be created using jsPDF for digital/print exports.

Database Schema (MongoDB/Mongoose)
**User:**
- username (String)
- passwordHash (String)

**Part:**
- name (String)
- sku (String)
- quantity (Number)
- price (Number)
- restockThreshold (Number)

**Job:**
- customerName (String)
- vanId (String)
- partsUsed: Array of objects with:
  - part (ObjectId)
  - quantity (Number)
  - unitPrice (Number)
  - lineTotal (Number)
- totalCost (Number)
- createdAt (Date)

Security Considerations
- Passwords are hashed using bcrypt.  
- JWT tokens are used for user authentication.  
- CORS is restricted to known origins (local and Render deployments).  
- Sensitive values like MONGO_URI and JWT_SECRET are stored in .env.  

Core Features
- User login and authentication  
- Add, update, delete parts in inventory  
- Auto alerts when parts fall below restock threshold  
- Filter/search parts  
- Track parts used on a job  
- Calculate job totals and export invoice  
- Generate scannable barcodes per part  

User Flow
1. Login: Authenticates the user via cookie-based JWT.  
2. Dashboard: View inventory, search parts, see alerts.  
3. Add/Edit Part: Add new parts or update quantities/prices.  
4. Job Entry: Select parts used, input quantity, generate invoice.  
5. Invoice Export: Print or download PDF with job summary.  
6. Logout: Ends session securely.  

Stretch Features
- Scan barcodes via mobile device camera (React + Web APIs)  
- Email PDF invoice to customer  
- Admin dashboard with analytics (e.g., most used parts, usage trends)  

---

Live Demo
Frontend:  https://pipetrack.onrender.com
Backend: https://pipe-track-backend.onrender.com

---

Installation & Setup

1. Clone the Repository
```bash
git clone https://github.com/Kbenavid/Capstone.git
cd Capstone/server

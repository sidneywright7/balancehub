#  BalanceHub

A full-stack wellness forum where users can register, log in, and discuss topics related to health and wellbeing. Built as a final project for the Software Engineering Bootcamp.

 **Live App:** https://silly-blini-62fd2d.netlify.app  
 **API:** https://balancehub-server.onrender.com

---

##  About

BalanceHub is a themed Q&A forum focused on wellness topics. Users can ask and answer questions across five categories:

-  Fitness
-  Meditation
-  Sleep
-  Nutrition
-  Mental Health

---

##  Tech Stack

**Frontend**
- React
- React Router
- Axios
- CSS (custom earthy theme)

**Backend**
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs

**Deployment**
- Frontend: Netlify
- Backend: Render

---

##  Features

- User registration with validation
- Secure login with JWT authentication
- Password hashing with bcrypt
- Protected routes (dashboard requires login)
- Browse questions by category
- Ask questions in any category
- Answer questions posted by other users
- Search bar to filter questions
- Fully responsive design
- Logout functionality

---

##  Installation & Setup

### Prerequisites
- Node.js
- npm
- MongoDB Atlas account

### 1. Clone the repository
```bash
git clone https://github.com/sidneywright7/balancehub.git
cd balancehub
```

### 2. Set up the backend
```bash
cd server
npm install
```

Create a `.env` file in the server folder:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Seed the database with categories:
```bash
node seed.js
```

Start the server:
```bash
npm run dev
```

### 3. Set up the frontend
```bash
cd ../client
npm install
npm start
```

### 4. Open the app
Visit **http://localhost:3000** in your browser.

---

##  Project Structure
```
balancehub/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── context/        # Auth context
│       ├── pages/          # Login, Register, Dashboard
│       └── index.css       # Global styles
├── server/                 # Node/Express backend
│   ├── config/             # Database connection
│   ├── middleware/         # JWT auth middleware
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── seed.js             # Database seeder
│   └── server.js           # Entry point
└── README.md
```

---

##  Author

Sidney Wright  
[GitHub](https://github.com/sidneywright7)
🚀 QueryPilot

Talk to your database. No SQL required.

QueryPilot is a natural-language-to-SQL assistant. Users ask plain English questions about their data, and an AI agent inspects the live database schema, generates the correct SQL query, executes it safely, and explains the results in plain English, all in a ChatGPT-like interface.

✨ Features

- 🔐 Authentication: JWT-based signup and login with protected routes
- 🔌 MySQL Connection Management: securely connect any MySQL database with encrypted credential storage (AES)
- 💬 Natural Language Query Interface: ask questions in plain English, get SQL, results, and an explanation
- 🧠 AI SQL Agent: powered by LangChain.js tool-calling agents, inspects the real schema before generating queries so it does not invent tables or columns
- 🔄 Automatic AI Fallback: switches from Google Gemini to Mistral AI automatically if quota limits are hit
- 🛡️ Read-Only Safety Enforcement: destructive SQL (DROP, DELETE, TRUNCATE, ALTER, UPDATE, INSERT) is blocked at the tool level before execution, not just checked after
- 📜 Query History: view and reuse past questions per database connection, storing only metadata and never actual result data
- 🌗 Light and Dark Mode: true black dark theme, toggleable and persisted
- 📱 Fully Responsive: mobile-first, tablet, and desktop layouts
- 🧾 Markdown-Rendered Results: clean tables and syntax-highlighted SQL blocks

🛠️ Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS v4
- React Router
- Axios
- React Markdown with remark-gfm
- React Syntax Highlighter
- React Hot Toast
- Lucide Icons

**Backend**
- Node.js and Express.js
- LangChain.js, using the classic SQL Toolkit and tool-calling agents
- MongoDB and Mongoose for users, connection metadata, and query history
- MySQL, using mysql2 and typeorm, as the target database being queried
- JWT and bcrypt.js for authentication
- crypto-js for AES encryption of stored database credentials
- express-validator, express-rate-limit, and helmet for security

**AI Providers**
- 🤖 Google Gemini, model gemini-3.5-flash, used as the primary provider
- 🤖 Mistral AI, model mistral-small-latest, used as an automatic fallback

📁 Project Structure

```
QueryPilot/
├── backend/
│   ├── config/          # database connection setup
│   ├── controllers/     # business logic
│   ├── middleware/       # auth and validation
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express routes
│   ├── services/         # MySQL and LangChain SQL agent logic
│   ├── utils/             # encryption, JWT, SQL safety
│   └── server.js
└── frontend/
    └── src/
        ├── components/   # reusable UI components
        ├── context/       # auth and theme context
        ├── pages/         # route level pages
        └── services/      # axios API calls
```

⚙️ Setup and Installation

**Prerequisites**
- Node.js version 18 or higher
- MongoDB, local or Atlas
- A MySQL database to query, local through MySQL Workbench or cloud hosted
- Free API keys for Google Gemini and Mistral AI

**Backend**

Run inside the backend folder:

```bash
npm install
```

Create a `.env` file in `backend/` with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_32_char_min_encryption_key
GEMINI_API_KEY=your_gemini_api_key
MISTRAL_API_KEY=your_mistral_api_key
NODE_ENV=development
```

Start the server:

```bash
npm run dev
```

**Frontend**

Run inside the frontend folder:

```bash
npm install
```

Create a `.env` file in `frontend/` with the following variable:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:

```bash
npm run dev
```
🔒 Security Notes

MySQL credentials are encrypted at rest using AES before being stored in MongoDB, and are never stored in plaintext. Only SELECT queries are permitted, and any destructive SQL keyword is blocked at the LangChain tool level before it reaches the database. Query history stores only the question and the generated SQL, never the actual result data, to avoid storing sensitive business information. Rate limiting is applied to the query endpoint to prevent abuse. Passwords are hashed with bcrypt, and authentication uses JWT with protected routes on both frontend and backend.


📄 License

This project is for educational and portfolio purposes.
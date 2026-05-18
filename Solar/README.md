# Solar React - Full Stack Setup

This project contains both a React frontend and Node.js backend for a solar energy company website with contact form functionality.

## Project Structure

```
solar-react/
├── frontend/                 # React Vite application
│   ├── src/
│   │   ├── pages/           # Page components (Home, About, Contact, etc.)
│   │   ├── components/      # Reusable components (Navbar, Footer, etc.)
│   │   ├── styles/          # CSS files
│   │   ├── assets/          # Images and static assets
│   │   └── data/            # Data files
│   ├── package.json
│   └── vite.config.js
│
├── backend/                 # Express.js server
│   ├── server.js           # Main server file
│   ├── package.json
│   ├── .env.example        # Example environment variables
│   └── contact.db          # SQLite database (auto-created)
│
└── README.md               # This file
```

## Deploy on Railway

See **[RAILWAY.md](./RAILWAY.md)** for step-by-step deployment (single service: React + API + email).

## Quick Start

### 1. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at `http://localhost:5173`

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your SMTP credentials (optional)
# Then start the server
npm start
```

The backend will run at `http://localhost:5000`

## Admin submissions page

Visit `http://localhost:5173/admin` in the browser to see all saved contact submissions.

## Contact Form Features

✅ **Form Validation**
- All fields are required
- Email validation
- Real-time feedback

✅ **Success/Error Notifications**
- Green success box on successful submission
- Red error box on failure
- Clear, user-friendly messages

✅ **Email Integration**
- Submissions are sent to `raghav.enterpris1@gmail.com`
- Reply-To field contains the user's email address
- Formatted HTML and plain text emails

✅ **Database Storage**
- All submissions stored in SQLite
- Track submission status (pending, sent, failed)
- Timestamp for each submission

## Frontend Features

- Responsive design with Tailwind CSS
- React Router for navigation
- Contact form with real-time validation
- Success/error notifications
- Google Maps integration
- Company info display

## Backend Features

- Express.js REST API
- CORS enabled
- Email service with Nodemailer
- SQLite for persistent storage
- Environment-based configuration
- Error logging and handling

## API Routes

### Frontend to Backend Communication

The frontend proxy is configured in `frontend/vite.config.js` to forward `/api/*` requests to `http://localhost:5000`.

**Contact Form Submission:**
```
POST /api/contact
Body: { name, email, phone, message }
Response: { message: "Success or error message" }
```

**View Saved Submissions:**
```
GET /api/submissions
Response: { requests: [ ... ] }
```

**Health Check:**
```
GET /api/health
Response: { status: "ok" }
```

## Environment Setup for Gmail

1. Go to [Google Account](https://myaccount.google.com/)
2. Enable 2-Step Verification
3. Generate [App Password](https://support.google.com/accounts/answer/185833)
4. Add to `backend/.env`:
   ```
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-16-character-app-password
   EMAIL_FROM="Solar Energy <your-gmail@gmail.com>"
   ```

## Development Workflow

### Running Both Servers

**Terminal 1 (Frontend):**
```bash
cd frontend
npm run dev
```

**Terminal 2 (Backend):**
```bash
cd backend
npm start
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```
Output: `frontend/dist/`

**Backend:**
Simply run `npm start` (no build needed for Node.js)

## Troubleshooting

**Contact form not submitting?**
1. Check if backend server is running on port 5000
2. Check browser console for errors
3. Verify email credentials in `backend/.env`

**Backend won't start?**
1. Run `npm install` in backend folder
2. Create and configure `backend/.env` file
3. Check port 5000 isn't already in use

**Emails not sending?**
1. Verify SMTP credentials are correct
2. For Gmail: Use app-specific password (not account password)
3. Check firewall isn't blocking port 587
4. Look at backend console output for detailed error

## Dependencies

### Frontend
- React 19
- Vite
- React Router
- Tailwind CSS

### Backend
- Express.js
- Nodemailer
- SQLite3
- CORS
- dotenv

## License

MIT

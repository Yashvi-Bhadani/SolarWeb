# Solar React Backend

A Node.js + Express backend server that handles contact form submissions with email notifications and SQL database storage.

## Features

- ✅ Contact form submission handling
- ✅ Email notifications to `raghav.enterpris1@gmail.com`
- ✅ Reply-to field with user's email
- ✅ SQLite database for storing contact requests
- ✅ CORS enabled for frontend communication
- ✅ Error handling with detailed logging

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- SMTP email credentials (Gmail, SendGrid, or any SMTP provider)

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your SMTP credentials:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM="Solar Company <your-email@gmail.com>"
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   PORT=5000
   ```

   **For Gmail:**
   - Use your Gmail address for `EMAIL_USER`
   - Generate an [App Password](https://support.google.com/accounts/answer/185833) and use it for `EMAIL_PASS`
   - Keep other settings as shown above

## Running the Server

Start the backend server:
```bash
npm start
```

The server will listen on `http://localhost:5000` by default.

### Health Check
```bash
curl http://localhost:5000/api/health
```

## API Endpoints

### POST `/api/contact`
Submits a contact form request.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9876543210",
  "message": "I'm interested in solar energy solutions."
}
```

**Success Response (200):**
```json
{
  "message": "Your request has been submitted successfully. We will contact you soon."
}
```

**Error Response (400/500):**
```json
{
  "message": "Your request could not be submitted at this time. Please try again later."
}
```

## Database

Contact requests are stored in `contact.db` (SQLite). The database is automatically created on first run with this schema:

```sql
CREATE TABLE contact_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**Status values:** `pending`, `sent`, `failed`

## Email Flow

1. User submits the contact form from the frontend
2. Backend validates the form data
3. Request is saved to SQLite with status `pending`
4. Email is sent to `raghav.enterpris1@gmail.com`
   - Subject: "New contact request from [User Name]"
   - Reply-To: User's email address
   - Body: Contains all form fields
5. Request status is updated to `sent` or `failed`
6. Response is sent back to frontend with success or error message

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `EMAIL_USER` | Yes | - | SMTP username/email |
| `EMAIL_PASS` | Yes | - | SMTP password/app-specific password |
| `EMAIL_FROM` | No | EMAIL_USER | Display name and from address |
| `EMAIL_HOST` | No | smtp.gmail.com | SMTP server hostname |
| `EMAIL_PORT` | No | 587 | SMTP server port |
| `EMAIL_SECURE` | No | false | Use TLS/SSL (true/false) |
| `PORT` | No | 5000 | Server port |

## Troubleshooting

**"Email configuration is missing" error:**
- Ensure `.env` file exists with `EMAIL_USER` and `EMAIL_PASS`
- Verify you're using an app-specific password for Gmail (not your main password)

**"Cannot send mail" error:**
- Check SMTP credentials
- Verify firewall isn't blocking the SMTP port (587 or 465)
- Ensure the email account allows "Less secure app access" or app passwords

**Database locked error:**
- The `contact.db` file may be locked by another process
- Delete `contact.db` and restart the server (it will recreate it)

## License

MIT

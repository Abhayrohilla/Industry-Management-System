<<<<<<< HEAD
## Industry Management System (MERN + TypeScript)

Simple Industry Management module with login, industry CRUD, list, search, and details.

### 1. Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose, TypeScript, JWT
- **Frontend**: React.js, React Router, Axios, Vite, TypeScript

### 2. Project Structure

- `server` – Node/Express API
- `client` – React front-end

### 3. Backend Setup (`server`)

1. Go to the server folder:

   ```bash
   cd server
   npm install
   ```

2. Create a `.env` file based on `.env.example`:

   ```bash
   copy .env.example .env
   ```

   Edit values:

   - `APP_PORT` – API port (default `5000`)
   - `MONGODB_URI` – your MongoDB connection string
   - `JWT_SECRET` – any strong random string
   - `DEFAULT_INDUSTRY_EMAIL` – default login email (example: `industry@example.com`)
   - `DEFAULT_INDUSTRY_PASSWORD` – default login password (default: `Industry@007`)

3. Run the backend in dev mode:

   ```bash
   npm run dev
   ```

   API base URL: `http://localhost:5000/api`

### 4. Frontend Setup (`client`)

1. Go to the client folder:

   ```bash
   cd client
   npm install
   ```

2. Create `.env` from `.env.example`:

   ```bash
   copy .env.example .env
   ```

   - `VITE_API_BASE_URL` – backend base URL, for example `http://localhost:5000`

3. Run the React app:

   ```bash
   npm run dev
   ```

   Open the URL printed in the terminal (usually `http://localhost:5173`).

### 5. Login Details

- Email: value from `DEFAULT_INDUSTRY_EMAIL` (default `industry@example.com`)
- Password: value from `DEFAULT_INDUSTRY_PASSWORD` (default `Industry@007`)

On successful login you are redirected to the Industry Dashboard and a JWT token is stored in `localStorage`.

### 6. Features

- **Login**
  - Email + password login using one default account from env
  - JWT-based auth, protected routes on backend and frontend

- **Add New Industry**
  - Form fields: name, type, contact person, email, phone, address, city, state, country, website (optional), description (optional)
  - `createdAt` is automatically added by MongoDB timestamps

- **Industry List**
  - Table with: ID (short), name, type, contact person, email, phone, city, created date, actions
  - Pagination with page and limit
  - Sorted by `createdAt` (latest first)

- **Search**
  - Filters: name, type, city, email, contactPerson
  - Multiple filters can be used at the same time

- **View Details**
  - Full industry info with created date

- **Optional Enhancements Already Included**
  - Edit industry
  - Delete industry

### 7. Main Backend Files

- `server/src/index.ts` – creates Express app, connects to MongoDB, starts server
- `server/src/config/env.ts` – reads env variables
- `server/src/models/Industry.ts` – Mongoose schema and model
- `server/src/middleware/auth.ts` – JWT auth middleware
- `server/src/routes/auth.ts` – `/api/auth/login`
- `server/src/routes/industries.ts` – `/api/industries` CRUD + search + pagination

### 8. Main Frontend Files

- `client/src/main.tsx` – React root with router
- `client/src/App.tsx` – all routes (login, dashboard, list, form, detail)
- `client/src/hooks/useAuth.ts` – simple localStorage-based auth helper
- `client/src/api.ts` – Axios client that adds `Authorization` header
- `client/src/pages/LoginPage.tsx` – login screen
- `client/src/pages/DashboardPage.tsx` – dashboard with quick links
- `client/src/pages/IndustryListPage.tsx` – table list with search and pagination
- `client/src/pages/IndustryFormPage.tsx` – create and edit industry form
- `client/src/pages/IndustryDetailPage.tsx` – details view
- `client/src/styles.css` – simple modern styling

### 9. Postman Collection (optional)

You can create a Postman collection with these endpoints:

- `POST /api/auth/login`
- `GET /api/industries`
- `POST /api/industries`
- `GET /api/industries/:id`
- `PUT /api/industries/:id`
- `DELETE /api/industries/:id`

Use the JWT token from the login response as `Authorization: Bearer <token>`.

=======
# Industry-Management-System
>>>>>>> 3d7ab683744ea5ca50ee5bb9ac6ad240a14bd53b

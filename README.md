# Business Cards App — Node.js REST API

REST API server for a business-card management site: users can register, log in,
and (for business accounts) create, edit, and delete digital business cards.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environments](#environments)
- [Project Structure](#project-structure)
- [How a Request Flows Through the Server](#how-a-request-flows-through-the-server)
- [Authentication and Authorization](#authentication-and-authorization)
- [API Reference](#api-reference)
- [Data Models](#data-models)
- [Validation](#validation)
- [Initial Data](#initial-data)
- [Bonuses](#bonuses)
- [Logging](#logging)

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT authentication (`jsonwebtoken`)
- Joi validation
- bcryptjs password hashing
- morgan (request logging) + cors + dotenv

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ErezHaimov/Erez-Haimov-Business-Cards-App.git
cd Erez-Haimov-Business-Cards-App
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Then open `.env` and fill in:

| Variable          | Description                                                                                                                                                                                    |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PORT`            | Port the server will run on (default `8181`)                                                                                                                                                   |
| `NODE_ENV`        | `development` for local MongoDB, `production` for MongoDB Atlas                                                                                                                                |
| `MONGO_URI_LOCAL` | Connection string for a local MongoDB instance                                                                                                                                                 |
| `MONGO_URI_ATLAS` | **Put your MongoDB Atlas connection string here.** Get it from your Atlas dashboard → _Connect_ → _Drivers_, and replace `<username>` and `<password>` with your own database user credentials |
| `JWT_SECRET`      | Any long, random string used to sign authentication tokens                                                                                                                                     |

⚠️ **Never commit your real `.env` file.** It is already excluded via `.gitignore`. Only `.env.example` (with placeholder values) is tracked in the repo.

### 4. Run the server

```bash
npm run dev     # with auto-reload (nodemon)
# or
npm start
```

The server will seed 3 initial users (regular / business / admin) and 3 initial
cards automatically on first run.

### Default seeded users

| Role     | Email              | Password |
| -------- | ------------------ | -------- |
| Regular  | regular@gmail.com  | Aa1234!  |
| Business | business@gmail.com | Aa1234!  |
| Admin    | admin@gmail.com    | Aa1234!  |

## Environments

Controlled by `NODE_ENV` in `.env`:

| `NODE_ENV`    | Database used     |
| ------------- | ----------------- |
| `development` | `MONGO_URI_LOCAL` |
| `production`  | `MONGO_URI_ATLAS` |

`config/mongodb/connectToMongo.js` picks the connection string based on this value and seeds initial data if the collections are empty.

## Project Structure

```
├── app.js
├── config/
│   └── mongodb/
│       └── connectToMongo.js   # DB connection + seed trigger
├── initialData/                # seed data (3 users, 3 cards)
├── routes/                     # Express routers (users, cards)
├── controllers/                # route handlers / business logic
├── models/                     # Mongoose schemas (User, Card)
├── validation/                 # Joi schemas (user, user update, login, card)
├── middlewares/                # auth, cors, logging, 404, error handling
├── error/                      # custom HttpError class
└── utils/                      # generateToken, generateBizNumber
```

## How a Request Flows Through the Server

`app.js` registers middleware in this order:

1. **CORS** (`middlewares/cors.js`) — only whitelisted origins may call the API from a browser. Requests with no `Origin` header (Postman, curl, server-to-server) always pass.
2. **`express.json()`** — parses the request body.
3. **morgan** — logs every request to the console: timestamp, method, URL, status, response time.
4. **`fileLogger`** — watches each response and appends a line to `logs/<date>.log` whenever the status is 400 or above.
5. **The routers** — `/users` and `/cards`.
6. **`notFound`** — answers `404` for any address no route matched.
7. **`errorHandler`** — catches anything thrown or passed to `next(err)` and returns a clean status + message (including malformed JSON bodies, which return `400` instead of crashing).

## Authentication and Authorization

`POST /users/login` returns a JWT signed with `JWT_SECRET`. Its payload contains exactly:

```json
{ "_id": "...", "isBusiness": true, "isAdmin": false }
```

Every protected request sends it back in a header:

```
x-auth-token: <token>
```

| Middleware   | File                  | Passes when          |
| ------------ | --------------------- | -------------------- |
| `auth`       | `middlewares/auth.js` | the token is valid   |
| `isAdmin`    | `middlewares/auth.js` | `isAdmin` is true    |
| `isBusiness` | `middlewares/auth.js` | `isBusiness` is true |

Owner/self checks (e.g. "only the user themself or an admin") are done inline inside the relevant controller functions.

## API Reference

### Users

| Method | URL            | Auth        | Description                                              |
| ------ | -------------- | ----------- | -------------------------------------------------------- |
| POST   | `/users`       | Public      | Register a new user                                      |
| POST   | `/users/login` | Public      | Log in, returns JWT                                      |
| GET    | `/users`       | Admin       | Get all users                                            |
| GET    | `/users/:id`   | Owner/Admin | Get a single user                                        |
| PUT    | `/users/:id`   | Owner       | Edit user (password optional — only sent if changing it) |
| PATCH  | `/users/:id`   | Owner       | Toggle business status                                   |
| DELETE | `/users/:id`   | Owner/Admin | Delete user                                              |

### Cards

| Method | URL               | Auth            | Description       |
| ------ | ----------------- | --------------- | ----------------- |
| GET    | `/cards`          | Public          | Get all cards     |
| GET    | `/cards/my-cards` | Registered user | Get my cards      |
| GET    | `/cards/:id`      | Public          | Get a single card |
| POST   | `/cards`          | Business user   | Create a new card |
| PUT    | `/cards/:id`      | Owner           | Edit card         |
| PATCH  | `/cards/:id`      | Registered user | Like/unlike card  |
| DELETE | `/cards/:id`      | Owner/Admin     | Delete card       |

## Data Models

### User

```jsonc
{
	"name": { "first": "...", "middle": "", "last": "..." },
	"phone": "050-0000000",
	"email": "user@gmail.com",
	"password": "<bcrypt hash>",
	"image": { "url": "", "alt": "" },
	"address": {
		"state": "",
		"country": "...",
		"city": "...",
		"street": "...",
		"houseNumber": 5,
		"zip": 0,
	},
	"isAdmin": false,
	"isBusiness": true,
	"createdAt": "2026-09-18T00:00:00.000Z",
}
```

### Card

```jsonc
{
	"title": "...",
	"subtitle": "...",
	"description": "...",
	"phone": "050-0000000",
	"email": "card@gmail.com",
	"web": "https://...",
	"image": { "url": "", "alt": "" },
	"address": {
		"state": "",
		"country": "...",
		"city": "...",
		"street": "...",
		"houseNumber": 3,
		"zip": "0",
	},
	"bizNumber": 1234567,
	"likes": [],
	"user_id": "...",
	"createdAt": "2026-09-18T00:00:00.000Z",
}
```

## Validation

Every client-submitted object is validated with **Joi** before it reaches the database:

| Validator            | Used by                              |
| -------------------- | ------------------------------------ |
| `validateUser`       | `POST /users`                        |
| `validateUserUpdate` | `PUT /users/:id` (password optional) |
| `validateLogin`      | `POST /users/login`                  |
| `validateCard`       | `POST /cards`, `PUT /cards/:id`      |

On failure, the response is `400` with a clear Joi error message.

## Initial Data

On first run (empty database), 3 users and 3 cards are seeded automatically. Restarting the server never duplicates them (it checks `countDocuments()` first).

## Bonuses

### 1. Unique `bizNumber` on card creation

Every new card gets a randomly generated 7-digit `bizNumber`, guaranteed unique against existing cards (`utils/generateBizNumber.js`).

### 2. Daily file logger

Every response with status `400` or above is appended to `logs/<YYYY-MM-DD>.log`, containing the request timestamp, status code, method, URL, and status message. A day with no failed requests creates no file.

<!-- Add a "Blocking a user after 3 failed logins" section here once implemented -->

## Logging

- **Console**: `morgan` prints one line per request — timestamp, method, URL, status, response time.
- **File**: failed responses (400+) are additionally written to `logs/` — see [Bonuses](#bonuses).

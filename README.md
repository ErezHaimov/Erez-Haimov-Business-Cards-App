# Business Cards App — Node.js REST API

REST API server for a business-card management site: users can register, log in,
and (for business accounts) create, edit, and delete digital business cards.

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Joi validation
- bcryptjs password hashing

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/business-cards-app.git
cd business-cards-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example env file and fill in your own values:

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

## API Endpoints

### Users

| Method | URL            | Auth        | Description            |
| ------ | -------------- | ----------- | ---------------------- |
| POST   | `/users`       | Public      | Register a new user    |
| POST   | `/users/login` | Public      | Log in, returns JWT    |
| GET    | `/users`       | Admin       | Get all users          |
| GET    | `/users/:id`   | Owner/Admin | Get a single user      |
| PUT    | `/users/:id`   | Owner       | Edit user              |
| PATCH  | `/users/:id`   | Owner       | Toggle business status |
| DELETE | `/users/:id`   | Owner/Admin | Delete user            |

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

Authenticated requests must include the header:

```
x-auth-token: <your JWT token>
```

## Project Structure

```
├── app.js
├── config/mongodb/       # DB connection
├── initialData/          # seed data
├── routes/                # Express routers
├── controllers/           # route handlers / business logic
├── models/                 # Mongoose schemas
├── validation/             # Joi schemas
├── middlewares/            # auth, logging, error handling
└── utils/                  # helper functions
```

## License

MIT (or whatever license you choose)

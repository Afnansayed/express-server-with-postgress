# Basic Express + TypeScript + PostgreSQL (Neon) Server

This README describes the exact steps to create a **basic server** using **Express.js**, **TypeScript**, and **PostgreSQL (Neon DB)**. Follow the steps below in order.

---

## 1. Create Project Folder
The first step is to create a folder. Choose a name that reflects the project to keep everything organized and relevant.

```bash
mkdir my-express-ts-postgres
cd my-express-ts-postgres
```

---

## 2. Initialize Project
Run the command in the terminal:

```bash
npm init -y
```

> Optional: remove `"type"` from `package.json` if you don't want Node to treat files as ES modules.

---

## 3. Install Dependencies

### Install Express
```bash
npm install express
```

### Install TypeScript (dev dependency)
```bash
npm install -D typescript
```

### Install PostgreSQL client
```bash
npm install pg
```

### Install dotenv
```bash
npm install dotenv
```

### Install type declarations for Express (dev)
```bash
npm install --save-dev @types/express
```

### Install tsx for running TypeScript with live reload (dev)
```bash
npm install -D tsx
```

---

## 4. Initialize TypeScript Config
After installing TypeScript, run:

```bash
npx tsc --init
```

Open `tsconfig.json` and set/change the following to suit a simple project:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

Adjust values as needed for your environment.

---

## 5. Project Structure (suggested)
```
my-express-ts-postgres/
├─ src/
│  ├─ server.ts
│  ├─ db.ts
│  └─ routes/
│     └─ index.ts
├─ .env
├─ .gitignore
├─ package.json
├─ tsconfig.json
└─ README.md
```

---

## 6. Create `server.ts` (Hello World)
Open Express.js get started documentation and copy the hello world example into `src/server.ts` or use the example below:

```ts
// src/server.ts
import express from "express";
import dotenv from "dotenv";
import { initDB } from "./db";

dotenv.config(); // initialize dotenv immediately

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World from Express + TypeScript!");
});

// Initialize DB and then start server
initDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize DB:", err);
    process.exit(1);
  });
```

---

## 7. Create `db.ts` (Create Pool & Initialize Table)
Create a database helper file that creates a pool using the Neon connection string and initializes tables:

```ts
// src/db.ts
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.CONNECTION_STR
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export const initDB = async () => {
  // Example: create a users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(255) UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("DB initialized and users table ensured.");
};
```

> Make sure `CONNECTION_STR` is set in your `.env` file (see below).

---

## 8. Add scripts to `package.json`
Add these scripts to help development and production workflows:

```json
"scripts": {
  "dev": "tsx watch src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

Notes:
- The `dev` script uses `tsx watch` so it will watch for live changes and restart automatically.
- If you prefer `npx tsx watch example.ts` as your custom command, replace `src/server.ts` with your filename.

---

## 9. Run the Development Server
Run:

```bash
npm run dev
```

Check the terminal output and open `http://localhost:5000` to verify the server responds with the Hello World message.

---

## 10. Connect with PostgreSQL (Neon DB)
1. Install `pg` (already listed above).
2. Open Neon DB (https://neon.tech) and create a new project/database.
3. Copy the connection string from the Neon dashboard.
4. Put the connection string in your `.env` file:

```
CONNECTION_STR=postgres://username:password@host:port/dbname
PORT=5000
```

5. The pool in `src/db.ts` will use `process.env.CONNECTION_STR` to connect.

---

## 11. Initialize Database & Verify
In `src/db.ts` we created `initDB()` which runs the `CREATE TABLE IF NOT EXISTS` query. When the server starts it calls `initDB()` and ensures the `users` table exists.

To verify:
- Log in to the Neon dashboard → Open Query tool or Table Editor → confirm `users` table exists.
- Or run a quick query in code to fetch rows: `await query('SELECT * FROM users');`.

---

## 12. Secure Environment Variables Before Pushing to GitHub
**Important:** Initialize dotenv and never push `.env` to GitHub.

Create `.gitignore` with at least the following:

```
node_modules/
dist/
.env
```

Double-check repository does not contain your `.env` or any secrets. If you already pushed them, rotate credentials immediately and remove them from history using tools such as `git filter-branch` or `bfg` (Neon or DB credentials MUST be rotated).

---

## 13. Optional: Remove `type` from `package.json`
If `package.json` contains `"type": "module"` and you don't want ES module behavior, you can remove that field. TypeScript with `"module": "commonjs"` in `tsconfig.json` is common for Node projects.

---

## 14. Extra Tips & Troubleshooting

- If you get connection issues, verify `CONNECTION_STR` and that your Neon DB allows connections from your environment.
- Ensure `dotenv.config()` runs as early as possible (top of `src/server.ts`) so environment variables are available when creating the `Pool`.
- If types cause issues, ensure `@types/express` is installed and restart the TS server in your editor.
- If you prefer nodemon, you can use: `npm install -D nodemon` and set a script like `"dev": "nodemon --watch src -e ts --exec "tsx src/server.ts""`.

---

## 15. Example `.env` (DO NOT COMMIT)
```
CONNECTION_STR=postgres://username:password@host:port/dbname
PORT=5000
```

---

## 16. Final Checklist
- [ ] Project folder created
- [ ] `npm init -y` done
- [ ] Express installed
- [ ] TypeScript installed and `tsconfig.json` configured
- [ ] `npx tsc --init` ran
- [ ] `src/server.ts` created with Hello World
- [ ] `pg` installed and Neon DB project created
- [ ] `src/db.ts` created and `initDB()` called
- [ ] `dotenv` added and `.env` file created
- [ ] `@types/express` and `tsx` installed as dev dependencies
- [ ] `npm run dev` runs and server responds
- [ ] `.gitignore` includes `.env` and `node_modules/`
- [ ] Secrets rotated if accidentally pushed

---

If you'd like, I will:
- Generate this `README.md` file for you to download (ready now), or
- Also generate example `src/server.ts` and `src/db.ts` files for download.

Tell me which additional files you want (server.ts, db.ts, package.json), and I'll create downloadable files for you right away.

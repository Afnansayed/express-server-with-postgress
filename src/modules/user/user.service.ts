import { pool } from "../../config/db";

const createUser = async (name: string, email: string) => {
  const result = await pool.query(
    `INSERT INTO users(name,email) VALUES($1,$2) RETURNING *;`,
    [name, email]
  );
  console.log(result.rows[0], "form service user");
  return result;
};

export const userService = {
  createUser,
};

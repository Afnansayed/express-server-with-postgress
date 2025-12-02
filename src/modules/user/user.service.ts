import { pool } from '../../config/db';

const createUser = async (name: string, email: string) => {
  const result = await pool.query(
    `INSERT INTO users(name,email) VALUES($1,$2) RETURNING *;`,
    [name, email]
  );
  console.log(result.rows[0], 'form service user');
  return result;
};

const getUsers = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};

const getUserById = async (id: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return result;
};

const deleteUser = async (id: string) => {
  const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
  return result;
};

const updateUser = async (
  name: string,
  email: string,
  age: number,
  phone: string,
  address: string,
  id: string
) => {
  const result = await pool.query(
    `UPDATE users SET name = $1, email = $2 , age = $3 , phone = $4 , address = $5 WHERE id = $6 RETURNING *`,
    [name, email, age, phone, address, id]
  );
  return result;
};

export const userService = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};

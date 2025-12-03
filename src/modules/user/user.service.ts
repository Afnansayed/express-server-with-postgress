import { pool } from '../../config/db';
import bcrypt from 'bcryptjs';

const createUser = async (payload: Record<string, unknown>) => {
  const { name, email , password, role } = payload;
  
  const hashPass = await bcrypt.hash(password as string, 10);
  
  const result = await pool.query(
    `INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,$4) RETURNING *;`,
    [name, email, hashPass, role]
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

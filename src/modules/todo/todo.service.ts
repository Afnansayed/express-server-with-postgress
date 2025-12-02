import { Request } from 'express';
import { pool } from '../../config/db';

const createTodo = async (payload: Record<string, unknown>) => {
  const { user_id, title, description, completed, due_date } = payload;
  const result = await pool.query(
    `INSERT INTO todos(user_id,title,description,completed,due_date) VALUES($1,$2,$3,$4,$5) RETURNING *;`,
    [user_id, title, description, completed, due_date]
  );
  return result;
};

const getTodos = async () => {
  const result = await pool.query(`SELECT * FROM todos`);
  return result;
};

export const todoService = {
  createTodo,
  getTodos,
};

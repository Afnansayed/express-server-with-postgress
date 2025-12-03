import { pool } from '../../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../config';

const loginUser = async (paload: Record<string, unknown>) => {
  const { email, password } = paload;

  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  //  console.log({result});
  if (result.rows.length === 0) throw new Error('User Not Found');
  const user = result.rows[0];
  const match = await bcrypt.compare(password as string, user.password);
  if (!match) throw new Error('Invalid Password');
  console.log(match, user);

  const token = jwt.sign(
    { name: user.name, email: user.email, role: user.role },
    config.jwtSecret as string,
    {
      expiresIn: '7d',
    }
  );

  return { token: token, user };
};

export const authService = {
  loginUser,
};

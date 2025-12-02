import express, { Request, Response } from 'express';
import config from './config';
import initDB, { pool } from './config/db';
import loger from './middleware/logger';
import { userRouter } from './modules/user/user.routes';

const app = express();
const port = config.port;

//parser
app.use(express.json());
initDB();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World! I am a typescript server');
});

// curd operation for users
app.use('/users', userRouter);

// curd operation for todos
app.post('/todos', async (req: Request, res: Response) => {
  const { user_id, title, description, completed, due_date } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO todos(user_id,title,description,completed,due_date) VALUES($1,$2,$3,$4,$5) RETURNING *;`,
      [user_id, title, description, completed, due_date]
    );
    // console.log(result.rows[0]);
    res.status(201).json({
      success: true,
      message: 'Data Instered Successfully',
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//get all todos
app.get('/todos', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM todos`);

    res.status(200).json({
      success: true,
      message: 'todos retrieved successfully',
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      datails: err,
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Page Not Found',
    path: req.path,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

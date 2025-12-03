import express, { Request, Response } from 'express';
import config from './config';
import initDB from './config/db';
import { userRouter } from './modules/user/user.routes';
import { todoRouter } from './modules/todo/todo.routes';
import { authRouter } from './modules/auth/auth.routes';

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
app.use('/todos', todoRouter);

// authentication
app.use('/auth', authRouter);

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

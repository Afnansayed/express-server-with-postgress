import express from 'express';
import { todoController } from './todo.controller';

const route = express.Router();

route.post('/', todoController.createTodo);
route.get('/', todoController.getToDos);

export const todoRouter = route;

import { Request, Response } from 'express';
import { todoService } from './todo.service';

const createTodo = async (req: Request, res: Response) => {
  try {
    const result = await todoService.createTodo(req.body);
    // console.log(result.rows[0]);
    res.status(201).json({
      success: true,
      message: 'Data Inserted Successfully',
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getToDos = async (req: Request, res: Response) => {
  try {
    const result = await todoService.getTodos();

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
};

export const todoController = {
  createTodo,
  getToDos,
};

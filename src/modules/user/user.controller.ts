import { Request, Response } from 'express';
import { userService } from './user.service';

const createUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const result = await userService.createUser(name, email);
    //   console.log(result.rows[0]);
    res.status(201).send({
      success: true,
      message: 'Data Instered Successfully',
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).send({
      succes: false,
      message: err.message,
    });
  }
};

const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUsers();
    res.status(200).json({
      success: true,
      message: 'Data Fetched Successfully',
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUserById(req.params.id!);
    console.log(result.rows);
    if (result.rows.length > 0) {
      res.status(200).json({
        success: true,
        message: 'Data Fetched Successfully',
        data: result.rows[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Data Not Found',
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const { name, email, age, phone, address } = req.body;
  try {
    const result = await userService.updateUser(
      name,
      email,
      age,
      phone,
      address,
      req.params.id!
    );
    console.log(result.rows);
    if (result.rows.length > 0) {
      res.status(200).json({
        success: true,
        message: 'Data Updated Successfully',
        data: result.rows[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Data Not Found',
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.deleteUser(req.params.id!);
    console.log(result.rowCount);
    if (result.rowCount !== 0) {
      res.status(200).json({
        success: true,
        message: 'Data Deleted Successfully',
        data: result.rows,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Data Not Found',
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const userController = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};

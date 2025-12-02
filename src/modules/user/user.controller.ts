import { Request, Response } from "express";
import { userService } from "./user.service";


const createUser =  async  (req: Request, res: Response) =>{
  const {name , email} = req.body;
  try{
      const result = await userService.createUser(name , email);
    //   console.log(result.rows[0]);
      res.status(201).send({
        success: true,
        message: "Data Instered Successfully",
        data: result.rows[0]
      })
  }catch(err:any){
    res.status(500).send({
      succes: false,
      message: err.message
    })
  }
}

export const userController = {
  createUser
}
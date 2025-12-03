import { Request, Response } from "express";
import { authService } from "./auth.service";



const loginUser = async (req: Request, res: Response) => {
    try {
        const result = await authService.loginUser(req.body);
        res.status(200).send({
            success: true,
            message: 'Login Successfully',
            data: result,
        });
    } catch (err: any) {
        res.status(500).send({
            success: false,
            message: err.message,
        });
    }
}

export const authController = {
    loginUser
}
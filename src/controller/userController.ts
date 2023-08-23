import userModel from "../model/UserModel";
import { Request, Response } from 'express';
import {hashPassword, verifyPassword} from "../utils/passwordHashing";
import jwt from 'jsonwebtoken';
import {loginInput, signupInput} from "../types/ZodTypes";


// @desc save use to the database if not already present
export async function signup(req: Request, res: Response): Promise<Response> {
    try {
        // input validation
        const parsedResponse = signupInput.safeParse(req.body);
        if (!parsedResponse.success) {
            return res.status(401).json({
                status: false,
                msg: 'Invalid Input',
            });
        }

        // Check if username is already present, else save
        const { username, password} = req.body;
        const isUser = await userModel.findOne({ username });
        if (isUser) {
            return res.status(401).json({ status: false, msg: 'User already exits!!' });
        } else {
            const securePassword = hashPassword(password);
            await userModel.create({ username, securePassword });
        }
        if (!process.env.SECRET) return res.status(500);
        const token = jwt.sign({ username }, process.env.SECRET);
        return res.status(200).json({ status: true, token });
    }
    catch (ex) {
        console.log(ex);
        return res.status(500).json({ status: false, msg: 'Internal Server Error!!' });
    }
}

export async function login(req: Request, res: Response): Promise<Response> {
    try {
        const parsedResponse = loginInput.safeParse(req.body);
        if (!parsedResponse.success) {
            return res.status(401).json({
                status: false,
                msg: 'Invalid Input',
            });
        }

        // Check if username is present, else invalid
        const { username, password } = req.body;
        const user = await userModel.findOne({ username });

        if (!user) {
            return res.status(401).json({ status: false, msg: 'Invalid Username Or Password' });
        }

        // Verify the provided password against the hashed password
        const isPasswordValid = verifyPassword(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ status: false, msg: 'Invalid Username Or Password' });
        }

        if (!process.env.SECRET) {
            return res.status(500);
        }

        const token = jwt.sign({ username }, process.env.SECRET);
        return res.status(200).json({ status: true, token });
    } catch (ex) {
        console.log(ex);
        return res.status(500).json({ status: false, msg: 'Internal Server Error!!' });
    }
}

export async function me(req: Request, res: Response): Promise<Response> {
    try {
        const username = req.headers.username;
        return res.status(200).json({ status: true, username });
    }
    catch (ex) {
        console.log(ex);
        return res.status(500).json({ status: false, msg: 'Internal Server Error!!' });
    }
}


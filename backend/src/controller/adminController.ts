import { Request, Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import 'dotenv/config';
import isValidName from '../helper/isValidUsername';
import bcrypt from "bcrypt";


const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response) => {
    // @ts-ignore
    if (req.user.role !== Role.ADMIN) {
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}

export const addUser = async (req: Request, res: Response) => {
    // @ts-ignore
    if (req.user.role !== Role.ADMIN) {
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
    
        const existingLogin = await prisma.user.findFirst({ where: { email } });
    
        if (existingLogin) {
            return res.status(409).json({ error: "User already exists" });
        }
    
        if (!isValidName(username)) {
            return res.status(400).json({ error: "Invalid username [a-z0-9_]" });
        }
    
        const hashedPassword = await bcrypt.hash(password, 12);
        
        // Create a new login for the user
        const newUser = await prisma.user.create({
        data: {
            email: email,
            name: username,
            password: hashedPassword,
        },
        });
    
        const responseObject = {
        message: "User successfully created",
        username: username,
        email: email,
        };
    
        return res.status(201).json(responseObject);
    } catch (err) {
        return res.status(500).json({ error: "Error creating user" });
    }
};


export const editUser = async (req: Request, res: Response) => {
    // @ts-ignore
    if (req.user.role !== Role.ADMIN) {
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        const { id } = req.params;
        const user = await prisma.user.update({
            where: { id },
            data: req.body
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    // @ts-ignore
    if (req.user.role !== Role.ADMIN) {
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        const { id } = req.params;
        await prisma.user.delete({
            where: { id }
        });
        res.json({ success: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
}

export default {
    getUsers,
    addUser,
    editUser,
    deleteUser
}

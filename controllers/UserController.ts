import { Request, Response } from "express";
import { pool } from "../connect";
import { User } from "../models/User";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from "dotenv-safe";

dotenv.config();

const jwtToken = String(process.env.JWT);

export class UserController {
    static async login(req: Request, res: Response) {
        const { username, password } = req.body;

        try {
            const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

            if (userResult.rows.length === 0 || !bcrypt.compareSync(password, userResult.rows[0].password)) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }

            const user = new User(userResult.rows[0].id, userResult.rows[0].username, userResult.rows[0].password);

            const token = jwt.sign({ userId: user.id }, jwtToken, { expiresIn: '1h' });

            res.json({ token });
        } catch (err) {
            console.error('Erro ao autenticar', err);
            res.status(500).send('Erro ao autenticar');
        }
    }

    static async register(req: Request, res: Response) {
        const { username, password } = req.body;

        try {
            const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

            if (existingUser.rows.length > 0) {
                return res.status(400).json({ error: 'Usuário já existe' });
            }

            const hashedPassword = bcrypt.hashSync(password, 10);

            const newUser = await pool.query(
                'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
                [username, hashedPassword]
            );

            const user = new User(newUser.rows[0].id, newUser.rows[0].username, newUser.rows[0].password);

            const token = jwt.sign({ userId: user.id }, jwtToken, { expiresIn: '1h' });

            res.json({ token });
        } catch (err) {
            console.error('Erro ao registrar', err);
            res.status(500).send('Erro ao registrar');
        }
    }

    static async findAll(req: Request, res: Response) {
        try {
            const userResult = await pool.query('SELECT * FROM users');

            if (userResult.rows.length === 0) {
                return res.status(404).json({ error: 'Nenhum usuário encontrado' });
            }
            res.json(userResult.rows);
        } catch (err) {
            console.error('Erro ao obter usuários', err);
            res.status(500).send('Erro ao obter usuários');
        }
    }

    static async getById(req: Request, res: Response) {
        const userId = parseInt(req.params.id);

        try {
            const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

            if (userResult.rows.length === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            const user = new User(userResult.rows[0].id, userResult.rows[0].username, userResult.rows[0].password);

            res.json(user);
        } catch (err) {
            console.error('Erro ao obter usuário por ID', err);
            res.status(500).send('Erro ao obter usuário por ID');
        }
    }

    static async update(req: Request, res: Response) {
        const userId = parseInt(req.params.id);
        const { username, password } = req.body;

        try {
            const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

            if (userResult.rows.length === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            const updatedUserResult = await pool.query(
                'UPDATE users SET username = COALESCE($1, username), password = COALESCE($2, password) WHERE id = $3 RETURNING *',
                [username, password, userId]
            );

            const updatedUser = new User(
                updatedUserResult.rows[0].id,
                updatedUserResult.rows[0].username,
                updatedUserResult.rows[0].password
            );

            res.json(updatedUser);
        } catch (err) {
            console.error('Erro ao atualizar usuário', err);
            res.status(500).send('Erro ao atualizar usuário');
        }
    }

    static async delete(req: Request, res: Response) {
        const userId = parseInt(req.params.id);

        try {
            const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

            if (userResult.rows.length === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            
            await pool.query('DELETE FROM users WHERE id = $1', [userId]);

            res.json({ message: 'Usuário excluído com sucesso' })
            
        } catch (err) {
            console.error('Erro ao deletar usuário', err);
            res.status(500).send('Erro ao deletar usuário');
        }
    }
}
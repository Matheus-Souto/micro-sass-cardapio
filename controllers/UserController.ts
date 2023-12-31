import { Request, Response } from "express";
import { pool } from "../connect";
import { User, UserDTO } from "../models/User";
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

            const user = new User(userResult.rows[0].id, userResult.rows[0].username, userResult.rows[0].password, userResult.rows[0].email, userResult.rows[0].cpf);

            const token = jwt.sign({ userId: user.id }, jwtToken, { expiresIn: '1h' });

            res.json({ token });
        } catch (err) {
            console.error('Erro ao autenticar', err);
            res.status(500).send('Erro ao autenticar');
        }
    }

    static async register(req: Request, res: Response) {
        const { username, password, email, cpf } = req.body;

        try {
            const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
            const existingEmail = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            const existingCpf = await pool.query('SELECT * FROM users WHERE cpf = $1', [cpf]);

            if (existingUser.rows.length > 0) {
                return res.status(400).json({ error: 'Usuário já existe' });
            }

            if (existingEmail.rows.length > 0) {
                return res.status(400).json({ error: 'E-mail já cadastrado' });
            }

            if (existingCpf.rows.length > 0) {
                return res.status(400).json({ error: 'CPF já cadastrado' });
            }

            const hashedPassword = bcrypt.hashSync(password, 10);

            const newUser = await pool.query(
                'INSERT INTO users (username, password, email, cpf) VALUES ($1, $2, $3, $4) RETURNING *',
                [username, hashedPassword, email, cpf]
            );

            const user = new User(newUser.rows[0].id, newUser.rows[0].username, newUser.rows[0].password, newUser.rows[0].email, newUser.rows[0].cpf);

            const token = jwt.sign({ userId: user.id }, jwtToken, { expiresIn: '1h' });

            res.json({ token });
        } catch (err) {
            console.error('Erro ao registrar', err);
            res.status(500).send('Erro ao registrar');
        }
    }

    static async findAll(req: Request, res: Response) {
        try {
            const userResult = await pool.query('SELECT id, username, ' + 
            'email, cpf FROM users');

            if (userResult.rows.length === 0) {
                return res.status(404).json({ error: 'Nenhum usuário encontrado' });
            }
            res.json(userResult.rows);
        } catch (err) {
            console.error('Erro ao obter usuários', err);
            res.status(500).send('Erro ao obter usuários');
        }
    }

    static async findById(req: Request, res: Response) {
        const userId = parseInt(req.params.id);

        try {
            const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

            if (userResult.rows.length === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            const user = new UserDTO(userResult.rows[0].id, userResult.rows[0].username, userResult.rows[0].email, userResult.rows[0].cpf);

            res.json(user);
        } catch (err) {
            console.error('Erro ao obter usuário por ID', err);
            res.status(500).send('Erro ao obter usuário por ID');
        }
    }

    static async update(req: Request, res: Response) {
        const userId = parseInt(req.params.id);
        const { username, password, cpf, email } = req.body;

        const existingUser = await pool.query('SELECT * FROM users WHERE username = $1 AND id != $2', [username, userId]);
        const existingEmail = await pool.query('SELECT * FROM users WHERE email = $1 AND id != $2', [email, userId]);
        const existingCpf = await pool.query('SELECT * FROM users WHERE cpf = $1 AND id != $2', [cpf, userId]);

            if (existingUser.rows.length > 0) {
                return res.status(400).json({ error: 'Usuário já existe' });
            }

            if (existingEmail.rows.length > 0) {
                return res.status(400).json({ error: 'E-mail já cadastrado' });
            }

            if (existingCpf.rows.length > 0) {
                return res.status(400).json({ error: 'CPF já cadastrado' });
            }

        try {
            const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

            if (userResult.rows.length === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            const hashedPassword = bcrypt.hashSync(password, 10);

            const updatedUserResult = await pool.query(
                'UPDATE users SET username = COALESCE($1, username), password = COALESCE($2, password), ' + 
                'cpf = COALESCE($3, cpf), email = COALESCE($4, email) WHERE id = $5 RETURNING *',
                [username, hashedPassword, cpf, email, userId]
            );

            const updatedUser = new UserDTO(
                updatedUserResult.rows[0].id, updatedUserResult.rows[0].username, updatedUserResult.rows[0].email, updatedUserResult.rows[0].cpf
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
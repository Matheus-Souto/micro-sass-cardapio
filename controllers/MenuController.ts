import { Request, Response } from "express";
import { Menu } from "../models/Menu";
import { pool } from "../connect";

export class MenuController {
    static async findAll(req: Request, res: Response) {
        try {
            const client = await pool.connect();
            const result = await client.query('SELECT * FROM menu');
            client.release();

            const menuItems = result.rows.map(row => new Menu(row.id, row.nome, row.preco));
            res.json(menuItems);
        } catch (err) {
            console.error('Erro ao consultar o banco de dados', err);
            res.status(500).send('Erro ao consultar o banco de dados');
        }
    }

    static async findById(req: Request, res: Response) {
        const menuId = parseInt(req.params.id);

        try {
            const menuResult = await pool.query('SELECT * FROM menu WHERE id = $1', [menuId]);

            if (menuResult.rows.length === 0) {
                return res.status(404).json({ error: 'Item não encontrado' });
            }

            const menu = new Menu(menuResult.rows[0].id, menuResult.rows[0].nome, menuResult.rows[0].preco);

            res.json(menu);
        } catch (err) {
            console.error('Erro ao obter item por ID', err);
            res.status(500).send('Erro ao obter item por ID');
        }
    }

    static async createMenu(req: Request, res: Response) {
        const { nome, preco } = req.body;

        try {
            const newMenu = await pool.query(
                'INSERT INTO menu (nome, preco) VALUES ($1, $2) RETURNING *',
                [nome, preco]
            );

            const menu = new Menu(newMenu.rows[0].id, newMenu.rows[0].nome, newMenu.rows[0].preco);

            res.json(menu);
        } catch (err) {
            console.error('Erro ao cadastrar item', err);
            res.status(500).send('Erro ao cadastrar item');
        }
    }

    static async updateMenu(req: Request, res: Response) {
        const menuId = parseInt(req.params.id);
        const { nome, preco } = req.body;

        try {
            const menuResult = await pool.query('SELECT * FROM menu WHERE id = $1', [menuId]);

            if (menuResult.rows.length === 0) {
                return res.status(404).json({ error: 'Item não encontrado' });
            }

            const updatedMenuResult = await pool.query(
                'UPDATE menu SET nome = COALESCE($1, nome), preco = COALESCE($2, preco) WHERE id = $3 RETURNING *',
                [nome, preco, menuId]
            );

            const updatedMenu = new Menu(
                updatedMenuResult.rows[0].id,
                updatedMenuResult.rows[0].nome,
                updatedMenuResult.rows[0].preco
            );

            res.json(updatedMenu);
        } catch (err) {
            console.error('Erro ao atualizar item', err);
            res.status(500).send('Erro ao atualizar item');
        }
    }

    static async delete(req: Request, res: Response) {
        const menuId = parseInt(req.params.id);

        try {
            const menuResult = await pool.query('SELECT * FROM menu WHERE id = $1', [menuId]);

            if (menuResult.rows.length === 0) {
                return res.status(404).json({ error: 'Item não encontrado' });
            }

            await pool.query('DELETE FROM menu WHERE id = $1', [menuId]);

            res.json({ message: 'Item excluído com sucesso' })
        } catch (err) {
            console.error('Erro ao deletar item', err);
            res.status(500).send('Erro ao deletar item');
        }
    }
}
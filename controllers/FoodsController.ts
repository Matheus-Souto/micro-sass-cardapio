import { Request, Response } from "express";
import { Foods } from "../models/Foods";
import { pool } from "../connect";

export class FoodsController {
    static async findAll(req: Request, res: Response) {
        try {
            const client = await pool.connect();
            const result = await client.query('SELECT * FROM comidas');
            client.release();

            const foodsItems = result.rows.map(row => new Foods(row.id, row.nome, row.preco, row.categorias_id));
            res.json(foodsItems);
        } catch (err) {
            console.error('Erro ao consultar o banco de dados', err);
            res.status(500).json({ message: 'Erro ao consultar o banco de dados' });
        }
    }

    static async findById(req: Request, res: Response) {
        const foodsId = parseInt(req.params.id);

        try {
            const foodsResult = await pool.query('SELECT * FROM comidas WHERE id = $1', [foodsId]);

            if (foodsResult.rows.length === 0) {
                return res.status(404).json({ error: 'Item não encontrado' });
            }

            const foods = new Foods(foodsResult.rows[0].id, foodsResult.rows[0].nome, foodsResult.rows[0].preco, foodsResult.rows[0].categorias_id);

            res.json(foods);
        } catch (err) {
            console.error('Erro ao obter item por ID', err);
            res.status(500).json({ message: 'Erro ao obter item por ID' });
        }
    }

    static async createFoods(req: Request, res: Response) {
        const { nome, preco, categorias_id } = req.body;

        if (!categorias_id) {
            return res.status(500).json({ message: 'Necessário informar categorias_id' });
        }

        try {
            const newFoods = await pool.query(
                'INSERT INTO comidas (nome, preco, categorias_id) VALUES ($1, $2, $3) RETURNING *',
                [nome, preco, categorias_id]
            );

            const foods = new Foods(newFoods.rows[0].id, newFoods.rows[0].nome, newFoods.rows[0].preco, newFoods.rows[0].categorias_id);

            res.json(foods);
        } catch (err) {
            console.error('Erro ao cadastrar item', err);
            res.status(500).json({ message: 'Erro ao cadastrar item' });
        }
    }

    static async updateFoods(req: Request, res: Response) {
        const foodsId = parseInt(req.params.id);
        const { nome, preco, categorias_id } = req.body;

        try {
            const menuResult = await pool.query('SELECT * FROM comidas WHERE id = $1', [foodsId]);

            if (menuResult.rows.length === 0) {
                return res.status(404).json({ error: 'Item não encontrado' });
            }

            const updatedFoodsResult = await pool.query(
                'UPDATE comidas SET nome = COALESCE($1, nome), preco = COALESCE($2, preco) WHERE id = $3 RETURNING *',
                [nome, preco, foodsId]
            );

            const updatedFoods = new Foods(
                updatedFoodsResult.rows[0].id,
                updatedFoodsResult.rows[0].nome,
                updatedFoodsResult.rows[0].preco,
                updatedFoodsResult.rows[0].categorias_id
            );

            res.json(updatedFoods);
        } catch (err) {
            console.error('Erro ao atualizar item', err);
            res.status(500).json({ message: 'Erro ao atualizar item' });
        }
    }

    static async delete(req: Request, res: Response) {
        const foodsId = parseInt(req.params.id);

        try {
            const foodsResult = await pool.query('SELECT * FROM comidas WHERE id = $1', [foodsId]);

            if (foodsResult.rows.length === 0) {
                return res.status(404).json({ error: 'Item não encontrado' });
            }

            await pool.query('DELETE FROM comidas WHERE id = $1', [foodsId]);

            res.json({ message: 'Item excluído com sucesso' })
        } catch (err) {
            console.error('Erro ao deletar item', err);
            res.status(500).json({ message: 'Erro ao deletar item' });
        }
    }
}
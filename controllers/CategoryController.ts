import { Request, Response } from "express";
import { Category } from "../models/Category";
import { pool } from "../connect";

export class CategoryController {
    static async findAll(req: Request, res: Response) {
        try {
            const client = await pool.connect();
            const result = await client.query('SELECT * FROM categorias');
            client.release();

            const categoryItems = result.rows.map(row => new Category(row.id, row.nome, row.descricao, row.user_id));
            res.json(categoryItems);
        } catch (err) {
            console.error('Erro ao consultar o banco de dados', err);
            res.status(500).json({ message: 'Erro ao consultar o banco de dados' });
        }
    }

    static async findById(req: Request, res: Response) {
        const categoriesId = parseInt(req.params.id);

        try {
            const categoriesResult = await pool.query('SELECT * FROM categorias WHERE id = $1', [categoriesId]);

            if (categoriesResult.rows.length === 0) {
                return res.status(404).json({ error: 'Categoria não encontrada' });
            }

            const categories = new Category(categoriesResult.rows[0].id, categoriesResult.rows[0].nome, categoriesResult.rows[0].descricao, categoriesResult.rows[0].user_id);

            res.json(categories);
        } catch (err) {
            console.error('Erro ao obter categoria por ID', err);
            res.status(500).json({ message: 'Erro ao categoria item por ID' });
        }
    }

    static async createCategory(req: Request, res: Response) {
        const { nome, descricao, user_id } = req.body;

        if (!user_id) {
            return res.status(500).json({ message: 'Necessário informar user_id' });
        }

        try {
            const newCategory = await pool.query(
                'INSERT INTO categorias (nome, descricao, user_id) VALUES ($1, $2, $3) RETURNING *',
                [nome, descricao, user_id]
            );

            const categories = new Category(newCategory.rows[0].id, newCategory.rows[0].nome, newCategory.rows[0].descricao, newCategory.rows[0].user_id);

            res.json(categories);
        } catch (err) {
            console.error('Erro ao cadastrar categoria', err);
            res.status(500).json({ message: 'Erro ao cadastrar categoria' });
        }
    }

    static async updateCategory(req: Request, res: Response) {
        const userId = parseInt(req.params.id);
        const { nome, descricao, user_id } = req.body;

        try {
            const categoryResult = await pool.query('SELECT * FROM categorias WHERE id = $1', [userId]);

            if (categoryResult.rows.length === 0) {
                return res.status(404).json({ error: 'Categoria não encontrada' });
            }

            const updatedCategoryResult = await pool.query(
                'UPDATE categorias SET nome = COALESCE($1, nome), descricao = COALESCE($2, descricao) WHERE id = $3 RETURNING *',
                [nome, descricao, userId]
            );

            const updatedCategory = new Category(
                updatedCategoryResult.rows[0].id,
                updatedCategoryResult.rows[0].nome,
                updatedCategoryResult.rows[0].descricao,
                updatedCategoryResult.rows[0].user_id
            );

            res.json(updatedCategory);
        } catch (err) {
            console.error('Erro ao atualizar categoria', err);
            res.status(500).json({ message: 'Erro ao atualizar categoria' });
        }
    }

    static async delete(req: Request, res: Response) {
        const categoryId = parseInt(req.params.id);

        try {
            const categoryResult = await pool.query('SELECT * FROM categorias WHERE id = $1', [categoryId]);

            if (categoryResult.rows.length === 0) {
                return res.status(404).json({ error: 'Categoria não encontrada' });
            }

            await pool.query('DELETE FROM categorias WHERE id = $1', [categoryId]);

            res.json({ message: 'Categoria excluída com sucesso' })
        } catch (err) {
            console.error('Erro ao deletar categoria', err);
            res.status(500).json({ message: 'Erro ao deletar categoria' });
        }
    }
}
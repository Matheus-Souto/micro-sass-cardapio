import { Request, Response } from "express";
import { pool } from "../connect";
import { Menu } from "../models/Menu";

export class MenuController {
    static async findAll(req: Request, res: Response) {
        try {
            const menuResult = await pool.query(
                'SELECT comidas.*, categorias.id AS id_category, categorias.nome AS nome_category, ' +
                'categorias.descricao AS descricao_category, users.id AS user_id, comidas.id AS id_food, comidas.nome AS nome_food, ' +
                'comidas.preco AS preco_food FROM comidas ' +
                'JOIN categorias ON comidas.categorias_id = categorias.id ' +
                'JOIN users ON categorias.user_id = users.id'
            );

            if (menuResult.rows.length === 0) {
                return res.status(404).json({ error: 'Cardápio não encontrado' });
            }

            const menu = menuResult.rows.map((row) => ({
                category: 
                    {
                        id: row.id_category,
                        name: row.nome_category,
                        description: row.descricao_category,
                    },
                user_id: row.user_id,
                food: 
                    {
                        id: row.id_food,
                        name: row.nome_food,
                        price: row.preco_food,
                    },
            }));

            res.json(menu)
        } catch (err) {
            console.error('Erro ao buscar pedidos', err);
            return res.status(404).json({ error: 'Cardápio não encontrado' });
        }
    }

    static async findByUserId(req: Request, res: Response) {
        const userId = parseInt(req.params.id);
        
        try {
            const menuResult = await pool.query(
                'SELECT comidas.*, categorias.id AS id_category, categorias.nome AS nome_category, ' +
                'categorias.descricao AS descricao_category, users.id AS user_id, comidas.id AS id_food, comidas.nome AS nome_food, ' +
                'comidas.preco AS preco_food FROM comidas ' +
                'JOIN categorias ON comidas.categorias_id = categorias.id ' +
                'JOIN users ON categorias.user_id = users.id ' + 
                'WHERE users.id = $1',
                [userId]
            );

            if (menuResult.rows.length === 0) {
                return res.status(404).json({ error: 'Cardápio não encontrado' });
            }

            const menu = menuResult.rows.map((row) => ({
                category: 
                    {
                        id: row.id_category,
                        name: row.nome_category,
                        description: row.descricao_category,
                    },
                user_id: row.user_id,
                food: 
                    {
                        id: row.id_food,
                        name: row.nome_food,
                        price: row.preco_food,
                    },
            }));
            res.json(menu);
        } catch (err) {
            console.error('Erro ao buscar cardápio pelo id do usuário', err);
            return res.status(404).json({ error: 'Cardápio não encontrado' });
        }
    }

    
}
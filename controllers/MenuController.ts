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

            const menu = menuResult.rows.map(
                (row) => new Menu(
                    row.id_category,
                    row.nome_category,
                    row.descricao_category,
                    row.user_id,
                    row.id_food,
                    row.nome_food,
                    row.preco_food,
                    row.categorias_id
                )
            );

            res.json(menu)
        } catch (err) {
            console.error('Erro ao buscar pedidos', err);
            res.status(500).send('Erro ao buscar pedidos');
        }
    }
}
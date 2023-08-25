import { Request, Response } from "express";
import { pool } from "../connect";
import { Restaurants } from "../models/Restaurants";

export class RestaurantController {
    static async findAll(req: Request, res: Response) {
        try {
            const client = await pool.connect();
            const result = await client.query('SELECT * FROM restaurantes');
            client.release();

            const restaurantItems = result.rows.map(row => new Restaurants(row.id, row.nome, row.telefone, row.cpfcnpj, row.user_id));
            res.json(restaurantItems);
        } catch (err) {
            console.error('Erro ao consultar o banco de dados', err);
            res.status(500).json({ message: 'Erro ao consultar o banco de dados' });
        }
    }

    static async findById(req: Request, res: Response) {
        const restaurantId = parseInt(req.params.id);

        try {
            const restaurantResult = await pool.query('SELECT * FROM restaurantes WHERE id = $1', [restaurantId]);

            if (restaurantResult.rows.length === 0) {
                return res.status(404).json({ error: 'Restaurante não encontrado' });
            }

            const restaurants = new Restaurants(restaurantResult.rows[0].id, restaurantResult.rows[0].nome, restaurantResult.rows[0].telefone, restaurantResult.rows[0].cpfcnpj, restaurantResult.rows[0].user_id);

            res.json(restaurants);
        } catch (err) {
            console.error('Erro ao obter restaurante por ID', err);
            res.status(500).json({ message: 'Erro ao obter restaurante por ID' });
        }
    }

    static async createRestaurant(req: Request, res: Response) {
        const { nome, telefone, cpfcnpj, user_id } = req.body;

        if (!user_id) {
            return res.status(500).json({ message: 'Necessário informar user_id' });
        }

        try {
            const newRestaurant = await pool.query(
                'INSERT INTO restaurantes (nome, telefone, cpfcnpj, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
                [nome, telefone, cpfcnpj, user_id]
            );

            const restaurants = new Restaurants(newRestaurant.rows[0].id, newRestaurant.rows[0].nome, newRestaurant.rows[0].telefone, newRestaurant.rows[0].cpfcnpj, newRestaurant.rows[0].user_id);

            res.json(restaurants);
        } catch (err) {
            console.error('Erro ao cadastrar restaurante', err);
            res.status(500).json({ message: 'Erro ao cadastrar restaurante' });
        }
    }

    static async updateRestaurant(req: Request, res: Response) {
        const restaurantId = parseInt(req.params.id);
        const { nome, telefone, cpfcnpj} = req.body;

        try {
            const restaurantResult = await pool.query('SELECT * FROM restaurantes WHERE id = $1', [restaurantId]);

            if (restaurantResult.rows.length === 0) {
                return res.status(404).json({ error: 'Restaurante não encontrado' });
            }

            const updatedRestaurantsResult = await pool.query(
                'UPDATE restaurantes SET nome = COALESCE($1, nome), telefone = COALESCE($2, telefone), cpfcnpj = COALESCE($3, cpfcnpj) WHERE id = $4 RETURNING *',
                [nome, telefone, cpfcnpj ,restaurantId]
            );

            const updatedRestaurant = new Restaurants(
                updatedRestaurantsResult.rows[0].id,
                updatedRestaurantsResult.rows[0].nome,
                updatedRestaurantsResult.rows[0].telefone,
                updatedRestaurantsResult.rows[0].cpfcnpj,
                updatedRestaurantsResult.rows[0].user_id
            );

            res.json(updatedRestaurant);
        } catch (err) {
            console.error('Erro ao atualizar restaurante', err);
            res.status(500).json({ message: 'Erro ao atualizar restaurante' });
        }
    }

    static async delete(req: Request, res: Response) {
        const restaurantId = parseInt(req.params.id);

        try {
            const restaurantResult = await pool.query('SELECT * FROM restaurantes WHERE id = $1', [restaurantId]);

            if (restaurantResult.rows.length === 0) {
                return res.status(404).json({ error: 'Restaurante não encontrado' });
            }

            await pool.query('DELETE FROM restaurantes WHERE id = $1', [restaurantId]);

            res.json({ message: 'Restaurante excluído com sucesso' })
        } catch (err) {
            console.error('Erro ao deletar restaurante', err);
            res.status(500).json({ message: 'Erro ao deletar restaurante' });
        }
    }
}
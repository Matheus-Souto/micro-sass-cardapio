import { Request, Response } from "express";
import { pool } from "../connect";
import { Address } from "../models/Address";

export class AddressController {
    static async findAll(req: Request, res: Response) {
        try {
            const client = await pool.connect();
            const result = await client.query('SELECT * FROM enderecos');
            client.release();

            const addressItems = result.rows.map(row => new Address(row.id, row.rua, row.bairro, row.numero, row.estado, row.cep, row.cidade, row.restaurantes_id));
            res.json(addressItems);
        } catch (err) {
            console.error('Erro ao consultar o banco de dados', err);
            res.status(500).json({ message: 'Erro ao consultar o banco de dados' });
        }
    }

    static async findById(req: Request, res: Response) {
        const addressId = parseInt(req.params.id);

        try {
            const addressResult = await pool.query('SELECT * FROM enderecos WHERE id = $1', [addressId]);

            if (addressResult.rows.length === 0) {
                return res.status(404).json({ error: 'Endereço não encontrado' });
            }

            const addresses = new Address(addressResult.rows[0].id, addressResult.rows[0].rua, addressResult.rows[0].bairro, addressResult.rows[0].numero,
                addressResult.rows[0].estado, addressResult.rows[0].cep, addressResult.rows[0].cidade, addressResult.rows[0].restaurantes_id);

            res.json(addresses);
        } catch (err) {
            console.error('Erro ao obter endereço por ID', err);
            res.status(500).json({ message: 'Erro ao obter endereço por ID' });
        }
    }

    static async createAddress(req: Request, res: Response) {
        const { rua, bairro, numero, estado, cep, cidade, restaurantes_id } = req.body;

        if (!restaurantes_id) {
            return res.status(500).json({ message: 'Necessário informar restaurantes_id' });
        }

        try {
            const newAddress = await pool.query(
                'INSERT INTO enderecos (rua, bairro, numero, estado, cep, cidade, restaurantes_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [rua, bairro, numero, estado, cep, cidade, restaurantes_id]
            );

            const address = new Address(newAddress.rows[0].id, newAddress.rows[0].rua, newAddress.rows[0].bairro, newAddress.rows[0].numero,
                newAddress.rows[0].estado, newAddress.rows[0].cep, newAddress.rows[0].cidade, newAddress.rows[0].restaurantes_id);

            res.json(address);
        } catch (err) {
            console.error('Erro ao cadastrar endereco', err);
            res.status(500).json({ message: 'Erro ao cadastrar endereco' });
        }
    }
}
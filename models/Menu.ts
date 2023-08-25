export class Menu {
    id_category: number;
    nome_category: string;
    descricao_category: string;
    user_id: number;
    id_food: number;
    nome_food: string;
    preco_food: number;

    constructor(
        id_category: number, 
        nome_category: string, 
        descricao_category: string,
        user_id: number,
        id_food: number,
        nome_food: string,
        preco_food: number,   
    ) {
        this.id_category = id_category;
        this.nome_category = nome_category;
        this.descricao_category = descricao_category;
        this.user_id = user_id;
        this.id_food = id_food;
        this.nome_food = nome_food;
        this.preco_food = preco_food;
    }
}
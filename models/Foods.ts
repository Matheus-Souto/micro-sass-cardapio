export class Foods {
    id: number;
    nome: string;
    preco: number;
    user_id: number;

    constructor(id: number, nome: string, preco: number, user_id: number) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
        this.user_id = user_id;
    }
}
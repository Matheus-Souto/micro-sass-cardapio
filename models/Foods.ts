export class Foods {
    id: number;
    nome: string;
    preco: number;
    categorias_id: number;

    constructor(id: number, nome: string, preco: number, categorias_id: number) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
        this.categorias_id = categorias_id;
    }
}
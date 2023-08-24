export class Category {
    id: number;
    nome: string;
    descricao: string;
    user_id: number;

    constructor(id: number, nome: string, descricao: string, user_id: number) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.user_id = user_id;
    }
} 
export class Restaurants {
    id: number;
    nome: string;
    telefone: string;
    cpfcnpj:string;
    user_id: number;

    constructor(id: number, nome: string, telefone: string, cpfcnpj: string, user_id: number) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.cpfcnpj = cpfcnpj;
        this.user_id = user_id;
    }
}
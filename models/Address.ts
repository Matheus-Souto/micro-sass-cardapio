export class Address {
    id: number;
    rua: string;
    bairro: string;
    numero: string;
    estado: string;
    cep: string;
    cidade: string;
    restaurantes_id: number;

    constructor(id: number, rua: string, bairro: string, numero: string, estado: string, cep: string, cidade: string, restaurantes_id: number) {
        this.id = id;
        this.rua = rua;
        this.bairro = bairro;
        this.numero = numero;
        this.estado = estado;
        this.cep = cep;
        this.cidade = cidade;
        this.restaurantes_id = restaurantes_id;
    }
}
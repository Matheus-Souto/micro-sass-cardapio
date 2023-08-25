export class User {
    id: number;
    username: string;
    password: string;
    nome_restaurante: string;
    rua_restaurante: string;
    bairro_restaurante: string;
    numero_restaurante: string;
    estado_restaurante: string;
    cep_restaurante: string;
    telefone_restaurante: string;
    cpfcnpj_restaurante: string;
    email: string;

    constructor(id: number, username: string, password: string, nome_restaurante: string,
                rua_restaurante: string, bairro_restaurante: string, numero_restaurante: string,
                estado_restaurante: string, cep_restaurante: string, telefone_restaurante: string,
                cpfcnpj_restaurante: string, email: string) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.nome_restaurante = nome_restaurante;
        this.rua_restaurante = rua_restaurante;
        this.bairro_restaurante = bairro_restaurante;
        this.numero_restaurante = numero_restaurante;
        this.estado_restaurante = estado_restaurante;
        this.cep_restaurante = cep_restaurante;
        this.telefone_restaurante = telefone_restaurante;
        this.cpfcnpj_restaurante = cpfcnpj_restaurante;
        this.email = email;
    }
}

export class UserDTO {
    id: number;
    username: string;
    nome_restaurante: string;
    rua_restaurante: string;
    bairro_restaurante: string;
    numero_restaurante: string;
    estado_restaurante: string;
    cep_restaurante: string;
    telefone_restaurante: string;
    cpfcnpj_restaurante: string;
    email: string;

    constructor(id: number, username: string,  nome_restaurante: string,
                rua_restaurante: string, bairro_restaurante: string, numero_restaurante: string,
                estado_restaurante: string, cep_restaurante: string, telefone_restaurante: string,
                cpfcnpj_restaurante: string, email: string) {
        this.id = id;
        this.username = username;
        this.nome_restaurante = nome_restaurante;
        this.rua_restaurante = rua_restaurante;
        this.bairro_restaurante = bairro_restaurante;
        this.numero_restaurante = numero_restaurante;
        this.estado_restaurante = estado_restaurante;
        this.cep_restaurante = cep_restaurante;
        this.telefone_restaurante = telefone_restaurante;
        this.cpfcnpj_restaurante = cpfcnpj_restaurante;
        this.email = email;
    }
}
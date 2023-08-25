export class User {
    id: number;
    username: string;
    password: string;
    email: string;
    cpf: string;

    constructor(id: number, username: string, password: string, email: string, cpf: string) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.cpf = cpf;
    }
}

export class UserDTO {
    id: number;
    username: string;
    email: string;
    cpf: string;

    constructor(id: number, username: string, email: string, cpf: string) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.cpf = cpf;
    }
}
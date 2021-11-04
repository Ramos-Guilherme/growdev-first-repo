"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const app = (0, express_1.default)();
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`started server on PORT:${port} `);
});
class User {
    constructor(id, nome, idade, cpf, email) {
        this.name = nome;
        this.age = idade;
        this.id = id;
        this.cpf = cpf;
        this.email = email;
    }
}
class Transaction {
    constructor(id, title, value, type) {
        this.id = id;
        this.title = title;
        this.value = value;
        this.type = type;
    }
}
let users = [
    new User(0, "Paulo", 25, "0000000", "teste@teste.com"),
    new User(1, "João", 27, "11111111111", "teste@teste.com"),
    new User(2, "Maria", 30, "222222222", "teste@teste.com"),
];
users[0].transactions = [new Transaction(0, 'Salário', 15000, 'income')];
let idUser = 3;
let idTransaction = 0;
const valid = (req, res, next) => {
    if (req.method == "POST" || req.method == "PUT") {
        const { name, age, cpf, email } = req.body;
        if (typeof name != "string" ||
            isNaN(age) ||
            typeof cpf != "string" ||
            typeof email != "string") {
            res.status(400).send("Campos inválidos");
        }
    }
    next();
};
app.use(express_1.default.static('./front'));
app.use(express_1.default.json());
app.use(valid);
app.get("/api", (req, res, next) => {
    const p = new Promise((resolve, reject) => {
        if (Math.random() > 0.5)
            resolve(1);
        reject(0);
        /* setTimeout(resolve, 2000); */
    });
    p.then((resolve) => {
        res.send(`${resolve}`);
    }).catch(() => {
        res.status(500).send();
    });
});
app.get("/user", (req, res, next) => {
    res.json(users);
});
app.get("/user/:id", (req, res, next) => {
    const idBuscado = Number(req.params.id);
    let pessoaretornada = users.find((user) => user.id == idBuscado);
    if (pessoaretornada) {
        const { transactions } = pessoaretornada, pessoaSemT = __rest(pessoaretornada, ["transactions"]);
        res.send(pessoaSemT);
    }
    else {
        res.status(404).send('Pessoa não encontrada');
    }
});
app.post("/user", (req, res, next) => {
    const { name, age, cpf, email } = req.body;
    const usuarioCriado = new User(idUser, name, age, cpf, email);
    users.push(usuarioCriado);
    idUser++;
    res.status(201).json(usuarioCriado);
});
app.put("/user/:id", (req, res, next) => { });
app.delete("/user/:id", (req, res, next) => { });

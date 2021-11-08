import express, { Request, Response, NextFunction } from "express";
import 'dotenv/config'
import cors from 'cors';

const app = express();

const port = process.env.PORT

app.listen(port, () => {
  console.log(`started server on PORT:${port} `);
});

class User {
  public id: number;
  public name: string;
  public age: number;
  public cpf: string;
  public email: string;

  public transactions?: Array<Transaction>;

  constructor(
    id: number,
    nome: string,
    idade: number,
    cpf: string,
    email: string,
  ) {
    this.name = nome;
    this.age = idade;
    this.id = id;
    this.cpf = cpf;
    this.email = email;
  }
}

class Transaction {
  public id: number;
  public title: string;
  public value: number;
  public type: string;
  constructor(id: number, title: string, value: number, type: string) {
    this.id = id;
    this.title = title;
    this.value = value;
    this.type = type;
  }
}

let users: Array<User> = [
  new User(0, "Paulo", 25, "0000000", "teste@teste.com"),
  new User(1, "João", 27, "11111111111", "teste@teste.com"),
  new User(2, "Maria", 30, "222222222", "teste@teste.com"),
];
users[0].transactions = [new Transaction(0, 'Salário', 15000, 'income')]
users[1].transactions = [new Transaction(1, 'Salário', 10000, 'income')]
let idUser: number = 3;
let idTransaction: number = 0;

const valid = (req: Request, res: Response, next: NextFunction) => {
  if (req.method == "POST" || req.method == "PUT") {
    const { name, age, cpf, email } = req.body;
    if (
      typeof name != "string" ||
      isNaN(age) ||
      typeof cpf != "string" ||
      typeof email != "string"
    ) {
      res.status(400).send("Campos inválidos");
    }
  }
  next();
};

app.use(cors());
app.use(express.json());
app.use(valid);

app.get("/user", (req: Request, res: Response, next: NextFunction) => {
  let allUsers: Array<User>;
  allUsers = users.map((user) => {
    const { transactions, ...userSemT } = user;
    return userSemT;
  })
  res.json(allUsers);
});

app.get("/user/:id", (req: Request, res: Response, next: NextFunction) => {
  const idBuscado: number = Number(req.params.id);
  let pessoaretornada: User | undefined = users.find(
    (user) => user.id == idBuscado
  );

  if(pessoaretornada) {
	  const { transactions, ...pessoaSemT } = pessoaretornada;

	  res.json(pessoaSemT);
  } else {
	  res.status(404).send('Pessoa não encontrada');
  }

  
});

app.post("/user", (req: Request, res: Response, next: NextFunction) => {
  const { name, age, cpf, email } = req.body;

  const usuarioCriado: User = new User(idUser, name, age, cpf, email);
  users.push(usuarioCriado);
  idUser++;

  res.status(201).json(usuarioCriado);
});

app.put("/user/:id", (req: Request, res: Response, next: NextFunction) => {});

app.delete(
  "/user/:id",
  (req: Request, res: Response, next: NextFunction) => {}
);

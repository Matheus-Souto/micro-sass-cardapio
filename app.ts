import express from 'express';
import { pool } from './connect';
import { FoodsController } from './controllers/FoodsController';
import { UserController } from './controllers/UserController';
import { authenticateToken } from './middlewares/authentication';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Bem-vindo à API do Micro-SaaS de Cardápio Online!');
});

app.post('/register', UserController.register);
app.post('/login', UserController.login);
app.put('/users/:id', authenticateToken, UserController.update);
app.get('/users', authenticateToken, UserController.findAll);
app.get('/users/:id', authenticateToken, UserController.findById);
app.delete('/users/:id', authenticateToken, UserController.delete);


app.get('/foods/:id', authenticateToken, FoodsController.findById);
app.get('/foods', authenticateToken, FoodsController.findAll);
app.post('/foods', authenticateToken, FoodsController.createFoods);
app.put('/foods/:id', authenticateToken, FoodsController.updateFoods);
app.delete('/foods/:id', authenticateToken, FoodsController.delete);



app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
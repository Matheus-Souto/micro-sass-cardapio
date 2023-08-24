import express from 'express';
import { pool } from './connect';
import { MenuController } from './controllers/MenuController';
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
app.get('/users/:id', authenticateToken, UserController.getById);
app.delete('/users/:id', authenticateToken, UserController.delete);


app.get('/menu/:id', authenticateToken, MenuController.findById);
app.get('/menu', authenticateToken, MenuController.findAll);
app.post('/menu', authenticateToken, MenuController.createMenu);
app.put('/menu/:id', authenticateToken, MenuController.updateMenu);
app.delete('/menu/:id', authenticateToken, MenuController.delete);



app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
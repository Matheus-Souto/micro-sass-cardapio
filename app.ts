import express from 'express';
import { pool } from './connect';
import { FoodsController } from './controllers/FoodsController';
import { UserController } from './controllers/UserController';
import { authenticateToken } from './middlewares/authentication';
import { CategoryController } from './controllers/CategoryController';
import { MenuController } from './controllers/MenuController';
import { RestaurantController } from './controllers/RestaurantController';

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

app.get('/categories', authenticateToken, CategoryController.findAll);
app.get('/categories/:id', authenticateToken, CategoryController.findById);
app.post('/categories', authenticateToken, CategoryController.createCategory);
app.put('/categories/:id', authenticateToken, CategoryController.updateCategory);
app.delete('/categories/:id', authenticateToken, CategoryController.delete);

app.get('/menu', authenticateToken, MenuController.findAll);
app.get('/menu/:id', authenticateToken, MenuController.findByUserId);

app.get('/restaurants', authenticateToken, RestaurantController.findAll);
app.get('/restaurants/:id', authenticateToken, RestaurantController.findById);
app.post('/restaurants', authenticateToken, RestaurantController.createRestaurant);
app.put('/restaurants/:id', authenticateToken, RestaurantController.updateRestaurant);
app.delete('/restaurants/:id', authenticateToken, RestaurantController.delete);


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
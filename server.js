import 'dotenv/config';
import express from 'express';
import apiRouter from './routes/app.js';
import seedProducts from './data/seedProducts.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', apiRouter);

seedProducts()

app.get('/', (_req, res) => {
    res.json({ meddelande: 'Välkommen till Airbean API' });
});

app.listen(PORT, () => {
    console.log(`API:et körs på http://localhost:${PORT}`);
});


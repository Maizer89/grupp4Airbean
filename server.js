import 'dotenv/config';
import express from 'express';
import apiRouter from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('./api', apiRouter);

app.get('/', (req, res) => {
    res.json({ meddelande: 'Välkommen till Airbean API' });
});

app.listen(PORT, () => {
    console.log(`API:et körs på http://localhost:${PORT}`);
});


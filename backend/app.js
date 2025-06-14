import express from 'express'
import bodyParser from 'body-parser';
import {router} from './routes.js'
import dotenv from 'dotenv/config'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api", router);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`hack escuchando en el puerto ${PORT}`);
});
import express from 'express'
import bodyParser from 'body-parser';
import {router} from './pronos.routes.js'
import dotenv from 'dotenv/config'

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`hack escuchando en el puerto ${PORT}`);
});


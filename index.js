import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import paymentsRoutes from './routes/paymentsRoutes.js';

const app = express();

app.use(morgan('dev'));

app.use(paymentsRoutes);

app.use(express.static('public'));

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

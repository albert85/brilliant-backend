import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes';
import mongoose from 'mongoose'
import dotenv from 'dotenv'

const app = express();

dotenv.config()


mongoose.connect(
  process.env.DATABASE_URL,
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
)

const db = mongoose.connection

db.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.log(err)
})

db.once('open', () => {
  // eslint-disable-next-line no-console
  console.log('Database connection established')
})

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(routes);

const port = parseInt(process.env.PORT, 10) || 5000

app.listen(port, () => console.log(`Server is running on Port: ${port}`));
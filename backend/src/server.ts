import express, {Request, Response} from 'express';
import cors from 'cors';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import path from 'path';
import authenticationRouter from './router/authenticationRouter';
import apiRouter from './router/apiRouter';
import adminRouter from './router/adminRouter';

const app = express();

// Parsing Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));

const allowedOrigins = ['http://localhost:3001', 'http://localhost:3000', 'http://danl.ddns.net'];

const corsOptions: cors.CorsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (origin === undefined || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, '/../dist')));
app.use('/auth', authenticationRouter);
app.use('/api', apiRouter);
app.use('/admin', adminRouter);

app.get('*', (req: Request,res: Response) => {
  console.log(__dirname);
  
  res.sendFile(path.join(__dirname+'/../dist/index.html'));
});

if (!process.env.DATABASE_URL!) {
  console.error('DATABASE_URL not found in env variables');
  process.exit(1);
}

async function startApp() {
  app.listen(3000, () => {
    console.log('App now listening on port 3000')
  })
}

startApp();
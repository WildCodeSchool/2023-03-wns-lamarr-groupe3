import express from 'express';
import dataSource from './dataSource';
import path from 'path';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import {
   authRoutes,
   poiRoutes,
   profileRoutes,
   citiesRoutes,
   categoriesRoutes,
} from './routes';
import { seed } from './seed';
import helmet from 'helmet';

dotenv.config();

const app = express();
app.use(express.json());

app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
   res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
   );
   res.setHeader('Access-Control-Allow-Credentials', 'true');
   res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, PATCH, OPTIONS'
   );
   next();
});

app.use('/public', express.static(path.join(__dirname + '/../public')));

app.use(cookieParser());
app.use(
   helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
   })
);
app.use((req, res, next) => {
   const corsWhitelist = [
      'http://localhost:3000',
      'https://lamarr4.wns.wilders.dev',
   ];

   if (
      req.headers.origin !== undefined &&
      corsWhitelist.includes(req.headers.origin)
   ) {
      res.header('Access-Control-Allow-Origin', req.headers.origin);
   }
   res.setHeader('Access-Control-Allow-Credentials', 'true');
   res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
   );
   res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, PATCH, OPTIONS'
   );
   next();
});
app.use('/public', express.static(path.join(__dirname + '/../public')));

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/poi', poiRoutes);
app.use('/api/cities', citiesRoutes);
app.use('/api/categories', categoriesRoutes);

const start = async (): Promise<void> => {
   const port = 5000;

   await dataSource.initialize();

   if (process.env.NODE_ENV !== 'production') {
      try {
         await seed();
      } catch (error) {
         console.log('Seed error: ' + error);
      }
   }

   app.listen({ port }, () => {
      console.log(`Backend app ready at http://localhost:${port}`);
   });
};
void start();

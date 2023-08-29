
//==================================================
//              DEPENDENCIES
//==================================================
import express  from 'express';
const app = express();
//==================================================
//              ROUTES
//==================================================
import product from './products'

app.use('/product', product);

export default app
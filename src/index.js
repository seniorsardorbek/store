
import express from 'express'
import usersRouter  from "./routes/users.js"
import categoryRouter  from "./routes/category.js"
import orders  from "./routes/orders.js"
import productRouter  from "./routes/product.js"
import commentRouter  from "./routes/comment.js"
import {db} from "./db/index.js"
import config from  "./utils/config/config.js"
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import cors from 'cors';

import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(join(__dirname,'routes' ,  '*.js'));

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Store for gw68 ',
      version: '2.0.0',
      description: 'Koproq malumot',
    },
  },
  apis: [join(__dirname,'routes' ,  '*.js')],
}


const specs = swaggerJsdoc(options);

const app = express()
app.use('/docs' , swaggerUi.serve ,swaggerUi.setup(specs) )
app.use(cors());
app.use(express.static('uploads'))
app.use(express.json());

app.use(usersRouter)
app.use(categoryRouter)
app.use(orders)
app.use(productRouter)
app.use(commentRouter)
db()

app.listen(config.port , () => {
  console.log(`Server is running ${config.port}`);
});
  
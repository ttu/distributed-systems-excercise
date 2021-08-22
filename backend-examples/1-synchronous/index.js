import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';

import { addEcomRoutes } from './routes.js';

const PORT = 5590;

const app = new Koa();
app.use(bodyParser());

const router = new Router();
addEcomRoutes(router);

app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express from 'express';
import otherRoutes from './helper/notFound'
import user from './user/endpoints'

const route = express();

route.use('/api/v1/user', user)
route.use('/', otherRoutes);


export default route;
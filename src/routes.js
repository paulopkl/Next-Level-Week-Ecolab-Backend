const express = require('express');
const PointsController = require('./controllers/pointsController');
const ItemsController = require('./controllers/itemsController');
const multer = require('multer');
const multerConfig = require('./config/multer');
const { celebrate, Joi } = require('celebrate');

const pointsController = new PointsController();
const itemsController = new ItemsController();

const routes = express.Router();
const uploads = multer(multerConfig);

routes.get('/items', itemsController.index);

routes.post('/points', uploads.single('image'), celebrate({
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatssap: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        items: Joi.string().required()
    }),
}, { abortEarly: false }), pointsController.create);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);

module.exports = routes;
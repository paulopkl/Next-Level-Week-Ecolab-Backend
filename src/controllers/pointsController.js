const knex = require('../database/connection');

class PointsController {

    async index(req, res) {

        const { city, uf, items } = req.query;

        const parsedItems = String(items).split(',').map(item => Number(item.trim()));

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

            const serializedPoints = points.map(point => {
                return {
                    ...point,
                    image_url: `https://ecoleta-backend-paulo.herokuapp.com/uploads/${point.image}`
                    // image_url: `http://192.168.0.110:3333/uploads/${point.image}`
                };
            })

        return res.json(serializedPoints);
    }

    async show(req, res) {
        const { id } = req.params;

        const point = await knex('points').where('id', id).first();

        if (!point) {
            return res.status(400).json({ message: 'Point Not Found.' });
        };

        const serializedPoint = {
                ...point,
                image_url: `https://ecoleta-backend-paulo.herokuapp.com/uploads/${point.image}`
                // image_url: `http://192.168.0.110:3333/uploads/${point.image}`
            };

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');

        return res.json({ point: serializedPoint, items });
    };

    async create(req, res) {

        const { name, email, whatssap, latitude, longitude, city, uf, items } = req.body;

        const trx = await knex.transaction();

        const point = {
            image: req.file.filename, 
            name, 
            email, 
            whatssap, 
            latitude, 
            longitude, 
            city, 
            uf
        }

        const insertedIds = await trx('points').insert(point);

        const point_id = insertedIds[0];

        const pointItems = items.split(',').map((item) => Number(item.trim()))
            .map((item_id) => {
                return {
                    item_id,
                    point_id
                }
            })

        await trx('point_items').insert(pointItems);

        await trx.commit();

        return res.json({
            id: point_id,
            ...point
        });
    };
};

module.exports = PointsController;
const knex = require('../database/connection');

class itemsController {
    async index(req, res) {
        const items = await knex('items').select('*');

        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `http://192.168.0.110:3333/uploads/${item.image}`
            };
        })

        return res.json(serializedItems);
    } 
}

module.exports = itemsController;
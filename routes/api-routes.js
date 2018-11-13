// Import in our db models
const db = require('../models');


// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {
    app.get('/api/product', function(req, res){
        db.Product.findAll({
            order: [
                ['id', 'ASC']
            ]
        }).then(function(rows){        
            res.json(rows);
        }).catch(function(err){
            res.json({ error: err });
        });
    });

    app.post('/api/product', function(req, res){
        db.Product.create(req.body)
        .then(function(rows){
            res.json({ success: true,
                       rowsAdded: rows });
        }).catch(function(err){
            res.json({ error: err });
        });
    });

    app.put('/api/product', function(req, res){
        console.log(req.body);
        for (let i = 0; i < req.body.data.length; i++){

            let sq = parseInt(req.body.data[i].qty);
            console.log('stock qty', sq, typeof sq)

            let theID = req.body.data[i].id;
            console.log('id', theID, typeof theID);

            db.Product.update({ stock_quantity : sq
            },{ where : { id : theID }
            }).catch(function(err){
                throw new Error(err);
            });
        }
        db.Product.findAll({}).then(function(rows){
            res.json(rows);
        }).catch(function(err){
            res.json(err);
        });
    });
};

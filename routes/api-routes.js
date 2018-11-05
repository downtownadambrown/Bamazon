// Import in our db models
const db = require('../models');


// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {
    app.get('/api/product', function(req, res){
        db.Product.findAll({}).then(function(rows){
            res.json(rows);
        }).catch(function(err){
            res.json({ error: error });
        });
    });

    app.post('/api/product', function(req, res){
        db.Product.create(req.body)
        .then(function(rows){
            res.json({ success: true });
        }).catch(function(err){
            res.json({ error: err});
        });
    });
};

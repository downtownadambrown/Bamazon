module.exports = function (connection, Sequelize) {
    var Product = connection.define('Product', {
        product_name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        department_name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        price: {
            type: Sequelize.REAL,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        stock_quantity: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    });
    
    return Product;
};
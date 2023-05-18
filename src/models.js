const { Sequelize } = require("sequelize");

const users = {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        primaryKey: true,
    },
    username: { 
        type: Sequelize.STRING,
        allowNull: false,
    },
    latitude: { 
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    longitude:{ 
        type:  Sequelize.DOUBLE,
        allowNull: false,
    },
}
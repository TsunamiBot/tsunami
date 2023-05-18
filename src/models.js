const { Sequelize } = require("sequelize");

const users = {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
    },
    username: Sequelize.STRING,
    latitude: Sequelize.DOUBLE,
    longitude: Sequelize.DOUBLE,
}
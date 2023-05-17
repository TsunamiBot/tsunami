const { Sequelize } = require("sequelize");

const users = {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
    },
    username: Sequelize.STRING,
    location: Sequelize.DOUBLE,
}
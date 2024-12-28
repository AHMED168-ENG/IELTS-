"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("trainings", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            title: {
                type: Sequelize.STRING,
            },
            image: {
                type: Sequelize.STRING,
            },
            disability: {
                type: Sequelize.INTEGER,
            },
            video: {
                type: Sequelize.STRING,
            },
            content: {
                type: Sequelize.TEXT,
            },
            active: {
                type: Sequelize.BOOLEAN,
            },
            isOther: {
                defaultValue: false,
                type: Sequelize.BOOLEAN,
            },
            otherDisabilities: {
                type: Sequelize.ARRAY(Sequelize.INTEGER),
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("trainings");
    },
};

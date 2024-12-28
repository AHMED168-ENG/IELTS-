"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("guideLines", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      disability: {
        type: Sequelize.INTEGER,
      },
      pdf: {
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("guideLines");
  },
};

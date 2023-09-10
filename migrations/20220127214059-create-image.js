'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Images', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      imgID: {
        type: Sequelize.STRING
      },
      earth_date: {
        type: Sequelize.STRING
      },
      sol: {
        type: Sequelize.INTEGER
      },
      camera: {
        type: Sequelize.STRING
      },
      rover: {
        type: Sequelize.STRING
      },
      img_src: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Images');
  }
};
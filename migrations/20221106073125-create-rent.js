'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Rents', {

      id_Rent: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_user: {
        type: Sequelize.INTEGER
      },
      MovieCode: {
        type: Sequelize.STRING
      },
      rent_date: {
        type: Sequelize.DATE
      },
      refund_date: {
        type: Sequelize.DATE
      },
      userRefund_date: {
        type: Sequelize.DATE
      },
      MovieMovieCode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      RentIdRent: {
        type: Sequelize.STRING,
        allowNull: true
      },
      code: {
        type: Sequelize.STRING,
        allowNull: true
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
    await queryInterface.dropTable('Rents');
  }
};
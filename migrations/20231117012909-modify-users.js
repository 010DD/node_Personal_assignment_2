'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('User', 'birth_year', {
			type: Sequelize.INTEGER
		});
		await queryInterface.addColumn('User', 'birth_month', {
			type: Sequelize.INTEGER
		});
		await queryInterface.addColumn('User', 'birth_day', {
			type: Sequelize.INTEGER
		});
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
		// await queryInterface.removeColumn('User', 'birth');
		// await queryInterface.removeColumn('User', 'birth_year');
		// await queryInterface.removeColumn('User', 'birth_month');
		// await queryInterface.removeColumn('User', 'birth_day');
	}
};

'use strict'
const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const Users = [
            {
                firstName: 'Pierre',
                lastName: 'Dupont',
                phone: '0123456789',
                email: 'pierredupond@mail.fr',
                emailVerifiedAt: new Date(),
                password: 'password',
                role: 'user',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                firstName: 'Jean',
                lastName: 'Dupont',
                phone: '012345678O',
                email: 'jeandupond@mail.fr',
                emailVerifiedAt: new Date(),
                password: 'password',
                role: 'user',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]

        Users.forEach((user) => {
            user.password = bcrypt.hashSync(user.password, 8)
        })

        await queryInterface.bulkInsert('Users', Users)
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Users', null, {})
    },
}

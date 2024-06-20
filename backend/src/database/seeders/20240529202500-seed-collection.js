'use strict'
const slugify = require('slugify')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const collections = [
            {
                name: 'Les Nains-Vincibles',
                description:
                    'Une collection de nains de jardin héroïques, avec des poses et des costumes inspirés de super-héros. Chaque nain a un nom et un look unique, comme "Nainvincible" ou "Nainvulnérable".',
                published: true,
            },
            {
                name: 'Les Nains-Téressants',
                description:
                    'Des nains de jardin en train de lire, d\'étudier ou de méditer, avec des livres ou des instruments scientifiques. Les noms pourraient être "Nain-Tellectuel" ou "Nain-Lysé".',
                published: true,
            },
            {
                name: 'Les Nains-Fatigables',
                description:
                    'Une collection de nains de jardin sportifs, avec des tenues et des accessoires de différentes disciplines sportives. Par exemple, "Nain-Champion" ou "Nain-Battable".',
                published: true,
            },
            {
                name: 'Les Nains-Dustriels',
                description:
                    'Des nains de jardin représentant divers métiers de l\'industrie et de l\'artisanat. Les noms pourraient être "Nain-Génieur" ou "Nain-Chantier".',
                published: true,
            },
            {
                name: 'Les Nains-Tégrés',
                description:
                    'Des nains de jardin représentants de la diversité culturelle et ethnique, chaque nain ayant des caractéristiques et des tenues typiques de différentes cultures. Noms possibles : "Nain-Ternational" ou "Nain-Croyable".',
                published: true,
            },
            {
                name: 'Les Nains-Supportables',
                description:
                    'Des nains de jardin humoristiques en train de faire des blagues ou des pitreries. Noms possibles : "Nain-Passable" ou "Nain-Portable".',
                published: true,
            },
            {
                name: 'Les Nains-Vincible',
                description:
                    'Des nains de jardin soldats ou guerriers, avec des armures et des épées. Les noms pourraient être "Nain-Vincible" ou "Nain-Pénétrable".',
                published: true,
            },
            {
                name: 'Les Nains-Polites',
                description:
                    'Des nains de jardin élégants et distingués, avec des costumes formels ou des uniformes. Les noms possibles : "Nain-Chanté" ou "Nain-Tégrité"',
                published: true,
            },
            {
                name: 'Les Nains-Croyables',
                description:
                    'Une collection de nains de jardin en train de réaliser des actions spectaculaires ou incroyables. Noms possibles : "Nain-Croyable" ou "Nain-Dispensable".',
                published: true,
            },
            {
                name: 'Les Nains-Délogeables',
                description:
                    'Des nains de jardin explorateurs ou aventuriers, avec des sacs à dos et des cartes. Les noms pourraient être "Nain-Satiable" ou "Nain-Prenable".',
                published: true,
            },
            {
                name: 'Les Nains-Visibles',
                description:
                    'Des nains de jardin artistes ou musiciens, avec des instruments de musique ou des pinceaux. Noms possibles : "Nain-Téressant" ou "Nain-Visible".',
                published: true,
            },
            {
                name: 'Les Nains-Dispensables',
                description:
                    'Des nains de jardin en train de réaliser des tâches ménagères ou des corvées. Noms possibles : "Nain-Dispensable" ou "Nain-Nettoyable".',
                published: true,
            },
            {
                name: 'Les Nains-Nettoyables',
                description:
                    'Des nains de jardin en train de réaliser des tâches ménagères ou des corvées. Noms possibles : "Nain-Dispensable" ou "Nain-Nettoyable".',
                published: true,
            },
        ]

        collections.forEach((collection) => {
            collection.slug = slugify(collection.name, { lower: true })
        })

        await queryInterface.bulkInsert('Collections', collections)
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Collections', null, {})
    },
}

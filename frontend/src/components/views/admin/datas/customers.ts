import { useRouter } from 'vue-router'
const router = useRouter()

export const data = {
    columns: [
        {
            label: 'Nom',
            key: 'lastname',
            sorting: true,
        },
        {
            label: 'Prénom',
            key: 'firstname',
            sorting: true,
            position: 'right',
        },
        {
            label: 'Email',
            key: 'email',
            sorting: false,
        },

        {
            label: 'Statut',
            key: 'status',
            toDisplay: (value: boolean) => (value ? 'Actif' : 'Inactif'),
            sortingType: 'boolean',
            sorting: true,
        },

        {
            label: 'Commandes',
            key: 'commands',
            toDisplay: (value: any[]) => value.length + ' commandes',
        },
    ],
    rows: [
        {
            id: 1,
            lastname: 'Doe',
            firstname: 'John',
            email: 'johndoe@mail.fr',
            status: true,
            type: 'admin',
            createdAt: new Date('2023-05-12'),
            commands: [
                {
                    id: '12F3-ABS4-1S13',
                    price: 1340.98,
                    createdAt: new Date(),
                    status: 'sent',
                },
                {
                    id: '12F3-ABS4-1S14',
                    price: 130.67,
                    createdAt: new Date('2023-05-12'),
                    status: 'received',
                    receiveDate: new Date('2023-05-17'),
                },
            ],
        },
        {
            id: 2,
            lastname: 'Doe',
            firstname: 'Jane',
            email: 'janedoe@mail.fr',
            status: false,
            type: 'user',
            createdAt: new Date('2023-05-12'),
            commands: [
                {
                    id: '12F3-ABS4-1S15',
                    price: 130.67,
                    createdAt: new Date('2023-05-11'),
                    status: 'received',
                    receiveDate: new Date('2023-05-19'),
                },
            ],
        },
        {
            id: 3,
            lastname: 'Prudhomme',
            firstname: 'Aurélien',
            email: 'aurelien23.p@gmail.com',
            status: true,
            type: 'ban',
            createdAt: new Date('2023-05-12'),
            commands: [
                {
                    id: '12F3-ABS4-1S16',
                    price: 130.67,
                    createdAt: new Date('2023-05-11'),
                    status: 'received',
                    receiveDate: new Date('2023-05-19'),
                },
                {
                    id: '12F3-ABS4-1S17',
                    price: 130.67,
                    createdAt: new Date('2023-05-11'),
                    status: 'cancelled',
                    cancelledDate: new Date('2023-05-12'),
                },
                {
                    id: '12F3-ABS4-1S18',
                    price: 130.67,
                    createdAt: new Date('2023-05-11'),
                    status: 'cancelled',
                    cancelledDate: new Date('2023-05-12'),
                },
            ],
        },
        {
            id: 4,
            lastname: 'Prudhomme',
            firstname: 'Aurélien',
            email: 'aurelien23.p@gmail.com',
            status: true,
            type: 'user',
            createdAt: new Date('2023-05-12'),
            commands: [
                {
                    id: '12F3-ABS4-1S19',
                    price: 130.67,
                    createdAt: new Date('2023-05-11'),
                    status: 'received',
                    receiveDate: new Date('2023-05-19'),
                },
                {
                    id: '12F3-ABS4-1S20',
                    price: 130.67,
                    createdAt: new Date('2023-05-11'),
                    status: 'cancelled',
                    cancelledDate: new Date('2023-05-12'),
                },
                {
                    id: '12F3-ABS4-1S21',
                    price: 130.67,
                    createdAt: new Date('2023-05-11'),
                    status: 'cancelled',
                    cancelledDate: new Date('2023-05-12'),
                },
            ],
        },
        {
            id: 5,
            lastname: 'Prudhomme',
            firstname: 'Aurélien',
            email: 'aurelien23.p@gmail.com',
            status: true,
            type: 'user',
            createdAt: new Date('2023-05-12'),
            commands: [
                {
                    id: '12F3-ABS4-1S22',
                    price: 130.67,
                    createdAt: new Date('2024-06-15'),
                    status: 'sent',
                },
                {
                    id: '12F3-ABS4-1S23',
                    price: 130.67,
                    createdAt: new Date('2023-05-11'),
                    status: 'cancelled',
                    cancelledDate: new Date('2023-05-12'),
                },
            ],
        },
        {
            id: 6,
            lastname: 'Prudhomme',
            firstname: 'Aurélien',
            email: 'aurelien23.p@gmail.com',
            status: true,
            type: 'user',
            createdAt: new Date('2023-05-12'),
            commands: [
                {
                    id: '12F3-ABS4-1S24',
                    price: 130.67,
                    createdAt: new Date('2023-05-11'),
                    status: 'cancelled',
                    cancelledDate: new Date('2023-05-12'),
                },
            ],
        },
        {
            id: 7,
            lastname: 'Prudhomme',
            firstname: 'Aurélien',
            email: 'aurelien23.p@gmail.com',
            status: true,
            type: 'ban',
            createdAt: new Date('2023-05-12'),
            commands: [],
        },
    ],

    search: [
        {
            value: '',
            key: 'lastname',
        },
        {
            value: '',
            key: 'firstname',
        },
        {
            value: '',
            key: 'email',
        },
        {
            value: '',
            key: 'status',
        },
    ],
}

<script lang="ts" setup>
import LinkCard from '@components/cards/LinkCard.vue';

import DataTable from '@components/tables/DataTable.vue';
import { reactive, computed } from 'vue';

const data = reactive({
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
            label: "Date de Naissance",
            key: "birthdate",
            sorting: true,
            toDisplay: (value: Date) => {
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                return value.toLocaleDateString('fr-FR', options);
            },
            sortingType: 'date'
        },

        {
            label: 'Statut',
            key: 'status',
            toDisplay: (value: boolean) => value ? 'Actif' : 'Inactif',
            sortingType: 'boolean',
            sorting: true
        },

        {
            label: 'Type',
            key: 'type',
            sorting: false,
            toDisplay: (value: string) => {
                switch (value) {
                    case 'admin':
                        return 'Administrateur';
                    case 'user':
                        return 'Utilisateur';
                    case 'ban':
                        return 'Banni';
                    default:
                        return value;
                }
            }
        }
    ],
    rows: [
        {
            id: 1,
            lastname: 'Doe',
            firstname: 'John',
            email: 'johndoe@mail.fr',
            birthdate: new Date('02/01/2002'),
            status: true,
            type: 'admin'
        },
        {
            id: 2,
            lastname: 'Doe',
            firstname: 'Jane',
            email: 'janedoe@mail.fr',
            birthdate: new Date('04/01/2000'),
            status: false,
            type: 'user'
        },
        {
            id: 3,
            lastname: 'Prudhomme',
            firstname: 'Aurélien',
            email: 'aurelien23.p@gmail.com',
            birthdate: new Date('02/23/2002'),
            status: true,
            type: 'ban'

        },
        {
            id: 4,
            lastname: 'Prudhomme',
            firstname: 'Aurélien',
            email: 'aurelien23.p@gmail.com',
            birthdate: new Date('02/23/2002'),
            status: true,
            type: 'ban'

        },
        {
            id: 5,
            lastname: 'Prudhomme',
            firstname: 'Aurélien',
            email: 'aurelien23.p@gmail.com',
            birthdate: new Date('02/23/2002'),
            status: true,
            type: 'ban'

        },
        {
            id: 6,
            lastname: 'Prudhomme',
            firstname: 'Aurélien',
            email: 'aurelien23.p@gmail.com',
            birthdate: new Date('02/23/2002'),
            status: true,
            type: 'ban'

        },
        {
            id: 7,
            lastname: 'Prudhomme',
            firstname: 'Aurélien',
            email: 'aurelien23.p@gmail.com',
            birthdate: new Date('02/23/2002'),
            status: true,
            type: 'ban'

        },

    ],
    actions: 
    [
    
    {
        label: 'Modifier',
        icon: 'pencil',
        class: "text-blue-500",
        action: (row: any) => {
            console.log('Modifier', row);
        }
    },

    {
        label: 'Supprimer',
        icon: 'trash',
        class: "text-red-500",
        action: (row: any) => {
            console.log('Supprimer', row);
        }
    },
    ],

    multiActions: 
    [
    
    {
        label: 'Modifier',
        icon: 'pencil',
        action: (row: any) => {
            console.log('Modifier', row);
        }
    },

    {
        label: 'Supprimer',
        icon: 'trash',
        class: "text-white bg-red-500",
        action: (row: any) => {
            console.log('Supprimer', row);
        }
    },
    ],
})

const page = reactive({    
        current: 1,
        total: data.rows.length,
        perPage: 5
    })

const search = reactive([
    {
        key: 'lastname',
        value: ''
    },
    {
        key: 'firstname',
        value: ''
    },
    {
        key: 'email',
        value: ''
    }
])



    function onNextPage() {
        page.current++;
    }

    function onPreviousPage() {
        page.current--;
    }

    function addData() {
        data.rows.push({
            id: 8,
            lastname: 'Prudhomme',
            firstname: 'Aurél',
            email: 'aurel@mail.fr',
            birthdate: new Date('02/23/2002'),
            status: true,
            type: 'user'
        });
    }

    function onUpdatedSearch(event: any) {
        for (let i = 0; i < search.length; i++) {
            if (search[i].key === event.key) {
                search[i].value = event.value;
            }
        }
    }

</script>

<template>
    <div class="relative">
            <div class="sticky top-0 z-10">
                <img src="/src/assets/images/myProfileMenu.webp" 
                class="w-full md:h-[60vw] lg:h-[30vw] object-cover "
                >
                <h1 class="text-center text-xl sm:text-xl md:text-5xl w-full tracking-widest text-white uppercase absolute z-10 bottom-1/4 -y-translate-1/2 block">Bienvenue, NOM PRENOM</h1>
                
            </div>
        <main class="bg-white w-screen relative h-screen z-20">
            <div class="rotate-45 h-8 w-8 relative top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-black"></div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center mt-24">
            
                <LinkCard name="Mes informations" shortDescription="Modifiez vos informations personnelles" image="/src/assets/images/profileMe.webp"></LinkCard>

                <LinkCard name="Mes commandes" shortDescription="Consultez l'historique de vos commandes" image="/src/assets/images/commandesListe.webp"></LinkCard>
            </div>
            
            <div class="mx-12">
                <hr class="my-24">
                <button @click="addData()">Add data</button>
                <DataTable
                :columns="data.columns"
                :originalRows="data.rows"
                :rows="data.rows"
                :search="search"
                @updateSearch="onUpdatedSearch($event)"
                @updateRows="data.rows = $event"
                :page="page"
                :actions="data.actions"
                :multiActions="data.multiActions"
                @emitNextPage="onNextPage"
                @emitPreviousPage="onPreviousPage"
                ></DataTable>
            </div>
        </main>
    </div>
</template>
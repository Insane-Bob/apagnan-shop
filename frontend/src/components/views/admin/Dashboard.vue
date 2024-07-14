<script setup>
import { useUserGrid } from '@/composables/admin/useUserGrid.js'
import { useGridStack } from '@/composables/admin/useGridStack.js'
import StockEvolutionGraph from '@components/Dashboard/StockEvolutionGraph.vue'
import Card from '@components/ui/card/Card.vue'
import { computed, reactive, ref, watch } from 'vue'
import SmallCardStats from '@components/Dashboard/SmallCardStats.vue'
import DateRangePicker from '@components/Inputs/DateRangePicker.vue'
import Button from '@components/ui/button/Button.vue'
import { CalendarDate } from '@internationalized/date'
import Sheet from '@components/ui/sheet/Sheet.vue'
import SheetContent from '@components/ui/sheet/SheetContent.vue'
import DashboardConfigDrawer from '@components/Dashboard/DashboardConfigDrawer.vue'
import SheetTrigger from '@components/ui/sheet/SheetTrigger.vue'
import Badge from '@components/ui/badge/Badge.vue'
import ListCards from '@components/Dashboard/ListCards.vue'
import Avatar from '@components/ui/avatar/Avatar.vue'
import AvatarImage from '@components/ui/avatar/AvatarImage.vue'
import OrderTakenEvolutionGraph from '@components/Dashboard/OrderTakenEvolutionGraph.vue'
import IncomeEvolutionGraph from '@components/Dashboard/IncomeEvolutionGraph.vue'
import Tabs from '@components/ui/tabs/Tabs.vue'
import TabsList from '@components/ui/tabs/TabsList.vue'
import TabsTrigger from '@components/ui/tabs/TabsTrigger.vue'

const widgetAvailable = reactive([
    {
        id: 'stock-evolution',
        name: 'Suivis du stock',
        component: StockEvolutionGraph,
        gs: {
            x: 0,
            y: 0,
            width: 7,
            height: 3,
        },
    },
    {
        id: 'reviews',
        name: "Nombre d'avis produits",
        component: SmallCardStats,
        active: false,
        gs: {
            x: 0,
            y: 0,
            width: 4,
            height: 1,
        },
        props: {
            title: 'Avis',
            url: '/stats/reviews',
            description: "Nombre d'avis",
            afterFetch: (data, dataRef) => {
                dataRef.value = data.count
            },
        },
    },
    {
        id: 'incomes',
        name: 'Revenus',
        component: SmallCardStats,
        active: false,
        gs: {
            x: 0,
            y: 0,
            width: 4,
            height: 1,
        },
        props: {
            title: 'Revenus',
            url: `/stats/orders`,
            description: 'Revenus totaux',
            afterFetch: (data, dataRef) => {
                dataRef.value =
                    data
                        .filter(
                            (o) =>
                                o._id.status == 'shipping' ||
                                o._id.status == 'delivered',
                        )
                        .reduce((acc, curr) => acc + curr.total, 0) + '€'
            },
        },
    },
    {
        id: 'orders-count',
        name: 'Nombre de commandes',
        component: SmallCardStats,
        active: false,
        gs: {
            x: 0,
            y: 0,
            width: 4,
            height: 1,
        },
        props: {
            title: 'Commandes',
            url: `/stats/orders`,
            description: 'Nombre de commandes',
            afterFetch: (data, dataRef) => {
                dataRef.value = data.reduce((acc, curr) => acc + curr.count, 0)
            },
        },
    },
    {
        id: 'recent-review',
        name: 'Avis récents',
        component: ListCards,
        active: false,
        gs: {
            x: 0,
            y: 0,
            width: 7,
            height: 3,
        },
        props: {
            title: 'Avis',
            url: `/stats/reviews`,
            description: 'Les 10 derniers avis produit postés',
            afterFetch: (data, dataRef) => {
                dataRef.value = data.reviews
            },
        },
    },
    {
        id: 'orders-taken',
        name: 'Evolution des commandes',
        component: OrderTakenEvolutionGraph,
        active: false,
        gs: {
            x: 0,
            y: 0,
            width: 7,
            height: 3,
        },
    },
    {
        id: 'income-evolution',
        name: 'Revenus',
        component: IncomeEvolutionGraph,
        active: false,
        gs: {
            x: 0,
            y: 0,
            width: 7,
            height: 3,
        },
    },
])

let now = new Date()
const dateRange = ref({
    start: new CalendarDate(now.getFullYear(), now.getMonth(), 1),
    end: new CalendarDate(now.getFullYear(), now.getMonth() + 1, 0),
})
const interval = ref('week')

watch(interval, () => {
    //change the date range
    let now = new Date()
    switch (interval.value) {
        case 'month':
            dateRange.value = {
                start: new CalendarDate(
                    now.getFullYear(),
                    now.getMonth() - 1,
                    1,
                ),
                end: new CalendarDate(now.getFullYear(), now.getMonth() + 2, 0),
            }
            break
        case 'year':
            dateRange.value = {
                start: new CalendarDate(now.getFullYear() - 1, 0, 1),
                end: new CalendarDate(now.getFullYear() + 1, 11, 31),
            }
            break
        default:
            dateRange.value = {
                start: new CalendarDate(now.getFullYear(), now.getMonth(), 1),
                end: new CalendarDate(now.getFullYear(), now.getMonth() + 1, 0),
            }
    }
})

const { grid: userGrid, set } = useUserGrid()
const { widgets, hasUpdate } = useGridStack(widgetAvailable)

watch(userGrid, () => {
    widgetAvailable.forEach((widget) => {
        let configUser = userGrid.value.find((w) => w.id === widget.id)
        if (configUser) {
            widget.gs = configUser.gs
            widget.active = configUser.active
        }
    })
})
</script>
<template>
    <div class="flex flex-col gap-4 mx-5">
        <div class="flex justify-end gap-6">
            <Tabs default-value="week" v-model="interval">
                <TabsList class="grid w-full grid-cols-4">
                    <TabsTrigger value="day"> Jour </TabsTrigger>
                    <TabsTrigger value="week"> Semaine </TabsTrigger>
                    <TabsTrigger value="month"> Mois </TabsTrigger>
                    <TabsTrigger value="year"> Année </TabsTrigger>
                </TabsList>
            </Tabs>

            <DateRangePicker v-model="dateRange" />
            <Sheet>
                <SheetTrigger class="relative">
                    <Badge
                        class="absolute right-[12px] top-[10px] p-0 w-[7px] h-[7px]"
                        v-if="hasUpdate"
                    />
                    <Button variant="ghost">
                        <ion-icon name="settings-sharp"></ion-icon>
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <DashboardConfigDrawer
                        v-model:hasUpdate="hasUpdate"
                        v-model="widgetAvailable"
                        @save="set(widgetAvailable)"
                    />
                </SheetContent>
            </Sheet>
        </div>
        <div class="grid-stack">
            <div
                v-for="widget in widgets"
                :key="widget.id"
                :gs-x="widget.gs.x"
                :gs-y="widget.gs.y"
                :gs-w="widget.gs.width"
                :gs-h="widget.gs.height"
                :gs-id="widget.id"
                class="grid-stack-item"
            >
                <div class="h-full p-2 box-border">
                    <Card class="h-full overflow-hidden">
                        <component
                            :id="widget.id"
                            :is="widget.component"
                            :dateRange="dateRange"
                            :interval="interval"
                            v-bind="widget?.props"
                        >
                            <template v-slot:recent-review:item="{ item }">
                                <div class="flex items-center py-2">
                                    <Avatar
                                        class="flex h-9 w-9 items-center justify-center space-y-0 border"
                                    >
                                        <AvatarImage
                                            src="/avatars/02.png"
                                            alt="Avatar"
                                        />
                                        <AvatarFallback>
                                            {{ item.User.firstName[0]
                                            }}{{ item.User.lastName[0] }}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div class="ml-4 mr-4 space-y-1">
                                        <p
                                            class="text-sm font-medium leading-none"
                                        >
                                            {{ item.User.firstName }}
                                            {{ item.User.lastName }}
                                        </p>
                                        <p
                                            class="text-sm text-muted-foreground"
                                        >
                                            {{ item.content }}
                                        </p>
                                    </div>
                                    <div class="ml-auto font-medium">
                                        {{ item.rate }}/5
                                    </div>
                                </div>
                            </template>
                        </component>
                    </Card>
                </div>
            </div>
        </div>
    </div>
</template>

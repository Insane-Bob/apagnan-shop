<script setup lang="ts">
import Button from '../ui/button/Button.vue'
import { computed, type HTMLAttributes, reactive } from 'vue'
import OutlinedInput from '@components/ui/input/OutlinedInput.vue'
import { useUserStore } from '@/stores/user'
import CartDrawer from '@components/Drawers/CartDrawer.vue'
import { Sheet, SheetContent, SheetTrigger } from '@components/ui/sheet'
import AuthDrawer from '@components/Drawers/AuthDrawer.vue'
import { cn } from '@/utils/utils'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps<{
    variant: string
    class?: HTMLAttributes['class']
}>()

const userStore = useUserStore()
const links = computed(() => {
    return [
        {
            to: '/admin',
            icon: 'laptop-outline',
            visible: userStore.isAdmin && userStore.isAuthenticated,
        },
        {
            to: '/profile',
            icon: 'person-outline',
            visible: userStore.isAuthenticated,
        },
        {
            to: '/logout',
            icon: 'log-out-outline',
            visible: userStore.isAuthenticated,
        },
    ]
})

const search = reactive({
    query: '',
    show: false,
})
function handleSearch() {
    if (search.query) {
        router.push({ path: '/products', query: { s: search.query } })
    }
}
</script>

<template>
    <div>
        <div class="taker"></div>
        <header
            :class="cn('ap-header', 'ap-header--' + props.variant, props.class)"
        >
            <div></div>
            <div class="logo-container">
                <RouterLink to="/">
                    <img src="/src/assets/logo_black.svg" alt="Apagnain Logo" />
                </RouterLink>
            </div>

            <div class="actions-container">
                <form
                    @submit.prevent="handleSearch()"
                    class="search-form"
                    :class="{ 'search-form--open': search.show }"
                >
                    <OutlinedInput
                        name="search"
                        v-model="search.query"
                        placeholder="Rechercher..."
                        @keyup.enter="handleSearch"
                    ></OutlinedInput>
                    <Button
                        variant="tone-white"
                        size="icon"
                        @click="search.show = !search.show"
                    >
                        <ion-icon
                            :name="
                                search.show ? 'close-outline' : 'search-outline'
                            "
                        />
                    </Button>
                </form>

                <nav>
                    <Sheet v-if="!userStore.isAuthenticated">
                        <SheetTrigger as-child>
                            <Button variant="tone-white" class="flex gap-3">
                                <ion-icon name="log-in-outline" />
                                <span class="hidden sm:block"
                                    >Se connecter</span
                                >
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <AuthDrawer />
                        </SheetContent>
                    </Sheet>

                    <Sheet v-if="userStore.isAuthenticated">
                        <SheetTrigger>
                            <div class="cart-container">
                                <Button variant="tone-white" size="icon">
                                    <ion-icon name="cart-outline" />
                                </Button>
                                <div
                                    class="cart-pill bg-red-500"
                                    v-if="userStore.countCartItem > 0"
                                >
                                    <div
                                        :class="{
                                            'animate-ping':
                                                userStore.cartHasNewItems,
                                            'bg-red-500/20 rounded-full w-4 h-4 absolute': true,
                                        }"
                                    />
                                    <span class="text-white">
                                        {{ userStore.countCartItem }}
                                    </span>
                                </div>
                            </div>
                        </SheetTrigger>
                        <SheetContent>
                            <CartDrawer />
                        </SheetContent>
                    </Sheet>
                    <template v-for="link in links">
                        <RouterLink :to="link.to" v-if="link.visible">
                            <Button variant="tone-white" size="icon">
                                <ion-icon :name="link.icon"></ion-icon>
                            </Button>
                        </RouterLink>
                    </template>
                </nav>
            </div>
        </header>
    </div>
</template>

<style scoped lang="scss">
.ap-header {
    --gap: 2em;
    padding: 0 var(--gap);
    @media screen and (max-width: 768px) {
        --gap: 1em;
    }

    &--home {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 30;
        color: white;
        background: transparent;
        transition: 0.2s;

        .logo-container {
            img {
                opacity: 0;
                transition: 0.2s;
            }
        }
    }
    &--home-white {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 30;
        background-color: white;
        color: black;
        transition: 0.2s;

        .logo-container {
            img {
                opacity: 1;
                transition: 0.2s;
            }
        }
    }

    display: grid;
    grid-template-columns: 1fr auto 1fr;
    grid-gap: var(--gap);

    .logo-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 90px;
    }

    .actions-container {
        display: flex;
        justify-content: flex-end;

        .search-form {
            display: flex;
            align-items: center;
            gap: 1em;
            input {
                opacity: 0;
                width: 0;
                padding: 0;
                transition: 0.2s ease-in-out;
                color: black;
            }

            &--open {
                input {
                    opacity: 1;
                    width: 200px;
                    padding: 0.5em;
                }
            }
        }

        nav {
            --space: 0.5em;
            margin-left: var(--space);
            display: flex;
            gap: var(--space);
            align-items: center;
        }
        .cart-container {
            position: relative;
            .cart-pill {
                top: -2px;
                right: -5px;
                width: 24px;
                height: 24px;
                transform: scale(0.8);
                border-radius: 100px;
                position: absolute;
            }
        }
    }

    ion-icon {
        font-size: 1.5em;
    }
}
.ag-header--with-promo {
    top: 2em;
}
</style>

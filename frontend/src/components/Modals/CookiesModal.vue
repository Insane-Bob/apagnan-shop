<template>
    <AlertDialog>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>
                    <h2>
                        Utilisation des Cookies sur Apagnain 🍪
                    </h2>
                    <AlertDialogCancel class="!text-xs underline">Continuer sans accepter</AlertDialogCancel>    
                </AlertDialogTitle
                >
                <AlertDialogDescription>
                    Chez Apagnain, nous nous engageons à vous offrir une
                    expérience de navigation optimale et personnalisée. Pour ce
                    faire, nous utilisons des cookies et d'autres technologies
                    similaires.
                </AlertDialogDescription>
                <AlertDialogDescription>
                    Ces cookies nous permettent de :
                    <ul class="list-disc ml-6 mt-2 text-sm">
                        <li>
                            Améliorer les performances de notre site et la
                            fluidité de votre navigation
                        </li>
                        <li>
                            Vous proposer des contenus et des publicités
                            pertinents en fonction de vos intérêts
                        </li>
                        <li>
                            Analyser notre audience afin d'améliorer nos
                            services et mieux répondre à vos besoins
                        </li>
                    </ul>
                </AlertDialogDescription>
                <AlertDialogDescription>
                    En continuant à naviguer sur notre site de vente de nains de
                    jardin de luxe, vous consentez à l'utilisation de ces
                    cookies. Vous avez la possibilité de gérer vos préférences
                    en matière de cookies à tout moment en accédant à notre
                    Politique de Cookies.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogAction>Accepter les cookies</AlertDialogAction>
                <AlertDialogCancel class="!text-black/40"
                    >Paramètres des cookies</AlertDialogCancel
                >
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>

<script setup>
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
</script>

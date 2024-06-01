<script setup lang="ts"></script>

<template>
  <footer class="bg-black w-full h-80 text-white flex justify-center items-center">
    <div class="flex flex-col sm:flex-row sm:gap-10 md:gap-20 pt-7">
      <div>
        <img src="../../assets/new_logo.svg" alt="Apagnain Logo" />
      </div>
      <div>
        <h3 class="mb-4 font-title text-2xl">Nous Contacter</h3>
        <ul class="flex flex-col gap-1">
          <li class="flex items-center gap-4">
            <ion-icon name="mail-outline"></ion-icon>
            <p>apagnain.contact@mail.com</p>
          </li>
          <li class="flex items-center gap-4">
            <ion-icon name="call-outline"></ion-icon>
            <p>06 06 06 06 06</p>
          </li>
        </ul>
      </div>
      <div>
        <h3 class="mb-4 font-title text-2xl">Information sur la société</h3>
        <ul class="flex flex-col gap-1">
          <li>
            <a href="#" class="hover:underline cursor-pointer transition duration-300 ease-in-out"
              >A propos de Apagnain</a
            >
          </li>
          <li>
            <a href="#" class="hover:underline cursor-pointer transition duration-300 ease-in-out"
              >Code éthique</a
            >
          </li>
          <li>
            <a href="#" class="hover:underline cursor-pointer transition duration-300 ease-in-out"
              >Juridique</a
            >
          </li>
          <li>
            <a href="#" class="hover:underline cursor-pointer transition duration-300 ease-in-out"
              >Politique de confidentialité et cookies</a
            >
          </li>
          <li>
            <a href="#" class="hover:underline cursor-pointer transition duration-300 ease-in-out"
              >Information sur la société</a
            >
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>

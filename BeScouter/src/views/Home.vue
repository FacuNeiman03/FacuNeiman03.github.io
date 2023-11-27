<template>
  <div class="home bg-dark">
    <div
      id="carouselExample"
      class="carousel slide w-100"
      data-bs-ride="carousel"
    >
      <div class="carousel-inner">
        <div
          v-for="(image, index) in carouselImages"
          :key="index"
          :class="{ 'carousel-item': true, active: index === 0 }"
        >
          <img
            :src="image"
            class="d-block custom-img"
            alt="Imagen del carrusel"
          />
        </div>
      </div>
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
    <div class="black-background">
      <div class="text-container">
        <h2>BeScouter</h2>
        <h4>La revolución del scouting deportivo</h4>
        <p>
          Nuestra aplicación de scouting es más que una simple herramienta; es
          tu aliado definitivo para descubrir y evaluar el talento deportivo.
          Con una característica única que nos distingue de las demás, te damos
          la posibilidad de comparar jugadores por similitud y gestionar tus
          equipos y jugadores de una manera intuitiva y eficiente.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import img_1 from "../assets/img_carousel_1.jpg";
import img_2 from "../assets/img_carousel_2.jpg";
import img_3 from "../assets/img_carousel_3.jpg";

export default {
  data() {
    return {
      carouselImages: [img_1, img_2, img_3],
    };
  },
};
</script>

<style scoped>
body {
  margin: 0; /* Elimina el margen predeterminado del cuerpo */
}

#carouselExample {
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.custom-img {
  width: 100%;
  height: 50vh;
  object-fit: cover;
  object-position: center bottom;
}

.text-container {
  max-width: 600px;
  margin: auto;
  color: white;
  padding: 20px;
  height: 340px;
}

.centered {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.home {
  text-align: center;
  color: #333;
  min-height: 89vh;
}

.carousel-control-prev,
.carousel-control-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 2rem;
  opacity: 0.5;
  transition: opacity 0.15s ease;
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  color: #fff;
}

.carousel-control-prev:hover,
.carousel-control-next:hover {
  opacity: 1;
}
</style>

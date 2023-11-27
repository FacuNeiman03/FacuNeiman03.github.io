<template>
  <div
    class="login bg-dark min-vh-100 d-flex flex-column justify-content-between"
  >
    <router-link
      to="/home"
      class="btn btn-link text-light btn-volver"
      style="margin: 10px; text-align: left !important"
      >Volver al inicio</router-link
    >
    <div class="d-flex flex-column align-items-center p-3 position-relative">
      <div class="login-form text-center text-white">
        <form @submit.prevent="submitData" style="width: 100%">
          <div class="form-group">
            <label for="email">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              v-model="email"
              :class="{ 'error-field': emailError }"
              class="form-control"
              required
            />
            <span v-if="emailError" class="error-message">{{
              emailError
            }}</span>
          </div>
          <div class="form-group">
            <label for="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              v-model="password"
              :class="{ 'error-field': passwordError }"
              class="form-control"
              required
            />
            <span v-if="passwordError" class="error-message">{{
              passwordError
            }}</span>
          </div>
          <button type="submit" class="btn btn-success">Iniciar sesión</button>
        </form>
        <button
          @click="redirectToSignUp"
          class="btn btn-link btn-crearCuenta mt-3"
        >
          Crear cuenta
        </button>
      </div>
    </div>
    <div class="d-flex justify-content-center mb-3" @click="redirectToHome">
      <img
        src="../assets/logo_blanco.png"
        alt="logo image"
        class="logo-image"
      />
    </div>
  </div>
</template>

<script>
import { useFirebaseStore } from "../stores/firebaseStore";
import store from "../stores/index";

export default {
  name: "Login",
  data() {
    return {
      firebaseStore: useFirebaseStore(),
      email: "",
      password: "",
      emailError: "",
      passwordError: "",
    };
  },
  methods: {
    async submitData() {
      this.clearErrors();
      try {
        const userData = await this.firebaseStore.login(
          this.email,
          this.password
        );
        store.dispatch("updateLoginStatus", true);
        store.dispatch("updateUserData", userData);
        localStorage.setItem("isLoggedIn", "true");
        this.$router.push({ path: "/home" });
        console.log("Login exitoso");
      } catch (error) {
        console.log("Problemas en el login", error);
        this.emailError = "Las credenciales no son válidas.";
        this.passwordError = "Las credenciales no son válidas.";
        this.email = "";
        this.password = "";
      }
    },
    redirectToSignUp() {
      this.$router.push({ path: "/signUp" });
    },
    redirectToHome() {
      this.$router.push({ path: "/home" });
    },
    clearErrors() {
      this.emailError = "";
      this.passwordError = "";
    },
  },
};
</script>

<style scoped>
.login-form {
  max-width: 400px;
  width: 80%;
}

.form-group {
  margin-bottom: 30px;
  width: 100%; /* Ajusta el ancho del contenedor según sea necesario */
}

.logo-image {
  height: 100px;
  width: 100px;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
}

.error-field {
  border: 1px solid red;
}

.error-message {
  color: red;
  font-size: 0.8rem;
}

.btn-crearCuenta,
.btn-volver {
  color: #ebebeb !important;
}
.btn-crearCuenta:hover,
.btn-volver:hover {
  color: #c9c8c8 !important;
}
.btn-success {
  background-color: #3f734c !important;
  margin-bottom: 20px;
}

.btn-success:hover {
  background-color: #1d3521 !important;
  border-color: #1d3521 !important;
}

.custom-link {
  margin-left: 0 !important;
}
</style>

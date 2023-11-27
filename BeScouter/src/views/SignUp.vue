<template>
  <div
    class="sign-up bg-dark min-vh-100 d-flex flex-column justify-content-between"
  >
    <router-link
      to="/home"
      class="btn btn-link text-light btn-volver"
      style="margin: 10px; text-align: left !important"
      >Volver al inicio</router-link
    >
    <div class="sign-up-form text-center text-white p-3 position-relative">
      <form @submit.prevent="submitData">
        <div class="form-group">
          <label for="email" class="text-white">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            v-model="email"
            :class="{ 'error-field': emailError }"
            class="form-control"
            required
          />
          <span v-if="emailError" class="error-message">{{ emailError }}</span>
        </div>
        <div class="form-group">
          <label for="username" class="text-white">Nombre de Usuario:</label>
          <input
            type="text"
            id="username"
            v-model="username"
            :class="{ 'error-field': usernameError }"
            class="form-control"
            required
          />
          <span v-if="usernameError" class="error-message">{{
            usernameError
          }}</span>
        </div>
        <div class="form-group">
          <label for="fullname" class="text-white">Nombre Completo:</label>
          <input
            type="text"
            id="fullname"
            v-model="fullName"
            :class="{ 'error-field': fullNameError }"
            class="form-control"
            required
          />
          <span v-if="fullNameError" class="error-message">{{
            fullNameError
          }}</span>
        </div>
        <div class="form-group">
          <label for="password" class="text-white">Contraseña:</label>
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
        <div class="form-group">
          <label for="re_password" class="text-white"
            >Repetir contraseña:</label
          >
          <input
            type="password"
            id="re_password"
            v-model="re_password"
            :class="{ 'error-field': passwordMatchError }"
            class="form-control"
            required
          />
          <span v-if="passwordMatchError" class="error-message">{{
            passwordMatchError
          }}</span>
        </div>
        <button type="submit" class="btn btn-success mt-3">Registrarse</button>
      </form>
    </div>
    <img
      src="../assets/logo_blanco.png"
      alt="logo image"
      class="logo-image mx-auto mt-4"
    />
  </div>
</template>

<script>
import { useFirebaseStore } from "../stores/firebaseStore";
import { mapActions } from "vuex";
import store from "../stores/index";

export default {
  name: "SignUp",
  data() {
    return {
      firebaseStore: useFirebaseStore(),
      email: "",
      password: "",
      fullName: "",
      username: "",
      re_password: "",
      emailError: "",
      usernameError: "",
      fullNameError: "",
      passwordError: "",
      passwordMatchError: "",
      userData: "",
    };
  },
  methods: {
    async submitData() {
      this.clearErrors();
      try {
        if (/\d/.test(this.fullName)) {
          this.fullNameError = "El nombre completo no debe contener números.";
        }
        if (this.password.length < 6) {
          this.passwordError =
            "La contraseña debe tener al menos 6 caracteres.";
        }

        if (this.password !== this.re_password) {
          this.passwordMatchError =
            "Las contraseñas no coinciden. Verifique nuevamente.";
        }

        if (
          this.fullNameError ||
          this.passwordError ||
          this.passwordMatchError
        ) {
          return;
        }
        this.userData = await this.firebaseStore.signup(
          this.email,
          this.password,
          this.fullName,
          this.username
        );
        console.log("Registro exitoso");
        this.$router.push({ path: "/home" });
        store.dispatch("updateLoginStatus", true); // Llama a la acción para actualizar el estado isLoggedIn
        store.dispatch("updateUserData", userData); // Actualiza los datos del usuario en el store Vuex
        localStorage.setItem("isLoggedIn", "true");
      } catch (error) {
        console.log("Problemas de registro:", error.message || error);
        this.emailError =
          error.message ||
          "Por favor, verifique que sus credenciales sean válidas.";
      }
    },
    clearErrors() {
      this.emailError = "";
      this.usernameError = "";
      this.fullNameError = "";
      this.passwordError = "";
      this.passwordMatchError = "";
    },
  },
};
</script>

<style scoped>
.sign-up-form {
  width: 80%;
  max-width: 400px;
  margin: auto; /* Centra horizontalmente */
  flex: 1; /* Toma el espacio vertical restante */
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.logo-image {
  height: 100px;
  width: 100px;
  margin-bottom: 20px; /* Ajusta el espacio entre el formulario y la imagen */
}

.form-group {
  margin-bottom: 30px;
  width: 100%; /* Ajusta el ancho del contenedor según sea necesario */
}

.form-control {
  border-color: #2f5639 !important; /* Cambia el color del contorno al verde del botón */
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input[type="email"],
input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
}

.sign-up-form input[type="email"]:focus,
.sign-up-form input[type="text"]:focus,
.sign-up-form input[type="password"]:focus {
  border-color: #2f5639 !important; /* Cambia el color del contorno al verde del botón */
}

.error-field {
  border: 1px solid red;
}

.error-message {
  color: red;
  font-size: 0.8rem;
}

.btn-success {
  background-color: #3f734c !important;
  border-color: #3f734c !important;
  margin-top: 20px;
}

.btn-success:hover {
  background-color: #1d3521 !important;
  border-color: #1d3521 !important;
}

.btn-volver {
  color: #ebebeb !important;
}
.btn-volver:hover {
  color: #c9c8c8 !important;
}
</style>

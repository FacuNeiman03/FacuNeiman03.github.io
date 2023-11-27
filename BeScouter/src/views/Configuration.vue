<template>
  <div class="configuration-container bg-dark" style="margin-bottom: 20px">
    <h2 class="mt-4 mb-4 text-white">Configuración</h2>
    <div class="user-data">
      <div
        :class="{
          'button-container': true,
          'expanded-container': showData && editingMode,
        }"
      >
        <button class="btn btn-success btn-header" @click="toggleDataForm">
          {{ editingMode ? "Cancelar" : "Modificar datos" }}
        </button>
      </div>
      <div class="form-container" v-if="showData && editingMode">
        <form>
          <div class="form-group">
            <div class="label-input-container">
              <label for="username" class="input-label"
                >Nombre de usuario:</label
              >
              <input
                id="username"
                type="text"
                v-model="userData.username"
                :class="{ 'error-field': usernameError }"
                @blur="validateUsername"
                required
              />
            </div>
            <span v-if="usernameError" class="error-message">{{
              usernameError
            }}</span>
          </div>
          <div class="form-group">
            <div class="label-input-container">
              <label for="full-name" class="input-label"
                >Nombre completo:</label
              >
              <input
                id="full-name"
                type="text"
                v-model="userData.full_name"
                :class="{ 'error-field': fullNameError }"
                @blur="validateFullName"
                required
              />
            </div>
            <span v-if="fullNameError" class="error-message">{{
              fullNameError
            }}</span>
          </div>
          <div class="form-group">
            <div class="label-input-container">
              <label for="password" class="input-label"
                >Nueva Contraseña:</label
              >
              <input
                id="password"
                type="password"
                v-model="password"
                :class="{ 'error-field': passwordError }"
                @blur="validatePassword"
                required
              />
            </div>
            <span v-if="passwordError" class="error-message">{{
              passwordError
            }}</span>
          </div>

          <div class="form-group">
            <div class="label-input-container">
              <label for="confirm-password" class="input-label"
                >Confirmar Contraseña:</label
              >
              <input
                id="confirm-password"
                type="password"
                v-model="confirmPassword"
                :class="{ 'error-field': confirmPasswordError }"
                @blur="validatePassword"
                required
              />
            </div>
            <span v-if="confirmPasswordError" class="error-message">{{
              confirmPasswordError
            }}</span>
          </div>

          <button class="btn btn-success" @click.prevent="submitData">
            Guardar cambios
          </button>
          <span v-if="changeSuccess" class="success-message"
            >¡Cambios guardados con éxito!</span
          >
        </form>
      </div>
    </div>
    <div class="text-center">
      <div
        :class="{
          'button-container': true,
          'expanded-container': showSavedItems && showSavedItemsMode,
        }"
      >
        <button @click="getSavedItems" class="btn btn-success btn-header">
          {{ showSavedItemsMode ? "Ocultar guardados" : "Ver guardados" }}
        </button>
      </div>
      <div
        class="saved-items-container"
        v-if="showSavedItems && showSavedItemsMode"
      >
        <ul v-if="userData?.saved?.length > 0" class="saved-items-list mt-4">
          <li
            v-for="(item, index) in userData.saved"
            :key="index"
            class="saved-item"
            @click="redirect(item)"
          >
            <img
              :src="imageUrls[item.id]"
              alt="image"
              class="saved-item-image"
            />
            <p class="saved-item-name">{{ item.name }}</p>
            <button @click.stop="removeItem(item)" class="remove-button">
              Eliminar
            </button>
          </li>
        </ul>
        <p v-else class="text-center text-white mt-5">
          No hay elementos guardados
        </p>
      </div>
    </div>
    <div class="button-container">
      <button class="btn btn-success btn-header" @click="clickLogout">
        Cerrar sesión
      </button>
    </div>
  </div>
</template>

<script>
import { validatePassword } from "firebase/auth";
import { useFirebaseStore } from "../stores/firebaseStore";
import store from "../stores/index";
import { getPlayerImage, getTeamImage, getManagerImage } from "../utils/api";

export default {
  name: "Configuration",
  data() {
    return {
      firebaseStore: useFirebaseStore(),
      userData: "",
      inputUsername: "",
      inputFullname: "",
      usernameError: "",
      fullNameError: "",
      imageUrls: [],
      showSavedItems: false,
      showData: false,
      editingMode: false,
      showSavedItemsMode: false,
      password: "",
      confirmPassword: "",
      passwordError: "",
      confirmPasswordError: "",
      changeSuccess: false,
    };
  },
  methods: {
    clickLogout() {
      this.firebaseStore.logout();
      console.log("Sesión cerrada con éxito");
      store.dispatch("updateLoginStatus", false);
      store.dispatch("updateUserData", "");
      localStorage.removeItem("userData");
      this.$router.push({ path: "/home" });
    },
    async getData(userId) {
      try {
        this.userData = await this.firebaseStore.getUserData(userId);
        console.log("userData from store:", this.userData);
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    },
    async getSavedItems() {
      const userId = localStorage.getItem("userData");

      if (!this.showData) {
        await this.getData(userId);
      }

      this.showSavedItemsMode = !this.showSavedItemsMode;

      if (this.showSavedItemsMode) {
        this.showSavedItems = true;
        if (this.userData?.saved?.length > 0) {
          await Promise.all(
            this.userData.saved.map((item) => this.loadImage(item))
          );
        }
      }
    },
    toggleDataForm() {
      if (this.showData) {
        this.editingMode = !this.editingMode;
      } else {
        this.showData = true;
        this.editingMode = true;
        const userId = localStorage.getItem("userData");
        this.getData(userId);
      }
    },
    updateLocalStorage(isLoggedIn) {
      localStorage.setItem("isLoggedIn", isLoggedIn?.toString());
    },
    async submitData() {
      try {
        const currentUsername = this.userData.username;
        const currentFullname = this.userData.full_name;

        // Verificar si ha habido cambios en los campos de usuario
        const hasChanges =
          currentUsername !== this.userData.username ||
          currentFullname !== this.userData.full_name;

        // Si hay cambios o se proporciona una nueva contraseña, realizar la actualización
        if (!hasChanges) {
          // Actualizar la contraseña solo si se proporciona una nueva contraseña
          if (
            this.validatePassword() &&
            this.validateFullName() &&
            this.validateUsername()
          ) {
            const updatedData = {
              username: this.userData.username,
              full_name: this.userData.full_name,
              password: this.password,
            };
            await this.firebaseStore.updateUserAuth(updatedData);
            this.changeSuccess = true;
          } else if (
            this.validateFullName() &&
            this.validateUsername() &&
            !this.password &&
            !this.confirmPassword
          ) {
            const updatedData = {
              username: this.userData.username,
              full_name: this.userData.full_name,
              password: null,
            };
            await this.firebaseStore.updateUserAuth(updatedData);
            this.changeSuccess = true;
          } else {
            alert("Datos invalidos");
          }
        }
      } catch (error) {
        console.error("Error al actualizar los datos del usuario:", error);
      }
    },
    validateUsername() {
      let retorno = false;
      this.usernameError = "";
      if (/\s/.test(this.userData.username)) {
        this.usernameError = "El nombre de usuario no debe contener espacios.";
      } else if (this.userData.username.length < 6) {
        this.usernameError =
          "El nombre de usuario debe tener al menos 6 caracteres.";
      } else if (this.userData.username.length > 20) {
        this.usernameError =
          "El nombre de usuario no debe tener más de 20 caracteres.";
      } else if (!/^[a-zA-Z0-9]+$/.test(this.userData.username)) {
        this.usernameError =
          "El nombre de usuario solo puede contener letras y números.";
      } else if (this.userData.username.trim().length == 0) {
        this.fullNameError = "El nombre de usuario no puede estar vacío.";
      } else {
        this.usernameError = "";
        retorno = true;
      }
      return retorno;
    },
    validatePassword() {
      let retorno = true;
      this.passwordError = "";
      this.confirmPasswordError = "";

      if (this.password || this.confirmPassword) {
        if (this.password !== this.confirmPassword) {
          this.passwordError = "Las contraseñas no coinciden.";
          this.confirmPasswordError = "Las contraseñas no coinciden.";
          retorno = false;
        }

        if (this.password.length < 6) {
          this.passwordError =
            "La contraseña debe tener al menos 6 caracteres.";
          retorno = false;
        }
      } else {
        retorno = false;
      }
      return retorno;
    },
    validateFullName() {
      let retorno = false;
      if (/\d/.test(this.userData.full_name)) {
        this.fullNameError = "El nombre completo no debe contener números.";
      } else if (this.userData.full_name.length > 50) {
        this.fullNameError =
          "El nombre completo no debe tener más de 50 caracteres.";
      } else if (this.userData.full_name.length < 6) {
        this.fullNameError =
          "El nombre completo debe tener al menos 6 caracteres.";
      } else if (!/^[a-zA-Z\s]+$/.test(this.userData.full_name)) {
        this.fullNameError =
          "El nombre completo solo puede contener letras y espacios.";
      } else if (this.userData.full_name.trim().length == 0) {
        this.fullNameError = "El nombre completo no puede estar vacío.";
      } else {
        this.fullNameError = "";
        retorno = true;
      }
      return retorno;
    },
    async removeItem(item) {
      const userId = localStorage.getItem("userData");
      try {
        await this.firebaseStore.removeFromSavedList(userId, item);
        this.userData.saved = this.userData.saved.filter(
          (i) => i.id !== item.id
        );
      } catch (error) {
        throw error;
      }
    },
    mapTypeItem(item) {
      switch (item) {
        case "player":
          return "Jugador";
        case "team":
          return "Equipo";
        case "manager":
          return "Entrenador";
      }
    },
    async loadImage(item) {
      try {
        if (item.type === "player") {
          const response = await getPlayerImage(item.id);
          console.log("Player image response:", response);
          const imageUrl = URL.createObjectURL(response.data);
          this.$set(this.imageUrls, item.id, imageUrl);
        } else if (item.type === "team") {
          const response = await getTeamImage(item.id);
          console.log("Team image response:", response);
          const imageUrl = URL.createObjectURL(response.data);
          this.$set(this.imageUrls, item.id, imageUrl);
        } else if (item.type === "manager") {
          const response = await getManagerImage(item.id);
          console.log("Manager image response:", response);
          const imageUrl = URL.createObjectURL(response.data);
          this.$set(this.imageUrls, item.id, imageUrl);
        }
      } catch (error) {
        console.error("Error loading image:", error);
      }
    },
    redirect(item) {
      if (item.type === "player") {
        this.$router.push({ path: `/player/${item.id}` });
      } else if (item.type === "team") {
        this.$router.push({ path: `/team/${item.id}` });
      } else if (item.type === "manager") {
        this.$router.push({ path: `/manager/${item.id}` });
      }
    },
  },
  watch: {
    "store.state.isLoggedIn": function (newVal) {
      console.log(newVal);
      this.updateLocalStorage(newVal);
    },
  },
};
</script>

<style scoped>
.configuration-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 84vh;
}

.user-data {
  text-align: center;
  width: 35%;
}

.button-container {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 20vh; /* Altura predeterminada */
}

.expanded-container {
  height: 38px; /* Altura cuando está expandido */
}

.btn-success {
  background-color: #2f5639 !important;
  border-color: #2f5639 !important;
  margin-bottom: 20px;
}

.btn-success:hover {
  background-color: #1d3521 !important;
  border-color: #1d3521 !important;
}
.success-message {
  color: #ebebeb;
  font-size: 1rem;
  margin-top: 0.5rem;
  margin-left: 0.5rem;
}
form {
  width: 100%;
}

.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.label-input-container {
  display: flex;
  align-items: center;
  width: 100%;
}

.input-label {
  color: #fff;
  width: 30%;
}

input[type="text"],
input[type="password"] {
  flex: 1;
  width: 70%;
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 4px;
  margin-top: 0.2rem;
}

.error-field {
  border: 1px solid red;
}

.error-message {
  color: red;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

.saved-items-container {
  display: flex;
  justify-content: center;
}

.saved-items-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* Cambiado a 'center' para centrar horizontalmente */
  width: 90%;
}

.saved-items-container {
  display: flex;
  justify-content: center;
}

.saved-item {
  width: 200px; /* Aumentado el ancho */
  margin-bottom: 20px;
  margin-right: 20px;
  background-color: #2f5639;
  padding: 20px; /* Aumentado el padding */
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: #fff;
}

.saved-item:hover {
  background-color: #3f734c;
  cursor: pointer;
}

.saved-item:last-child {
  margin-right: 0;
}

.saved-item-image {
  width: 100px; /* Aumentado el tamaño de la imagen */
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 10px;
}

.item-type,
.item-name {
  font-size: 1.2rem; /* Aumentado el tamaño del texto */
}

.remove-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 5px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.2s;
}

.remove-button:hover {
  background-color: #c0392b;
  transition: 0.2s;
}

.saved-item span:hover {
  color: #808080 !important;
  cursor: pointer;
}

.saved-item-name {
  font-size: 1.2rem;
}

.saved-link {
  font-size: 0.8em;
}

.btn-header {
  padding: 12px 50px;
}
</style>

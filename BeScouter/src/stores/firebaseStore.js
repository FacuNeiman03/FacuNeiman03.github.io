import { defineStore } from "pinia";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDZ9HIF2OqP1vTaQ6m_VUXL-GEd5hdeDdg",
  authDomain: "be-scouting-app.firebaseapp.com",
  projectId: "be-scouting-app",
  storageBucket: "be-scouting-app.appspot.com",
  messagingSenderId: "514598462804",
  appId: "1:514598462804:web:7dcadf2de6ce8a314ed4c1",
  measurementId: "G-S880HSNNFX",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const useFirebaseStore = defineStore({
  id: "firebase",
  state: () => ({
    user: null,
    userList: [],
  }),

  actions: {
    async login(email, password) {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        this.user = userCredential.user;
        return this.user.uid;
      } catch (error) {
        console.error("Error de autenticación:", error);
        throw error;
      }
    },
    async signup(email, password, fullName, username) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        this.user = userCredential.user;

        const userId = this.user.uid;
        const dbInstance = getFirestore(app);
        const userCollection = collection(dbInstance, "user");
        const docRef = doc(userCollection, userId);
        const newUser = {
          id: userId,
          email,
          full_name: fullName,
          username,
          saved: [],
        };

        console.log(JSON.stringify(newUser));

        await setDoc(docRef, newUser);
        return userId;
        // Realiza cualquier otra acción que desees después de registrarte.
      } catch (error) {
        console.error("Error de registro:", error);
        throw error;
      }
    },
    async logout() {
      try {
        await signOut(auth);
        this.user = null;
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        throw error;
      }
    },
    async getUserData(uid) {
      try {
        const dbInstance = getFirestore(app);
        const userCollection = collection(dbInstance, "user");
        const userDoc = doc(userCollection, uid);
        const userSnapshot = await getDoc(userDoc); // Utiliza getDoc en lugar de userDoc.get
        if (userSnapshot.exists()) {
          return userSnapshot.data();
        } else {
          throw new Error("No se encontraron datos para el usuario.");
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        throw error;
      }
    },
    async updateUserData(userId, updatedData) {
      try {
        const dbInstance = getFirestore(app);
        const userCollection = collection(dbInstance, "user");
        const userDoc = doc(userCollection, userId);
        await updateDoc(userDoc, updatedData);
        // Realiza cualquier otra acción que desees después de actualizar los datos del usuario.
      } catch (error) {
        console.error("Error al actualizar los datos del usuario:", error);
        throw error;
      }
    },
    async addToSavedList(userId, dataToAdd) {
      try {
        const dbInstance = getFirestore(app);
        const userCollection = collection(dbInstance, "user");
        const userDoc = doc(userCollection, userId);

        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          const existingItem = userData.saved.find(
            (item) => item.id === dataToAdd.id
          );

          if (existingItem) {
            console.log("El elemento ya existe en la lista 'saved'.");
            return; // Si el elemento ya existe, no lo agregues nuevamente
          }

          const updatedSavedList = [...userData.saved, dataToAdd];

          await updateDoc(userDoc, {
            saved: updatedSavedList,
          });

          console.log("Elemento agregado correctamente a la lista 'saved'.");
        } else {
          throw new Error("El usuario no existe en la base de datos.");
        }
      } catch (error) {
        console.error("Error al agregar elementos a la lista 'saved':", error);
        throw error;
      }
    },
    async removeFromSavedList(userId, dataToRemove) {
      try {
        const dbInstance = getFirestore(app);
        const userCollection = collection(dbInstance, "user");
        const userDoc = doc(userCollection, userId);

        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          const updatedSavedList = userData.saved.filter(
            (item) => item.id !== dataToRemove.id
          ); // Asegúrate de ajustar la condición de filtrado según la propiedad relevante de tu objeto

          await updateDoc(userDoc, {
            saved: updatedSavedList,
          });

          console.log("Elemento eliminado correctamente de la lista 'saved'.");
        } else {
          throw new Error("El usuario no existe en la base de datos.");
        }
      } catch (error) {
        console.error(
          "Error al eliminar elementos de la lista 'saved':",
          error
        );
        throw error;
      }
    },
    getCurrentUser() {
      return auth.currentUser;
    },
    async updateUserAuth(newUser) {
      try {
        const user = this.getCurrentUser();
        if (!user) {
          throw new Error("El usuario no está autenticado.");
        }

        if (newUser.password != null) {
          try {
            await updatePassword(user, newUser.password);
          } catch (updatePasswordError) {
            console.error(
              "Error al actualizar la contraseña:",
              updatePasswordError
            );
            throw updatePasswordError;
          }
        }

        const updatedUserData = {
          email: user.email,
          full_name: newUser.full_name,
          id: user.uid,
          username: newUser.username,
        };

        await this.updateUserData(user.uid, updatedUserData);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async reauthenticate(password) {
      const user = this.getCurrentUser();
      const credentials = EmailAuthProvider.credential(user.email, password);
      try {
        await reauthenticateWithCredential(user, credentials);
        console.log("Re-authentication successful");
      } catch (error) {
        console.error("Re-authentication failed:", error);
        throw error;
      }
    },
  },
});

export default useFirebaseStore;

import Vue from "vue";
import VueRouter from "vue-router";
import store from "./stores/index";

Vue.use(VueRouter);

import Login from "./views/Login.vue";
import SignUp from "./views/SignUp.vue";
import Configuration from "./views/Configuration.vue";
import PlayerDetail from "./views/PlayerDetail.vue";
import SimilarityDetail from "./views/SimilarityDetail.vue";
import TeamDetail from "./views/TeamDetail.vue";
import Home from "./views/Home.vue";
import List from "./components/List.vue";
import TheWelcome from "./views/TheWelcome.vue";
import LeagueDetail from "./views/LeagueDetail.vue";
import ManagerDetail from "./views/ManagerDetail.vue";

export const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/login",
      component: Login,
    },
    {
      path: "/signUp",
      component: SignUp,
    },
    {
      path: "/configuration",
      component: Configuration,
    },
    {
      path: "/player/:id",
      component: PlayerDetail,
    },
    {
      path: "/compare",
      component: SimilarityDetail,
    },
    {
      path: "/team/:id",
      component: TeamDetail,
    },
    {
      path: "/home",
      component: Home,
    },
    {
      path: "/league/:id",
      component: LeagueDetail,
    },
    {
      path: "/manager/:id",
      component: ManagerDetail,
    },
    {
      path: "/",
      component: Home,
    },
    {
      path: "*",
      component: Home,
    },
  ],
});
router.beforeEach((to, from, next) => {
  if (to.path == "/login" || to.path == "/signUp") {
    store.commit("setShowSearchBar", false);
  } else {
    store.commit("setShowSearchBar", true);
  }
  next();
});

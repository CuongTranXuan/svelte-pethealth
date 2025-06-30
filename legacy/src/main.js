// Load environment variables
require('dotenv').config()

import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import { routes } from './router/routes.js'
import Firebase from 'firebase/app'
import 'firebase/firestore'
import Vuefire from 'vuefire'

import Vuetify from 'vuetify'
import '../node_modules/vuetify/dist/vuetify.min.css';
//import 'material-design-icons-iconfont/dist/material-design-icons.css'
import colors from 'vuetify/es5/util/colors'


Vue.use(Vuetify, {
    theme: {
      primary: colors.blue.darken1,
      secondary: colors.deepOrange.lighten4,
      accent: colors.indigo.base
    }
  })

Vue.use(Vuefire)
Vue.config.productionTip = false

// Initialize Firebase
import config from './credentials/db_credential'
Firebase.initializeApp(config.Vinhphuc_credential);

export const db = Firebase.firestore()
const settings = {timestampsInSnapshots: true};
db.settings(settings);
// Set-up and use the Vue Router
// Pass in your routes and then
// Set the mode to use history
// removes # from the URL
Vue.use(VueRouter);

var router = new VueRouter({
  routes: routes,
  mode: 'history'
});

router.beforeEach(function(to,from,next){

    //Change title
    document.title = to.meta.title
    //auth with firebase
    //check whether this part need permission or not
    var requireAuth = to.matched.some(record => record.meta.requireAuth);
        Firebase.auth().onAuthStateChanged(user => {
          if (requireAuth && !user) {
            next('/login')
          }
          else if (user && to.path == '/login'){
            next('/home')
          }
          else {
            next()
          }
        })
})
new Vue({
  router: router,
  render: h => h(App)
}).$mount('#app')

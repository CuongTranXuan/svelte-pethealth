<template>
	<v-app>
        <v-container>
            <v-layout class="text-xs-center">
                <v-flex xs5>
                    <v-card>
                        <v-card-media>
                            <img src="../assets/doggo.jpg">
                        </v-card-media>
                    </v-card>
                </v-flex>
                <v-flex xs4 elevation-1>
                    <v-container style="position: relative; top: 13%;" class="text-xs-center">
                        <v-card flat style="background-color: #FAFAFA;">
                            <v-card-title primary-title>
                                <h4>Đăng nhập</h4>
                            </v-card-title>
                                <b>Pethealth Vĩnh Phúc</b>
                                <!-- <v-text-field prepend-icon="person" name="email" v-model="input.email" label="Email"></v-text-field> -->
                                <v-text-field prepend-icon="lock" name="password" v-model="input.password" v-on:keyup="enterPressed" label="Mật khẩu" type="password"></v-text-field>
                                <v-card-actions>
                                    <v-btn primary large block v-on:click="login()" color="blue lighten-2" :loading="loading" :disabled="loading" @click.native="loader= 'loading'" >Đăng nhập</v-btn>
                                </v-card-actions>
                        </v-card>
                    </v-container>
                </v-flex>
            </v-layout>
        </v-container>
	</v-app>
</template>
<script>
import Firebase from 'firebase'
export default {
    name: 'login',
    data(){
        return {
            loader: null,
            loading: false,
			input: {
				email:'a@gmail.com',
                password:''
            },
            afterlogin: '/search',
            xgender: '',
            gender: [
                "Male",
                "Female"
            ]
		}
    },
    methods: {
		login() {
            var that = this
              Firebase.auth().setPersistence(Firebase.auth.Auth.Persistence.SESSION)
                .then(function(){
                    return Firebase.auth().signInWithEmailAndPassword(that.input.email, that.input.password)
                            .then(user => {
                                that.redirect()
                            }, err => {alert(err)})
                })
            // Firebase.auth()
          	// 	.signInWithEmailAndPassword(this.input.email, this.input.password)
          	// 	.then( user => { 
            //         this.$router.push({ name: 'search'}); },
         	//  		error => { alert(error); });
        },
        redirect(){
            this.$router.push({path: '/home'})
        },
        enterPressed: function(e) {
            if (e.keyCode === 13) {
                this.$data.loading = true;  
                this.login();
                setTimeout(() => (this.$data.loading = false), 2500)
            }
        }
	},
    watch: {
      loader () {
        const l = this.loader
        this[l] = !this[l]

        setTimeout(() => (this[l] = false), 2500)

        this.loader = null
      }
    }
}
</script>
	
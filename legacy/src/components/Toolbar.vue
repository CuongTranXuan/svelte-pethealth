<template>
    <div>
        <v-toolbar
            id="topBar"
            color="primary"
            dark
            app
        >
            <v-toolbar-side-icon v-on:click="activePanel"> </v-toolbar-side-icon>

            <v-flex xs11 ml-5>
<!-- autocomplete here............................................             -->
                <v-autocomplete
                    v-model="chosen"
                    :items="customer"                 
                    color="blue-grey lighten-2"
                    label="Search"
                    item-text="phone"
                    item-value="phone"
                    v-on:keyup="enterPressed"
                >
                    <template
                        slot="item"
                        slot-scope="{ item,tile }"
                    >
                        <v-list-tile-content>
                            <v-list-tile-title v-text="item.phone"></v-list-tile-title>
                            <v-list-tile-sub-title v-text="item.name"></v-list-tile-sub-title>
                        </v-list-tile-content>
                    </template>
                </v-autocomplete>
            </v-flex>
            <v-btn icon v-on:click="choose">
            <v-icon>search</v-icon>
            </v-btn>
            <!-- <v-btn icon>
                <v-badge right color="red">
                    <span slot="badge">69</span>
                    <v-icon>notifications_none</v-icon>
                </v-badge>
            </v-btn> -->
        </v-toolbar>
        <v-container style="height: 60px;"></v-container>
<!-- navigation part............................................... -->
        <v-navigation-drawer
        v-model="drawer"
        style="position:fixed; top:0; left:0;"
        absolute
        temporary
        >
        <v-list class="pa-1">
            <v-list-tile avatar>
                <v-list-tile-avatar>
                    <img src="../assets/doggo.jpg" >
                </v-list-tile-avatar>

                <v-list-tile-content>
                    <v-list-tile-title>Just a doggo :></v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>

        <v-list>
            <v-divider></v-divider>

            <v-list-tile
            v-for="item in items"
            :key="item.title"
            v-on:click="navigate(item)"
            >
                <v-list-tile-action>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
        </v-navigation-drawer>
<!-- dialog............................................... -->
        <v-dialog
        v-model="dialog"
        width="550px">
            <v-card>
                <v-card-title
                class="headline green lighten-2"
                primary-title>
                Change administrator's password
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="currentPwd" label="Mật khẩu cũ" type="password"> </v-text-field>           
                    <v-text-field v-model="newPwd1" label="Mật khẩu mới" type="password"> </v-text-field>  
                    <v-text-field v-model="newPwd2" label="Nhập lại mật khẩu mới" type="password"> </v-text-field>  
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="error"
                        flat
                        v-on:click="cancelPwd"
                    >
                        Hủy
                    </v-btn>
                    <v-btn
                        color="primary"
                        flat
                        v-on:click="changePwd"
                    >
                        Đổi 
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import {db} from '../main'
import Firebase from 'firebase'
export default {
    name: "toolbar",
    data() {
        return {
            drawer: null,
            currentPwd: '',
            newPwd1: '',
            newPwd2: '',
            dialog: false,
            items: [
            { title: 'Trang chủ', icon: 'home' , route: 'home'},
            { title: 'Tạo hóa đơn mới', icon: 'queue' , route: 'newbill'},
            { title: 'Tạo khách hàng mới', icon: 'person_add' , route: 'newcustomer'},
            { title: 'Thống kê', icon: 'ballot' , route: 'statistic'},
            { title: 'Đổi mật khẩu', icon: 'vpn_key'},
            { title: 'Đăng xuất', icon: 'backspace'}
            ],
            customer: [
            ],
            chosen: ''
        }
    },
    created(){
         var that = this //change the scope, fuck javascript
            db.collection('customer').get().then(function(querySnapshot) {
                querySnapshot.forEach(function(result) {
                    that.customer.push({ name: result.data().name,phone: result.data().phone})
                })
        })
    },
    methods: {
        activePanel() {
            this.$data.drawer = !this.$data.drawer;
        },
        navigate(item) {
            if (item.title == 'Đăng xuất') {
                Firebase.auth().signOut().then(() => {
                    this.$router.push({ name: 'login'})
                })
            } else if (item.title == "Đổi mật khẩu"){
                this.$data.dialog = true;
                this.$data.drawer = false;
            } else
                this.$router.push({ name: item.route, params: item.params})
        },
        choose(){
            this.$router.push({path: '/customerprofile/'+ this.$data.chosen})
            location.reload();
        },
        enterPressed: function(e) {
            if (e.keyCode === 13) {
                // this.$data.loading = true;  
                this.choose();
                // setTimeout(() => (this.$data.loading = false), 5000)
            }
        },
        changePwd() {
            let pwd = this.$data;
            if (pwd.newPwd1 != pwd.newPwd2) {
                alert("Nhập lại không đúng !");
                this.$data.newPwd1 = '';
                this.$data.newPwd2 = '';
            } else {
                var user = Firebase.auth().currentUser;
                let credential = Firebase.auth.EmailAuthProvider.credential(
                    user.email, 
                    pwd.currentPwd
                );
                user.reauthenticateAndRetrieveDataWithCredential(credential)
                .then(function() {
                    user.updatePassword(pwd.newPwd1)
                    .then(function() {
                        alert("Đổi mật khẩu thành công");
                    })
                    .catch(function(error) {
                        alert(error);
                    })
                }) 
                .catch(function(error) {
                    alert(error);
                })
            }
        },
        cancelPwd() {
            this.$data.newPwd1 = '';
            this.$data.newPwd2 = '';
            this.$data.currentPwd = '';
            this.$data.dialog = false;
        }
    }
}
</script>


<style>
#topBar {
    position: fixed;
    padding-top: 9px
}
</style>  
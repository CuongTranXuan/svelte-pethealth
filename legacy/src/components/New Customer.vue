<template>
    <v-app>
        <toolbar> </toolbar>
        <v-container wrap id="body">
            <v-layout row>
                <v-flex xs9>
                    <v-text-field
                    id="inputBox"
                    v-model="inputName"
                    label="Name"
                    outline
                    ></v-text-field>
                </v-flex>
            </v-layout>
            <v-layout row>
                <v-flex xs9>
                    <v-text-field
                    id="inputBox"
                    v-model="inputPhone"
                    label="Phone Number"
                    outline
                    ></v-text-field>
                </v-flex>
            </v-layout>
            <v-layout row>
                <v-flex xs9>
                    <v-text-field
                    id="inputBox"
                    v-model="inputAddress"
                    label="Address"
                    outline
                    ></v-text-field>
                </v-flex>
            </v-layout>
            <v-layout row>
                <v-spacer> </v-spacer>
                <v-flex>                     
                    <v-btn v-on:click="dialog = true" color="info"> Gửi </v-btn>
                </v-flex>
            </v-layout>
        </v-container>
        <v-dialog
        v-model="dialog"
        width="600">
            <v-card>
                <v-card-title
                class="headline green lighten-2"
                primary-title>
                Bạn có chắc muốn thêm khách hàng này không?
                </v-card-title>
                <v-card-text> Tên khách hàng : {{inputName}} <br>
                              Số điện thoại : {{inputPhone}} <br>
                              Địa chỉ : {{inputAddress}}
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="primary"
                        flat
                        @click="submit"
                    >
                        Yes
                    </v-btn>
                    <v-btn
                        color="error"
                        flat
                        @click="dialog = false"
                    >
                        No
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-app>
</template>

<script>
import {db} from '../main'
import toolbar from './Toolbar.vue'

export default {
    components: {toolbar},
    name: 'NewCustomer',
    data() {
        return {
            dialog: false,
            inputName: null,
            inputPhone: null,
            inputAddress: null
        }

    },
    methods: {
        submit: function() {
            this.$data.dialog = false
            let that = this;
            var dat = this.$data
            var customerId = new Date();
            if (dat.inputName && dat.inputPhone && dat.inputAddress){
                db.collection('customer').where('phone', '==', dat.inputPhone)
                .get()
                .then(function(querySnapshot){
                    if (querySnapshot.size < 1) {
                        db.collection('customer').add({
                            name: dat.inputName,
                            address: dat.inputAddress,
                            phone: dat.inputPhone,
                            id: customerId
                        })
                        that.$router.push({path: '/customerprofile/'+ dat.inputPhone});
                    } else {
                        alert("Số điện thoại này đã được sử dụng, vui lòng kiểm tra lại");
                    }                    
                })
                .catch(err => {
                    alert(err);                
                    })
                
            } else {
                alert("Thông tin không được phép để trống!");
            }
        }
    }
}
</script>

<style scoped>
#inputBox {
    align-self: auto
}
#body {
    padding-top: 5%
}
</style>

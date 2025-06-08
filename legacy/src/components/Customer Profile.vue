<template>
    <v-app padding-top="5%">
        <toolbar> </toolbar>
        <v-container grid-list-xs>
            <v-layout row wrap>
                <v-flex xs7>
                    <v-text-field
                    v-model="customer.name"
                    label="Tên khách hàng"
                    :disabled= disabled
                    ></v-text-field>
                    <v-text-field
                    v-model="customer.phone"
                    label="Số điện thoại"
                    :disabled= disabled
                    ></v-text-field>
                    <v-text-field
                    v-model="customer.address"
                    label="Địa chỉ"
                    :disabled= disabled
                    ></v-text-field>
                </v-flex>
                <v-flex xs3>
                    <br>
                    <v-btn v-on:click="changeState" :color="buttonColor"> {{buttonText}} </v-btn>
                    <br>
                    <v-btn v-on:click="update" :disabled="disabled" color="success"> Lưu thay đổi </v-btn>
                </v-flex>
            </v-layout>

            <v-layout pt-3>
                <v-card id="card">
                    <v-card-title>
                        <v-expansion-panel
                        v-model="panel"
                        expand
                        inset>
                            <v-expansion-panel-content>
                                <div slot="header"> 
                                    <v-btn color="success" dark>
                                        <v-icon dark left>add_box</v-icon>
                                        Thêm thú cưng
                                    </v-btn>
                                    <v-btn color="info" dark v-on:click.native="checkBill">
                                        <v-icon dark left>receipt</v-icon>
                                        Kiểm tra hóa đơn
                                    </v-btn>
                                </div>
                                <v-card>                                    
                                    <v-layout row px-4>
                                        <v-flex xs4>
                                            <v-text-field                                            
                                            v-model="newPet.name"
                                            label="Tên thú cưng"
                                            outline>
                                            </v-text-field>
                                        </v-flex>
                                        <v-flex xs3 ml-5>
                                            <v-text-field
                                            v-model="newPet.species"
                                            label="Chủng loại"
                                            outline>
                                            </v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row px-4>                    
                                        <v-flex xs2>
                                            <v-text-field
                                            v-model="newPet.age"
                                            label="Tuổi"
                                            outline>
                                            </v-text-field>
                                        </v-flex>
                                        <v-flex xs2 ml-5>
                                            <v-select
                                                :items="gender"
                                                v-model="newPet.gender"
                                                label="Giới tính"
                                                outline
                                            ></v-select>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row px-4>
                                         <v-flex xs9>
                                            <v-text-field
                                            v-model="newPet.description"
                                            label="Tình trạng"
                                            outline>
                                            </v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row px-4>
                                        <v-btn color="primary" dark v-on:click="submitPet">Lưu
                                            <v-icon dark right>check_circle</v-icon>
                                        </v-btn>
                                        <v-btn color="red" dark v-on:click="cancelAdd">Hủy
                                            <v-icon dark right>block</v-icon>
                                        </v-btn>
                                    </v-layout>
                                </v-card>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-card-title>

                    <v-data-table   
                    :headers="headers"
                    :items="petInfo"
                    item-key="name"
                    expand>
                        <template slot="items" slot-scope="props">
                            <tr @click="props.expanded = !props.expanded">
                                <td class="text-xs-left">{{ props.item.name }}</td>
                                <td class="text-xs-left">{{ props.item.species }}</td>
                                <td class="text-xs-left">{{ props.item.gender }}</td>
                                <td class="text-xs-left">{{ props.item.age }}</td>
                            </tr>
                        </template>
                        <template slot="no-data">
                            <v-alert :value="true" color="error" icon="warning">
                                Sorry, nothing to display here :(
                            </v-alert>
                        </template>
                        <template slot="expand" slot-scope="props">
                            <v-card flat id="expandcard">
                                <v-card-text class="text-xs-left">{{props.item.description}}</v-card-text>
                            </v-card>
                        </template>
                    </v-data-table>
                </v-card>  
            </v-layout>
        </v-container>
        <v-container style="height: 1000px;"></v-container>
    </v-app>
</template>

<script>
import {db} from '../main'
import _ from 'lodash'
import { database } from 'firebase';
import toolbar from './Toolbar.vue'
export default {
    components: {toolbar},
    data() {
        return{
            panel: [],      //Expand add new pet panel
            disabled: true,     //Disable text fields
            buttonText: 'Edit',
            buttonColor: 'info',
            headers: [
                {text: 'Tên thú cưng', value: 'name'},
                {text: 'Chủng loại', value: 'species'},
                {text: 'Giới tính', value: 'gender'},
                {text: 'Tuổi', value: 'age'}
            ],
            gender: [
                "Đực",
                "Cái"
            ],
            petInfo: [],
            newPet: {
                name: null,
                species: null,
                age: null,
                description: null,
                gender: null,
                id: null
            },
            uid: null,
            customer: {
                name: '',
                phone: '',
                address: ''
            },
            originalCustomer: {
                name: '',
                phone: '',
                address: ''
            }
        }
    },
    created(){
        let that = this
        let phone = this.$route.params.id
        //Get customer info
        db.collection('customer').where('phone', '==', phone)
            .get()
            .then(function(querySnapshot){
                if (querySnapshot.size < 1) {
                    alert("This is not a valid user link, rerouting to homepage");
                    that.$router.push({ name: 'home'}); //Fix this to reroute if invalid link encountered
                }
                querySnapshot.forEach(function(doc){
                    that.$data.customer = doc.data();
                    that.$data.originalCustomer = Object.assign({}, that.$data.customer);
                    that.$data.uid = doc.id;
                })
            })
            .catch(err => {
                alert(err)
            })
        //Get customer's pet list
        that.$data.petInfo = [];
        db.collection('pet').where('owner_phone', '==', phone)
        .get()
        .then(function(querySnapshot){
            querySnapshot.forEach(function(doc){
                that.$data.petInfo.push(doc.data());
            })
        })
        .catch(err => {
            alert(err)
        })
    },
    methods: {
        changeState(){
            this.$data.disabled = !this.$data.disabled;
            if (this.$data.disabled == true){
                this.$data.buttonText = "Thay đổi";
                this.$data.buttonColor = "info";
                this.$data.customer = Object.assign({}, this.$data.originalCustomer);
            }
            else {
                this.$data.buttonText = "Hủy";
                this.$data.buttonColor = "error";
            }            
        },
        update() {
            let that = this
            if (this.$data.customer.name == this.$data.originalCustomer.name)
                delete this.$data.customer.name;
            if (this.$data.customer.phone == this.$data.originalCustomer.phone)
                delete this.$data.customer.phone;
            if (this.$data.customer.address == this.$data.originalCustomer.address)
                delete this.$data.customer.address;
            if (_.isEmpty(this.$data.customer)) {
                alert("Nothing changed, nothing saved");
                this.$data.customer = Object.assign({}, this.$data.originalCustomer);
            }
            var phone = this.$data.originalCustomer.phone;

            if (!_.isEmpty(this.$data.customer.phone))
                phone = this.$data.customer.phone;

            db.collection("customer").doc(that.$data.uid).update(this.$data.customer)
            .then(function() {
                console.log("Update completed on " + phone);
                that.$data.disabled = !that.$data.disabled;
                if (that.$data.disabled == true){
                    that.$data.buttonText = "Edit";
                    that.$data.buttonColor = "info";
                }
                else {
                    that.$data.buttonText = "Cancel";
                    that.$data.buttonColor = "error";
                } 
                that.$router.push({ name: 'customerprofile', params: { id: phone }})
                location.reload();
            });
        },
        submitPet() {
            let pet = this.$data.newPet;
            let that = this;
            if (pet.name && pet.species && pet.age && pet.description && pet.gender) {
                pet.id = Date.now();
                db.collection('pet').add({
                    name: pet.name,
                    owner_phone: this.$data.customer.phone,
                    species: pet.species,
                    age: pet.age,
                    gender: pet.gender,
                    description: pet.description,
                    id: pet.id
                })
                .then(function() {
                    location.reload();
                });
            } else {
                alert("Hãy điền đầy đủ thông tin!");
            }
            
        },
        cancelAdd() {
            if (confirm("Bạn chắc chắn muốn hủy?")) {
                delete this.$data.newPet.name;
                delete this.$data.newPet.ownerPhone;
                delete this.$data.newPet.species;
                delete this.$data.newPet.age;
                delete this.$data.newPet.description;
                delete this.$data.newPet.gender;
                this.$data.panel = [];
            }
        },
        checkBill() {
            this.$router.push({path: '/billlist/'+ this.$route.params.id});
        }
    }
}
</script>

<style>
#card {
    width: 100%
}
#topBar {
    position: fixed
}
#expandcard {
    background-color: lightgray
}
</style>


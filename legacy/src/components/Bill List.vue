<template>
    <v-app padding-top="5%">
        <toolbar> </toolbar>
        <v-container grid-list-xs>
            <v-layout row wrap pb5>
                <v-flex xs7>
                    <v-text-field
                    v-model="customer.name"
                    label="Name"
                    disabled
                    ></v-text-field>
                    <v-text-field
                    v-model="customer.phone"
                    label="Phone"
                    disabled
                    ></v-text-field>
                </v-flex>
            </v-layout>
            <v-container style="height: 70px;"></v-container>
            <v-layout pt5>
                <v-card width="100%">
                    <v-data-table
                    :headers="headers"
                    :items="billList"
                    item-key="name">
                        <template slot="items" slot-scope="props">
                            <td class="text-xs-left">{{ props.item.pet.name }}</td>
                            <td class="text-xs-left">{{ props.item.description }}</td>
                            <td class="text-xs-left">{{ formatPrice(props.item.paid*1000) }}đ</td> 
                            <td class="text-xs-left">{{ formatPrice(props.item.price*1000) }}đ</td>
                            <td class="text-xs-left">{{ props.item.appointedDate }}</td>
                            <td class="text-xs-left">{{ props.item.selectedDate }}</td>
                        </template>
                        <template slot="no-data">
                            <v-alert :value="true" color="error" icon="warning">
                                Không có hóa đơn để hiển thị :(
                            </v-alert>
                        </template>
                    </v-data-table>
                </v-card>
            </v-layout>
        </v-container>  
    </v-app>
</template>

<script>
import toolbar from './Toolbar.vue'
import {db} from '../main'
export default {    
    components: {toolbar},
    data() {
        return {
            headers: [
                {text: 'Tên thú cưng', value: 'name'},
                {text: 'Thông tin', value: 'description'},
                {text: 'Đã thanh toán?', value: 'paid'},
                {text: 'Giá', value: 'price'},                
                {text: 'Ngày hẹn', value: 'appointedDate'},
                {text: 'Ngày tạo đơn', value: 'createdDate'}                
            ],
            customer: {
                name: '',
                phone: '',
                address: '',
                gender: '',
                email: ''
            },
            billList: []
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
                    alert("This is not a valid bill list link, rerouting to homepage");
                    that.$router.push({ name: 'home'}); //Fix this to reroute if invalid link encountered
                }
                querySnapshot.forEach(function(doc){
                    that.$data.customer = doc.data();
                })
            })
            .catch(err => {
                alert(err)
            })
        //Get customer's pet list
        that.$data.billList = [];
        var d 
        db.collection('bill').where('customerPhone', '==', phone)
        .get()
        .then(function(querySnapshot){
            querySnapshot.forEach(function(doc){
                d = new Date();
                d.setTime(doc.data().createdDate);
                that.$data.billList.push(doc.data());
                //that.$data.billList[that.$data.billList.length - 1].createdDate = d.toISOString().slice(0,10).replace(/-/g,"-");
            })
        })
        .catch(err => {
            alert(err)
        })
    },
    methods: {
        formatPrice(value){
            let val = (value/1).toLocaleString('en-US', { minimumFractionDigits: 0 })
            return val
        }
    }
}
</script>

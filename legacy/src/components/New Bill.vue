    <template>
    <v-app>
        <toolbar> </toolbar>
        <v-container wrap style="padding-top: 5%">
            <v-layout row>
                <v-flex xs6>

                <v-autocomplete
                    v-model="customer"
                    :items="customerList"                 
                    color="blue-grey lighten-2"
                    label="Số điện thoại khách hàng"
                    item-text="phone"
                    return-object
                    prepend-icon="phone"
                    outline
                >
                    <template
                        slot="item"
                        slot-scope="{ item,tile }"
                    >
                        <v-list-tile-content>
                            <v-list-tile-title v-text="item.phone"></v-list-tile-title>
                        </v-list-tile-content>
                    </template>
                </v-autocomplete>
                </v-flex>
                <v-spacer> </v-spacer>
                <v-flex xs5>
                    <v-select
                        :items="petList"
                        item-text="name"
                        item-value="id"
                        v-model="inputPet"
                        label="Thú cưng"
                        return-object
                        prepend-icon="pets"
                        outline
                    ></v-select>
                </v-flex>
            </v-layout>

            <v-layout row>
                <v-flex xs6>
                    <v-text-field
                    v-model="customer.name"
                    label="Tên khách hàng"
                    prepend-icon="person"
                    outline
                    > </v-text-field>
                </v-flex>
                <v-spacer> </v-spacer>                
                <v-flex xs5>
                    <v-text-field
                    v-model="inputPrice"
                    label="Tổng tiền"
                    prepend-icon="local_grocery_store"
                    outline
                    suffix=".000đ"
                    ></v-text-field>
                </v-flex>
            </v-layout>

            <v-layout row wrap>
                <v-flex xs6>
                    <v-menu
                        ref="menu1"
                        :close-on-content-click="false"
                        v-model="menu1"
                        :nudge-right="40"
                        :return-value.sync="appointedDate"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        min-width="290px"
                    >
                        <v-text-field
                        slot="activator"
                        v-model="appointedDate"
                        label="Ngày hẹn"
                        prepend-icon="event"
                        readonly
                        outline
                        ></v-text-field>
                        <v-date-picker v-model="appointedDate" landscape scrollable locale="vi-vn">
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="appointedDate = null;$refs.menu1.save(appointedDate)">Xóa ngày hẹn</v-btn>
                        <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.menu1.save(appointedDate)">OK</v-btn>
                        </v-date-picker>
                    </v-menu>                    
                </v-flex>
                <v-spacer> </v-spacer>       
                <v-flex xs5>
                    <v-text-field
                    v-model="paid"
                    label="Số tiền đã thanh toán"
                    prepend-icon="local_grocery_store"
                    outline
                    suffix=".000đ"
                    ></v-text-field>
                </v-flex>
            </v-layout>
            
            <v-layout row wrap>
                <v-flex xs6>
                    <v-menu
                        ref="menu2"
                        :close-on-content-click="false"
                        v-model="menu2"
                        :nudge-right="40"
                        :return-value.sync="selectedDate"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        min-width="290px"
                    >
                        <v-text-field
                        slot="activator"
                        v-model="selectedDate"
                        label="Ngày tạo hóa đơn"
                        prepend-icon="event"
                        readonly
                        outline
                        ></v-text-field>
                        <v-date-picker v-model="selectedDate" landscape scrollable locale="vi-vn">
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.menu2.save(selectedDate)">OK</v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-flex>
            </v-layout>

             <v-layout row>
                <v-flex xs9>
                    <v-textarea
                    v-model="inputDescription"
                    label="Thông tin"
                    prepend-icon="picture_in_picture"  
                    outline   
                    ></v-textarea>
                </v-flex>
            </v-layout>

            <v-layout row>
                <v-flex offset-xs11>
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
                Xác nhận tạo hóa đơn 
                </v-card-title>
                <v-card-text> Tên : {{customer.name}} <br>
                              Số điện thoại : {{customer.phone}} <br>
                              Tên thú cưng : {{inputPet.name}} <br> 
                              Tổng tiền : {{formatPrice(inputPrice*1000)}}đ <br>
                              Ngày hẹn : {{appointedDate}} <br>
                              Ngày tạo hóa đơn : {{selectedDate}} <br>
                              Đã thanh toán : {{formatPrice(paid*1000)}}đ <br>
                              Thông tin : {{inputDescription}}
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
    name: 'Newbill',
    data() {
        return {
            menu1: false,
            menu2: false,
            dialog: false,
            // customerName: null,
            // customerPhone: null,
            customer: {name: '', phone: ''},
            inputPet: {name: '',id: ''},
            selectedDate: null,
            appointedDate: null,
            inputDescription: null,
            inputPrice: null,
            paid: null,
            petList: [], // list pet from the user
            customerList: [] // for autocomplete
        }

    },
    created(){
        let that = this
        db.collection('customer').get().then(querySnapshot => {
            if (querySnapshot.size < 1) {
                alert("error: can/'t load customer list ")
            }
            querySnapshot.forEach(doc => {
                that.customerList.push({phone: doc.data().phone,name: doc.data().name})
            })
        })
    },
    watch: {
        customer: function(val) {
            this.getPetList()
        },
    },
    methods: {
        submit: function() {
            this.$data.dialog = false;
            let that = this;
            var dat = this.$data;
            if (dat.customer && dat.inputPet.id && dat.inputDescription && dat.inputPrice && dat.selectedDate && dat.paid) {
                var idTime = Date.now();
                db.collection('bill').add({
                    customerName: this.$data.customer.name,
                    customerPhone: this.$data.customer.phone,
                    pet: this.$data.inputPet,
                    selectedDate: this.$data.selectedDate,
                    createdDate: idTime, // still timestamp here
                    appointedDate: this.$data.appointedDate,
                    description: this.$data.inputDescription,
                    price: this.$data.inputPrice,
                    paid: this.$data.paid
                })
                that.$router.push({path: '/billlist/'+ this.$data.customer.phone});
            } else {
                alert('Hãy điền đầy đủ thông tin!');
            }
        },
        getPetList: function(){
            var that = this 
            this.$data.petList = []
            db.collection('pet').where('owner_phone','==',that.$data.customer.phone)
                .get().then(function(querySnapshot){
                    if(querySnapshot.size < 1) alert('can\'t read pet data')
                    else querySnapshot.forEach(function(result){
                        that.petList.push(result.data())
                    })
                })
        },
          formatPrice(value){
            let val = (value/1).toLocaleString('en-US', { minimumFractionDigits: 0 })
            return val
        }
    }
}
</script>

<style scoped>

</style>

<template>
    <v-app id="homepage">
        <toolbar> </toolbar>
        <v-container id="backgroundImg" fluid grid-list-md>
            <v-flex id="head" pl-4>
                Những khách hẹn gặp hôm nay :
            </v-flex>
            <v-data-iterator
                :items="items"
                content-tag="v-flex"
                hide-actions
                wrap
            >
                <v-flex
                    slot="item"
                    slot-scope="props"
                    lg10
                    pt-2
                    pl-5
                >
                    <v-card>
                        <v-card-title class="subheading font-weight-bold">Tên khách: {{ props.item.customerName }} /  SĐT: {{ props.item.customerPhone }}</v-card-title>

                        <v-divider></v-divider>

                        <v-list dense>
                            <v-list-tile>
                            <v-list-tile-content>Tên thú cưng:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{ props.item.pet.name }}</v-list-tile-content>
                            </v-list-tile>

                            <v-list-tile>
                            <v-list-tile-content>Thông tin:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{ props.item.description }}</v-list-tile-content>
                            </v-list-tile>

                            <v-list-tile>
                            <v-list-tile-content>Tổng tiền:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{ formatPrice(props.item.price*1000) }}đ</v-list-tile-content>
                            </v-list-tile>

                            <v-list-tile>
                            <v-list-tile-content>Đã thanh toán:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{ formatPrice(props.item.paid*1000) }}đ</v-list-tile-content>
                            </v-list-tile>      

                             <v-list-tile>
                            <v-list-tile-content>Cần thanh toán tiếp:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{ formatPrice(props.item.price*1000 - props.item.paid*1000) }}đ</v-list-tile-content>
                            </v-list-tile>               
                        </v-list>
                        </v-card>
                </v-flex>
            </v-data-iterator>
        </v-container>
    </v-app>
</template>

<script>
import toolbar from './Toolbar.vue'
import {db} from '../main.js'
export default {
    components: {toolbar},
    data: () => ({
      rowsPerPageItems: [4, 8, 12],
      pagination: {
        rowsPerPage: 4
      },
      items:[],
      sum: 0
    }),
     created(){
        var that = this
        var d = new Date;
        var year = d.getFullYear()
        var month = d.getMonth() + 1 // idiot js counts month from 0
        var date = d.getDate()
        var today
        this.$data.sum = 0
        if (month > 9)
            today = year + '-' + month
        else today = year + '-0' + month
        if (date > 9) 
            today += '-' + date
        else today += '-0' + date
        console.log(today)
        db.collection('bill').where('appointedDate','==',today)
        .get()
        .then(function(querySnapshot){
            querySnapshot.forEach(doc => {
                that.$data.items.push(doc.data())
                that.$data.sum ++
            })
        }).catch(err => {alert(err)})
    },
    methods: {
        formatPrice(value){
            let val = (value/1).toLocaleString('en-US', { minimumFractionDigits: 0 })
            return val
        }
    }
}
</script>

<style>
#backgroundImg {
    background-size: 100%;
    background-image: url('../assets/doggo.jpg');
}
#homepage {
    z-index: -1;
}

#head {
    font-weight: bold;
    font-size: 30px;
    color: white;
    text-align: left;
}
</style>

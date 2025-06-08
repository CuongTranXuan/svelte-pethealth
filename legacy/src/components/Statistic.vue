<template>
    <v-app>
        <toolbar> </toolbar>
        <v-container>
            <v-layout row>
                <v-flex xs7>
                    <v-text-field
                    value="Chọn khoảng thời gian cần xem : "
                    readonly
                    ></v-text-field>
                </v-flex>
            </v-layout>
            <v-layout row>
                <v-flex xs2 mr-3 ml-5>
                    <v-select
                        :items="year"
                        v-model="selected.year"
                        label="Năm"
                        outline
                    ></v-select>
                </v-flex>
                <v-flex xs2 mr-3>
                    <v-select
                        :items="month"
                        v-model="selected.month"
                        @change="calculateDays"
                        label="Tháng"
                        outline
                    ></v-select>
                </v-flex>
                <v-flex xs2>
                    <v-select
                        :items="day"
                        v-model="selected.day"
                        label="Ngày"
                        outline
                    ></v-select>
                </v-flex>
            </v-layout>
                <v-btn color="info" dark v-on:click="search">Search
                    <v-icon dark right>search</v-icon>
                </v-btn>
            <v-layout>
                <v-card id="table">
                    <v-card-title id="title"> Thống kê (đơn vị tính : nghìn đồng) </v-card-title>
                    <v-data-table
                    :headers="headers"
                    :items="billList"
                    item-key="name">
                        <template slot="items" slot-scope="props">
                            <td class="text-xs-left">{{ props.item.pet.name }}</td>
                            <td class="text-xs-left">{{ props.item.description }}</td>
                            <td class="text-xs-left">{{ props.item.appointedDate }}</td>
                            <td class="text-xs-left">{{ props.item.selectedDate }}</td>
                            <td class="text-xs-left">{{ formatPrice(props.item.price*1000) }}đ</td>
                            <td class="text-xs-left">{{ formatPrice(props.item.paid*1000) }}đ</td>
                        </template>
                        <template slot="no-data">
                            <v-alert :value="true" color="error" icon="warning">
                                Không có hóa đơn để hiển thị :(
                            </v-alert>
                        </template>
                        <template slot="footer">
                            <td colspan="100%" id="stat">
                                Tổng : {{formatPrice(sum*1000)}}đ <br> Đã thanh toán : {{formatPrice(paid*1000)}}đ <br> Còn nợ : {{formatPrice(debt*1000)}}đ
                            </td>
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
            year: [],
            month: [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
            ],
            day: [],
            selected: {
                year: null,
                month: null,
                day: null
            },
            headers: [
                {text: 'Tên thú cưng', value: 'name'},
                {text: 'Thông tin', value: 'description'},              
                {text: 'Ngày hẹn', value: 'appointedDate'},
                {text: 'Ngày tạo đơn', value: 'createdDate'}, 
                {text: 'Tổng thanh toán', value: 'price'},  
                {text: 'Đã thanh toán', value: 'paid'}           
            ],
            sum: 0,
            paid: 0,
            debt: 0,
            billList: []
        }
    },
    created() {
        let currentYear = (new Date()).getFullYear();
        let dat = this.$data;
        var i
        for (i = 2018; i <= currentYear; i++)
            dat.year.push(i);       //Push an array of years from 2018
    },
    methods: {
        calculateDays: function(val) {
            let x = this.$data.selected.month;
            let y = this.$data.selected.year;
            this.$data.day = [];
            var i
            if (x == 1 || x == 3 || x == 5 || x == 7 || x == 8 || x == 10 || x == 12)
            {
                for (i = 1; i <= 31; i++)
                    this.$data.day.push(i);                   
            } else if (x == 4 || x == 6 || x == 9 || x == 11) {
                for (i = 1; i <= 30; i++)
                    this.$data.day.push(i);
            } else if ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) {
                for (i = 1; i <= 29; i++)
                    this.$data.day.push(i);
            } else
                for (i = 1; i <= 28; i++)
                    this.$data.day.push(i);
        },
        search() {
            // make the right format of selectedDate, fuck this format, dcm
            let startDate = this.$data.selected.year;
            let endDate = startDate;
            let that = this;
            if (this.$data.selected.month == null){
                startDate += '-01-01';
                endDate = (this.$data.selected.year + 1) + '-01-01';
            } else
            if (this.$data.selected.month != null && this.$data.selected.day == null) {
                if (this.$data.selected.month > 9){
                    startDate += '-' + this.$data.selected.month + '-01';
                    endDate += '-' + (this.$data.selected.month + 1) + '-01';
                } else if (this.$data.selected.month < 9){
                    startDate += '-0' + this.$data.selected.month + '-01';
                    endDate += '-0' + (this.$data.selected.month + 1) + '-01';
                } else{
                    startDate += '-0' + this.$data.selected.month + '-01';
                    endDate += '-' + (this.$data.selected.month + 1) + '-01';
                }
            } else
            if (this.$data.selected.day != null) {
                if (this.$data.selected.day > 9){
                    startDate += '-' + this.$data.selected.month + '-' + this.$data.selected.day;
                    endDate += '-' + this.$data.selected.month + '-' + (this.$data.selected.day + 1);
                } else if (this.$data.selected.day < 9){
                    startDate += '-' + this.$data.selected.month + '-0' + this.$data.selected.day;
                    endDate += '-' + this.$data.selected.month + '-0' + (this.$data.selected.day + 1);                    
                } else {
                     startDate += '-0' + this.$data.selected.month + '-0' + this.$data.selected.day;
                    endDate += '-' + this.$data.selected.month + '-' + (this.$data.selected.day + 1);
                }
            }
            // startDate = Date.parse(startDate)
            // endDate = Date.parse(endDate)
            console.log(startDate)
            console.log(endDate)
            // let dummy
            that.$data.sum = 0
            that.$data.paid = 0
            that.$data.debt = 0
            that.$data.billList = []
            db.collection('bill').where('selectedDate', '>=', startDate)
                    .where('selectedDate','<',endDate)
                    .get()
                    .then(function(querySnapshot){
                        querySnapshot.forEach(function(doc){
                            that.$data.billList.push(doc.data())
                            // console.log(doc.data())
                        })
                        that.$data.billList.forEach(doc => {
                        // dummy = new Date(doc.createdDate).toISOString()
                        // doc.createdDate = dummy.substring(0,10)
                        // console.log(doc.createdDate)
                        that.$data.sum += parseInt(doc.price)
                        that.$data.paid += parseInt(doc.paid)
                        that.$data.debt = that.$data.sum - that.$data.paid
                        })
                        that.$data.billList.sort(function(a,b){
                            return  - a.paid + b.paid;
                        })
                        }
                    )
        },
          formatPrice(value){
            let val = (value/1).toLocaleString('en-US', { minimumFractionDigits: 0 })
            return val
        } //potato format for price :*
    }
}
</script>

<style>
#table {
    width: 100%
}

#stat {
    font-size: 20px;
    text-align: left;
}

#title {
    font-size: 25px;
}
</style>

<template>
    <v-app>
        <v-container wrap>
            <v-layout row>
                <v-flex xs6>
                    <v-text-field
                    counter="40"
                    id="inputBox"
                    v-model="inputName"
                    label="Tên thú cưng"
                    ></v-text-field>
                </v-flex>
            </v-layout>
            <v-layout row>
                <v-flex xs6>
                    <v-text-field
                    counter="15"
                    id="inputBox"
                    v-model="inputOwnerPhone"
                    label="Số điện thoại chủ"
                    ></v-text-field>
                </v-flex>
            </v-layout>
            <v-layout row>
                <v-flex xs6>
                    <v-text-field
                    counter="40"
                    id="inputBox"
                    v-model="inputSpecies"
                    label="Chủng loại"
                    ></v-text-field>
                </v-flex>
            </v-layout>
            <v-layout row>
                <v-flex xs6>
                    <v-select
                        :items="gender"
                        v-model="inputGender"
                        label="Giới tính"
                        single-line
                    ></v-select>
                </v-flex>
            </v-layout>
            <v-layout row>
                <v-flex xs6>
                    <v-text-field
                    counter="10"
                    id="inputBox"
                    v-model="inputAge"
                    label="Tuổi"
                    ></v-text-field>
                </v-flex>
            </v-layout>
            <v-layout row>
                <v-flex xs6>
                    <v-text-field
                    counter="500"
                    id="inputBox"
                    v-model="inputDescription"
                    label="Tình trạng"
                    ></v-text-field>
                </v-flex>
            </v-layout>
            <v-layout row>
                <v-flex xs-6>
                    <v-btn v-on:click="submit" color="info"> Gửi </v-btn>
                </v-flex>
            </v-layout>
        </v-container>
    </v-app>
</template>

<script>

import {db} from '../main'



export default {
    name: 'Newpet',
    data() {
        return {
            inputName: null,
            inputOwnerPhone: null,
            inputSpecies: null,
            inputAge: null,
            inputGender: null,
            inputDescription: null,
            gender: [
                { text: "Đực"},
                { text: "Cái"}
            ]
        }

    },
    methods: {
        submit: function() {
            this.$data.inputGender = this.$data.inputGender.text; 
            db.collection('pet').add({
                name: this.$data.inputName,
                owner_phone: this.$data.inputOwnerPhone,
                species: this.$data.inputSpecies,
                age: this.$data.inputAge,
                gender: this.$data.inputGender,
                description: this.$data.inputDescription
            })
        }
    }
}
</script>

<style scoped>
#inputBox {
    align-self: auto
}
</style>

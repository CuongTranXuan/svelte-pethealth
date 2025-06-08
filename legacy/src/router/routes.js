import login from '../components/login.vue'
import NewCustomer from '../components/New Customer.vue'
import CustomerProfile from '../components/Customer Profile.vue'
import NewPet from '../components/New Pet.vue'
import NewBill from '../components/New Bill.vue'
import Homepage from '../components/Homepage.vue'
import BillList from '../components/Bill List.vue'
import Statistic from '../components/Statistic.vue'
export const routes = [
    {
        path: '/home',
        name: "home",
        component: Homepage,
        meta: {
            title: 'Homepage',
            requireAuth: true
        }
    },
    {
        path: '/login',
        name: 'login',
        component: login,
        meta: {
            title: 'Login'
        }
    },
    {
        path: '/newcustomer',
        name: 'newcustomer',
        component: NewCustomer,
        meta: {
            requireAuth: true,
            title: 'New Customer'
        }
    },
    {
        path: '/statistic',
        name: 'statistic',
        component: Statistic,
        meta: {
            requireAuth: false,
            title: 'Statistic'
        }
    },
    {
        path: '/customerprofile/:id',
        name: 'customerprofile',
        component: CustomerProfile,
        meta: {
            requireAuth: true,
            title: 'Customer'
        }
    },
    {
        path: '/billlist/:id',
        name: 'billlist',
        component: BillList,
        meta: {
            requireAuth: true,
            title: 'Bill List'
        }
    },
    {
        path: '/newpet',
        name: 'newpet',
        component: NewPet,
        meta: {
            requireAuth: true,
            title: 'New Pet'
        }
    },
    {
        path: '*',
        redirect: '/login',
        meta: {
            title: 'Redirecting...',
            requireAuth: true
        }
    },
    {
        path: '/newbill',
        name: 'newbill',
        component: NewBill,
        meta: {
            requireAuth: true,
            title: 'New Bill'
        }
    }
]
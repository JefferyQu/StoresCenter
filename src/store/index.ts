import {createStore} from 'vuex'

import user from '../store/user'
import app from "./app";
export default createStore({
    modules: {
        user,
        app
    },
})

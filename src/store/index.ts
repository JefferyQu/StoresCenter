import {createStore} from 'vuex'

import user from '../store/user'
import app from "./app";
export default createStore({
    state:{
        msg:888800
    },
    modules: {
        user,
        app
    },
})

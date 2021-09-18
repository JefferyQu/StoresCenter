import {createApp} from 'vue'
import App from './App.vue'
import router from "./router/index";
import store from "./store/index"
import Vant from 'vant';
import 'vant/lib/index.css';
import './index.css'


const app = createApp(App)

app.use(Vant)
app.use(router)
app.use(store)
app.mount('#app')

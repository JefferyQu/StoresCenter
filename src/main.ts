import {createApp} from 'vue'
import App from './App.vue'
import router from "./router/index";
import store from "./store/index"
import Vant from 'vant';
import 'vant/lib/index.css';
import './index.css'

import ChooseMenu from './components/ChooseMenu.vue'
import GoodsChoose from './components/GoodsChoose.vue'
import CustomList from './components/CustomList.vue'
import CustomPanel from './components/CustomPanel.vue'
import CustomTable from './components/CustomTable.vue'
import CustomTag from './components/CustomTag.vue'

const app = createApp(App)

app.use(Vant)
app.use(router)
app.use(store)

app.component('ChooseMenu',ChooseMenu)
app.component('GoodsChoose',GoodsChoose)
app.component('CustomList',CustomList)
app.component('CustomPanel',CustomPanel)
app.component('CustomTable',CustomTable)
app.component('CustomTag',CustomTag)

// app.component()
app.mount('#app')


import {ref} from 'vue'
let baseURL=ref('')

function changeBaseUrl(url:string){
    baseURL.value='http://'+url
}

export default {baseURL,changeBaseUrl}

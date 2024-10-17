import { get } from "./api"
import { onMounted } from "vue";

const me = ref(null);

export const reloadAuth = async () => {
    const response = await get('https://www.data.gouv.fr/api/1/me')
    me.value = response.data
}

export const useMe = () => {
    onMounted(async () => {
        reloadAuth()
    })

    return me
}

import type { User } from "@datagouv/components";
import { get } from "./api"
import { onMounted } from "vue";

const me = ref<User | null>(null);

export const reloadAuth = async () => {
    const response = await get('http://dev.local:7000/api/1/me')
    me.value = response.data
}

export const useMe = (): Ref<User | null> => {
    onMounted(async () => {
        reloadAuth()
    })

    return me
}

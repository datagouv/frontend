import axios from "axios";

axios.defaults.withCredentials = true

export function get(url: string) {
    return axios.get(url)
}
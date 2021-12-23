const BASE_API_URL = process.env.SELLER_API
import axios from 'axios'
export const getShopInfo = async (data) => {
    const storage = JSON.parse(sessionStorage.getItem('_data'))
    axios.defaults.headers.common['Authorization'] = `Bearer ${storage.api_token}`
    try {
        const res = await axios.get(`${BASE_API_URL}/shop`, data)
        return await res.data
    } catch (err) {
        console.log(`err`, err)
        return err
    }
}
export const updateShopInfo = async (data) => {
    const storage = JSON.parse(sessionStorage.getItem('_data'))
    axios.defaults.headers.common['Authorization'] = `Bearer ${storage.api_token}`
    try {
        const res = await axios.put(`${BASE_API_URL}/shop/${data.id}`, data)
        return await res.data
    } catch (err) {
        console.log(`err`, err)
        return err
    }
}
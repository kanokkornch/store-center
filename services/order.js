const BASE_API_URL = process.env.SELLER_API
import axios from 'axios'
export const getOrders = async () => {
    const storage = JSON.parse(sessionStorage.getItem('_data'))
    axios.defaults.headers.common['Authorization'] = `Bearer ${storage.api_token}`
    try {
        const res = await axios.get(`${BASE_API_URL}/order`)
        return await res.data
    } catch (err) {
        console.log(`err`, err)
        return err
    }
}
export const getOrderDetail = async (id) => {
    const storage = JSON.parse(sessionStorage.getItem('_data'))
    axios.defaults.headers.common['Authorization'] = `Bearer ${storage.api_token}`
    try {
        const res = await axios.get(`${BASE_API_URL}/order/${id}`)
        return await res.data
    } catch (err) {
        console.log(`err`, err)
        return err
    }
}
export const getSelectedOrders = async (list_id) => {
    const storage = JSON.parse(sessionStorage.getItem('_data'))
    axios.defaults.headers.common['Authorization'] = `Bearer ${storage.api_token}`
    try {
        const res = await axios.post(`${BASE_API_URL}/order/list`, { order_list: list_id })
        return await res.data
    } catch (err) {
        console.log(`err`, err)
        return err
    }
}
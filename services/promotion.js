const BASE_API_URL = process.env.SELLER_API
import axios from 'axios'

export const saveVoucher = async (data) => {
    const storage = JSON.parse(sessionStorage.getItem('_data'))
    axios.defaults.headers.common['Authorization'] = `Bearer ${storage.api_token}`
    try {
        const res = await axios.post(`${BASE_API_URL}/coupon`, data)
        return await res.data
    } catch (err) {
        console.log(`err`, err)
        return err
    }
}
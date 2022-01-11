const BASE_API_URL = process.env.SELLER_API
import axios from 'axios'

export const shopVerification = async (data) => {
    const storage = JSON.parse(sessionStorage.getItem('_data'))
    axios.defaults.headers.common['Authorization'] = `Bearer ${storage.api_token}`
    try {
        const res = await axios.post(`${BASE_API_URL}/shop/verification`, data)
        return await res.data
    } catch (err) {
        console.log(`err`, err)
        return err
    }
}
export const shopVerificationInfo = async () => {
    const storage = JSON.parse(sessionStorage.getItem('_data'))
    axios.defaults.headers.common['Authorization'] = `Bearer ${storage.api_token}`
    try {
        const res = await axios.get(`${BASE_API_URL}/shop/verification`)
        return await res.data
    } catch (err) {
        console.log(`err`, err)
        return err
    }
}
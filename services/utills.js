const BASE_API_URL = process.env.SELLER_API
import axios from 'axios'
// ---------------------- Utills -------------------- //
export const uploadImage = async (data) => {
    const storage = JSON.parse(sessionStorage.getItem('_data'))
    axios.defaults.headers.common['Authorization'] = `Bearer ${storage.api_token}`
    try {
        const res = await axios.post(`${BASE_API_URL}/media/upload`, data)
        return await res.data
    } catch (err) {
        console.log(`err`, err)
        return err
    }
}

export const getAllBanks = async () => {
    const storage = JSON.parse(sessionStorage.getItem('_data'))
    axios.defaults.headers.common['Authorization'] = `Bearer ${storage.api_token}`
    try {
        const res = await axios.get(`${BASE_API_URL}/bank`)
        return await res.data
    } catch (err) {
        console.log(`err`, err)
        return err
    }
}
// ---------------------- End Utills -------------------- //
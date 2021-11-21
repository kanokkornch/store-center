const BASE_API_URL = process.env.SELLER_API
import axios from 'axios'

// ---------------------- Authorization -------------------- //
export const APIshopRegister = async (data) => {
    try {
        const res = await axios.post(`${BASE_API_URL}/register`, data)
        return await res.data
    } catch (err) {
        console.log(`err`, err)
        return err
    }
}
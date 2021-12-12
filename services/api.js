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
export const APIshopLogin = async (data) => {
    sessionStorage.clear()
    try {
        const res = await axios.post(`${BASE_API_URL}/login`, data)
        if (res.data.success) {
            // sessionStorage.setItem('_data', JSON.stringify(res.data.data))
            sessionStorage.setItem('_data', JSON.stringify(res.data.data))
            window.location.assign('/dashbord')
        }
    } catch (err) {
        const res = {
            status: false,
            message: 'username หรือ password ไม่ถูกต้อง',
        }
        return res
    }
}
export const APIshopLogout = async () => {
    // sessionStorage.clear()
    sessionStorage.clear()
    window.location.assign('/login')
}
export const isUserLogin = () => {
    // sessionStorage.getItem("_data")
    const getLocalState = sessionStorage.getItem('_data')
    if (getLocalState !== null) {
        return true
    } else {
        return false
    }
}
// ---------------------- End Authorization -------------------- //
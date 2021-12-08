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
    localStorage.clear()
    try {
        const res = await axios.post(`${BASE_API_URL}/login`, data)
        if (res.data.success) {
            localStorage.setItem('_data', JSON.stringify(res.data.data))
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
export const isUserLogin = () => {
    const getLocalState = localStorage.getItem("_data")
    if (getLocalState !== null) {
        return true
    } else {
        return false
    }
}
// ---------------------- End Authorization -------------------- //
// ---------------------- Utills -------------------- //
export const uploadImage = async (data) => {
    const storage = JSON.parse(localStorage.getItem('_data'))
    axios.defaults.headers.common['Authorization'] = `Bearer ${storage.api_token}`
    try {
        const res = await axios.post(`${BASE_API_URL}/media/upload`, data)
        return await res.data
    } catch (err) {
        console.log(`err`, err)
        return err
    }
}
// ---------------------- End Utills -------------------- //

// ---------------------- Products -------------------- //
export const geProductCategoriesWithSubCategories = async () => {
    const storage = JSON.parse(localStorage.getItem('_data'))
    axios.defaults.headers.common['Authorization'] = `Bearer ${storage.api_token}`
    try {
        const res = await axios.get(`${BASE_API_URL}/categories`)
        return await res.data
    } catch (err) {
        console.log(`err`, err)
        return err
    }
}
export const getProductUnits = async () => {
    const storage = JSON.parse(localStorage.getItem('_data'))
    axios.defaults.headers.common['Authorization'] = `Bearer ${storage.api_token}`
    try {
        const res = await axios.get(`${BASE_API_URL}/product/units`)
        return await res.data
    } catch (err) {
        console.log(`err`, err)
        return err
    }
}
export const saveProduct = async (data) => {
    const storage = JSON.parse(localStorage.getItem('_data'))
    axios.defaults.headers.common['Authorization'] = `Bearer ${storage.api_token}`
    try {
        const res = await axios.post(`${BASE_API_URL}/products`, data)
        return await res.data
    } catch (err) {
        console.log(`err`, err)
        return err
    }
}
export const getProducts = async () => {
    const storage = JSON.parse(localStorage.getItem('_data'))
    axios.defaults.headers.common['Authorization'] = `Bearer ${storage.api_token}`
    try {
        const res = await axios.get(`${BASE_API_URL}/products`)
        return await res.data
    } catch (err) {
        console.log(`err`, err)
        return err
    }
}
// ---------------------- End Products -------------------- //
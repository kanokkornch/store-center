const BASE_API_URL = process.env.SELLER_API
import axios from 'axios'
// ---------------------- Products -------------------- //
export const geProductCategoriesWithSubCategories = async () => {
    const storage = JSON.parse(sessionStorage.getItem('_data'))
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
    const storage = JSON.parse(sessionStorage.getItem('_data'))
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
    const storage = JSON.parse(sessionStorage.getItem('_data'))
    axios.defaults.headers.common['Authorization'] = `Bearer ${storage.api_token}`
    try {
        const res = await axios.post(`${BASE_API_URL}/products`, data)
        return await res.data
    } catch (err) {
        console.log(`err`, err)
        return err
    }
}
export const updateProduct = async (data) => {
    const storage = JSON.parse(sessionStorage.getItem('_data'))
    axios.defaults.headers.common['Authorization'] = `Bearer ${storage.api_token}`
    try {
        const res = await axios.put(`${BASE_API_URL}/products/${data.id}`, data)
        return await res.data
    } catch (err) {
        console.log(`err`, err)
        return err
    }
}
export const getProducts = async () => {
    const storage = JSON.parse(sessionStorage.getItem('_data'))
    axios.defaults.headers.common['Authorization'] = `Bearer ${storage.api_token}`
    try {
        const res = await axios.get(`${BASE_API_URL}/products`)
        return await res.data
    } catch (err) {
        console.log(`err`, err)
        return err
    }
}
export const getProductsById = async (id) => {
    const storage = JSON.parse(sessionStorage.getItem('_data'))
    axios.defaults.headers.common['Authorization'] = `Bearer ${storage.api_token}`
    try {
        const res = await axios.get(`${BASE_API_URL}/products/${id}`)
        return await res.data
    } catch (err) {
        console.log(`err`, err)
        return err
    }
}
export const deleteProduct = async (id) => {
    const storage = JSON.parse(sessionStorage.getItem('_data'))
    axios.defaults.headers.common['Authorization'] = `Bearer ${storage.api_token}`
    try {
        const res = await axios.delete(`${BASE_API_URL}/products/${id}`)
        return await res.data
    } catch (err) {
        console.log(`err`, err)
        return err
    }
}
// ---------------------- End Products -------------------- //
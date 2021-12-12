import { geProductCategoriesWithSubCategories, getProductUnits } from '../../services/product'

export const geProductCategories = () => async (dispatch, getState) => {
    geProductCategoriesWithSubCategories().then(res => {
        if (res.success) {
            dispatch({
                type: 'GET_CATEGORIES',
                payload: res.data
            })
        }
    }).catch(err => {
        console.error(err)
    })

}
export const getUnits = () => async (dispatch, getState) => {
    getProductUnits().then(res => {
        if (res.success) {
            dispatch({
                type: 'GET_PRODUCT_UNITS',
                payload: res.data
            })
        }
    }).catch(err => {
        console.error(err)
    })

}
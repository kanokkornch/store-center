const initialState = {
    categories: [],
    units: []
}
export const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_CATEGORIES':
            return {
                ...state,
                categories: action.payload
            }
        case 'GET_PRODUCT_UNITS':
            return {
                ...state,
                units: action.payload
            }
        default:
            return state
    }
}
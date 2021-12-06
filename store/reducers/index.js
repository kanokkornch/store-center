import { combineReducers } from 'redux'
import { postReducer } from './postReducer'
import { authReducer } from './authReducer'
import { productReducer } from './productReducer'

export default combineReducers({
    post: postReducer,
    auth: authReducer,
    product: productReducer
})
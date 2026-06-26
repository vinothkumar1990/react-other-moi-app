import {configureStore} from '@reduxjs/toolkit'
import cartSliceReducer from './cartSlice.js'

export const store = configureStore({
    reducer : {
        card : cartSliceReducer
    }
})
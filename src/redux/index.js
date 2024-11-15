import { configureStore } from '@reduxjs/toolkit'
// Or from '@reduxjs/toolkit/query/react'

import { apiSlice } from './backendAPI'
import UserReducer from './UserProfileSlice'

export const store = configureStore({
    reducer: {
        // Add the generated reducer as a specific top-level slice
        [apiSlice.reducerPath]: apiSlice.reducer,
        User: UserReducer
    },
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
})
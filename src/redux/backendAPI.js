import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Step 1: Define the API slice
export const apiSlice = createApi({
    reducerPath: 'api', // Optional custom name for the slice reducer
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/' }),
    tagTypes: ['Product', 'CART', 'ORDER', 'USER', 'CATEGORIES'],
    endpoints: (builder) => ({

        SignUp: builder.mutation({
            query: (body) => ({
                url: '/signup',
                method: 'POST',
                body: body
            }),
            invalidatesTags: ['USER'],
        }),
        SignIn: builder.mutation({
            query: (body) => ({
                url: '/signin',
                method: 'POST',
                body: body
            }),
            invalidatesTags: ['USER'],
        }),
        GetCategories: builder.query({
            query: () => ({
                url: '/getCategories/',
                method: 'GET',

            }),
            providesTags: ['CATEGORIES'],
        }),
        GetUserProfile: builder.query({
            query: (id) => ({
                url: '/profile/',
                method: 'GET',
                params: { id }
            }),
            providesTags: ['USER'],
        }),
        UpdateUserProfile: builder.mutation({
            query: (body) => ({
                url: '/profile/',
                method: 'POST',

                body: body
            }),
            invalidatesTags: ['USER'],

        }),


        // MY PRODUCTS API
        GetProducts: builder.query({
            query: ({ page = 1, keyword = '', text = '', order = "", id = null } = {}) => ({
                url: '/getallproducts/',
                method: 'GET',
                params: { page, keyword, text, order, id }
            }),

        }),

        getProductDetails: builder.query({
            query: (id) => ({
                url: '/getproductdetails/' + id,
                method: 'GET',

            }),
            providesTags: (result, error, arg) => [{ type: 'Product', id: arg.id }],

        }),

        // MY CART API
        getMyCart: builder.query({
            query: (id) => ({

                url: '/getmycart',
                params: { id: id },
                method: 'GET',

            }),
            providesTags: ['CART'],
        }),

        UpdateCart: builder.mutation({
            query: (body) => ({
                url: '/updatecart',
                method: 'POST',
                body: body
            }),
            invalidatesTags: ['CART'],
        }),


        // MY ORDER API
        getMyOrders: builder.query({
            query: (id) => ({
                url: '/getmyorders/',
                params: { id },
                method: 'GET',

            }),
            providesTags: ['ORDER'],
        }),

        CreateOrder: builder.mutation({
            query: (body) => ({
                url: '/createorder',
                method: 'POST',
                body: body
            }),
            invalidatesTags: ['ORDER', 'CART'],
        }),

        // MY PROFILE API

        getSimilarProducts: builder.query({
            query: (id, keyword) => ({
                url: '/similarproducts',
                params: { id }, // Pass the keyword as a query parameter
            }),
            providesTags: (result) =>
                result ? [{ type: 'Product', id }] : ['SimilarProducts'],
        }),




    }),
});

// Step 3: Export the auto-generated hooks
export const {
    useGetPostsQuery,
    useGetPostByIdQuery,
    useSignUpMutation,
    useSignInMutation,
    useGetProductsQuery,
    useGetCategoriesQuery,
    useGetProductDetailsQuery,
    useUpdateUserProfileMutation,
    useGetMyCartQuery,
    useUpdateCartMutation,
    useCreateOrderMutation,
    useGetMyOrdersQuery
} = apiSlice;
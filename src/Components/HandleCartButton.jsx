import React, { useEffect, useState } from 'react'
import { useGetMyCartQuery, useUpdateCartMutation } from '../redux/backendAPI';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom';

function HandleCartButton({ ProductID }) {
    const navigate = useNavigate()
    const userdata = useSelector((state) => state.User.userProfile)
    const [UpdateCart, { isLoading: UpdatingCart }] = useUpdateCartMutation()


    const { data, isLoading, isError } = useGetMyCartQuery(userdata?._id, { skip: !userdata })

    const [isPresent, setIsPresent] = useState(false)

    useEffect(() => {

        // check if product is in 
        if (data) {

            const find = data.products.find((product) => product.product._id === ProductID)
            if (find) {
                setIsPresent(true)
            }
            else {
                setIsPresent(false)
            }
        } else {
            setIsPresent(false)
        }

    }, [data])

    async function HandleAddtoCart() {
        if (!userdata) {
            navigate('/signin')
        }
        else {

            await UpdateCart({ UserID: userdata._id, productID: ProductID, productQuantity: 1 })
        }
    }

    async function RemoveFromCart() {
        if (!userdata) {
            navigate('/signin')
        }
        else {

            await UpdateCart({ UserID: userdata._id, productID: ProductID, productQuantity: 0 })
        }
    }
    if (!data) {
        <Button variant="contained"
            disabled={UpdatingCart}
            onClick={RemoveFromCart}
            sx={{
                backgroundColor: 'white',
                color: 'red',
                border: '2px solid black'
            }}>
        </Button>
    }

    if (isPresent)
        return (
            <Button variant="contained"
                disabled={UpdatingCart}
                onClick={RemoveFromCart}
                sx={{
                    backgroundColor: 'white',
                    color: 'red',
                    border: '2px solid black'
                }}>
                Remove Item</Button>

        )

    if (!isPresent)
        return (
            <Button
                variant="contained"
                sx={{ backgroundColor: 'black' }}
                disabled={UpdatingCart}
                onClick={HandleAddtoCart}
            >
                Add to Cart </Button>

        )

}

export default HandleCartButton
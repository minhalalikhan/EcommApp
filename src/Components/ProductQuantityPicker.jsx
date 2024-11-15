
import React, { useEffect, useState } from 'react'
import { AiFillPlusSquare, AiFillMinusSquare } from "react-icons/ai";
import { useSelector } from 'react-redux';
import { useGetMyCartQuery, useUpdateCartMutation } from '../redux/backendAPI';
import { useNavigate } from 'react-router-dom';

function ProductQuantityPicker({ state, increment, decrement, ProductID }) {

    const navigate = useNavigate()
    const userdata = useSelector((state) => state.User.userProfile)

    const [UpdateCart, { isLoading: UpdatingCart }] = useUpdateCartMutation()


    const { data, isLoading, isError } = useGetMyCartQuery(userdata?._id, { skip: !userdata })

    const [Quantity, SetQuantity] = useState(1)
    const [InCart, SetInCart] = useState(false)

    useEffect(() => {

        // check if product is in 
        if (data) {

            const find = data.products.find((product) => product.product._id === ProductID)
            if (find) {
                SetInCart(true)
                SetQuantity(find.quantity)
            }
            else {
                SetInCart(false)
                SetQuantity(1)
            }
        } else {
            SetInCart(false)
            SetQuantity(1)
        }

    }, [data])




    async function AddQuantity() {
        if (UpdatingCart) {
            console.log('updating')
            return
        }
        if (InCart) {
            await UpdateCart({ UserID: userdata._id, productID: ProductID, productQuantity: Quantity + 1 })
        }
        SetQuantity(Quantity + 1)

    }

    async function SubtractQuantity() {
        if (UpdatingCart)
            return
        if (Quantity === 1)
            return

        if (InCart) {
            const check = await UpdateCart({ UserID: userdata._id, productID: ProductID, productQuantity: Quantity - 1 }).unwrap()
            console.log('checkk', check)
            SetQuantity(Quantity - 1)
        }
        else {

            SetQuantity(Quantity - 1)
        }


    }

    return (
        <div style={{
            display: 'flex', gap: '20px',
            padding: '10px',
            flexWrap: 'nowrap', width: '200px', alignItems: 'center'
        }}>
            <AiFillMinusSquare

                onClick={SubtractQuantity} style={{ fontSize: '40px', cursor: 'pointer' }} />
            <span style={{ fontSize: '30px' }}  >{Quantity}</span>
            <AiFillPlusSquare onClick={AddQuantity} style={{ fontSize: '40px', cursor: 'pointer' }} />
        </div>
    )
}

export default ProductQuantityPicker
import React, { useEffect, useState } from 'react'
import './Cart.css'
import { Button } from '@mui/material'
import { DummyProducts } from '../dummyData/ProductsDummy'
import CartItemCard from '../Components/CartItemCard'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { useCreateOrderMutation, useGetMyCartQuery } from '../redux/backendAPI'

function Cart() {

    const navigate = useNavigate()
    const userdata = useSelector((state) => state.User.userProfile)
    useEffect(() => {

        if (!userdata) {

            navigate('/signin')
        }
    }, [userdata])

    const { data, isLoading, isError } = useGetMyCartQuery(userdata?._id, { skip: !userdata })
    const [createOrder, { isLoading: CreatingOrder, isError: CreateOrderError, }] = useCreateOrderMutation()

    async function CreateOrder() {
        if (CreatingOrder) {
            return
        }
        try {

            await createOrder({ id: data.userId })
        } catch (e) {
            console.log('error happened while creating oorder', e)
        }
    }

    return (
        <div className='cartcontainer'>
            <h1>Cart</h1>
            {/* cart Items */}
            <div className="cartitems">
                {data && data?.products.map((item, i) => {
                    console.log(item)
                    return (
                        <CartItemCard key={i} {...item.product} quantity={item.quantity} subtotal={item.itemSubtotal} />
                    )
                })}
            </div>
            {data && data?.products.length > 0 &&
                <div style={{
                    width: '80%', margin: '0 auto',
                    padding: '20px', display: 'flex',
                    minHeight: '250px', justifyContent: 'end'
                }}>
                    <div style={{ display: 'flex', textAlign: 'end', flexDirection: 'column', gap: '20px' }}>
                        <p style={{ fontSize: '20px' }}>SubTotal : ${data.subtotal},</p>
                        <p style={{ fontSize: '20px' }}>Net Charges : +${data.charges} </p>
                        <p style={{ fontWeight: '700', fontSize: '25px' }}>Total : ${data.subtotal + data.charges}</p>
                    </div>

                </div>}
            {data && data?.products.length === 0 &&
                <h3 style={{ margin: "20px 0", color: 'gray', fontSize: '24px' }}>Nothing in the cart right now</h3>
            }

            <div className="checkoutCTA">
                <Button variant='outlined'
                    onClick={() => navigate('/')}
                    sx={{
                        color: 'black',
                        fontWeight: 'bold',
                        minWidth: '200px', border: '2px solid black',
                        '& .MuiTouchRipple-child': {
                            backgroundColor: 'black', // Black ripple color
                        },
                    }}>
                    Continue Shopping
                </Button>
                {data && data?.products.length > 0 &&
                    <Button
                        variant='contained'
                        sx={{ backgroundColor: 'black', minWidth: '200px' }}
                        onClick={CreateOrder}
                    >

                        Place Order
                    </Button>}
            </div>
        </div>
    )
}

export default Cart
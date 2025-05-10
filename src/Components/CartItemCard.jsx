import React from 'react'
import ProductQuantityPicker from './ProductQuantityPicker'

import { Button, Rating } from '@mui/material'
import { ProductToken } from '../Components/ProductCard'
import HandleCartButton from './HandleCartButton'

import StarIcon from '@mui/icons-material/Star';

function CartItemCard({
    name, image, short_desc,
    rating, id, keyword, _id, subtotal,
    long_desc, seller, price, quantity,
    limited_stock = false, new_arrival = false, best_seller = false }) {
    return (
        <div className='CartItem'>
            <div className='CartImageCard'>
                <img src={'/' + image + '.jpg'} />
            </div>
            <div className="cartIteminfo">
                <p style={{ fontWeight: '800', fontSize: '20px' }}>{name}</p>
                <p>{seller}</p>
                <div>
                    <Rating precision={0.5} readOnly value={rating}
                        className='custom-rating'
                        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                    />
                </div>
                <ProductToken limitedStock={limited_stock} BestSeller={best_seller} NewArrival={new_arrival} />
                <p style={{ fontSize: '16px' }}> {short_desc}</p>
            </div>
            <div className="cartItemQuantity">
                <HandleCartButton ProductID={_id} />

                <ProductQuantityPicker ProductID={_id} />
                <p>Rate : ${price}</p>
                <p>SubTotal : ${price} x {quantity} = <span>${subtotal}</span></p>
            </div>
        </div>
    )
}

export default CartItemCard
import React from 'react'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Rating } from '@mui/material'
import HandleCartButton from './HandleCartButton'
// import './Components.css'

function ProductCard({
    name, image, short_desc,
    rating, id, keyword,
    long_desc, seller, price,
    _id,
    limited_stock = false, new_arrival = false, best_seller = false }) {

    const navigate = useNavigate()

    return (
        <div className='ProductCard'>
            <div className='imagecard'>
                <img src={'/images/' + keyword + '/' + id + '.jpg'} />
            </div>
            <div className='info' style={{ flex: 1 }}>
                <p style={{ fontWeight: '800', fontSize: '20px' }}>{name}</p>
                <p>{seller}</p>
                <Rating
                    name="simple-controlled"
                    value={rating}
                    readOnly
                    precision={0.5}
                />
                <p>{price}</p>
                <ProductToken limitedStock={limited_stock} BestSeller={best_seller} NewArrival={new_arrival} />
            </div>
            <div style={{ display: 'flex', gap: '5px', flexDirection: 'column', paddingBottom: '10px' }}>

                <Button
                    variant="contained"
                    sx={{ backgroundColor: 'white', color: 'black', border: '2px solid black' }}
                    onClick={() => navigate('/product/' + id)}
                >
                    View Detials
                </Button>
                {/* <Button
                    variant="contained"
                    sx={{ backgroundColor: 'black' }}
                >
                    Add to Cart</Button> */}
                <HandleCartButton ProductID={_id} />
            </div>
        </div>
    )
}


export default ProductCard



export function ProductToken({ limitedStock, NewArrival, BestSeller }) {
    if (limitedStock)
        return <p
            className='producttoken'
            style={{ backgroundColor: 'red' }}>
            Limited Stock</p>
    else if (BestSeller)
        return <p
            className='producttoken'
            style={{ backgroundColor: 'orange' }}>   Best Seller </p>
    else if (NewArrival)
        return <p
            className='producttoken'
            style={{ backgroundColor: 'navy' }}>   New Arrival </p>

    return <></>
}
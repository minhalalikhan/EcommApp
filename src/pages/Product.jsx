import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './Product.css'
import { Button, Rating, Skeleton } from '@mui/material'
import ProductQuantityPicker from '../Components/ProductQuantityPicker'
import ProductCard, { ProductToken } from '../Components/ProductCard'
import { DummyProducts } from '../dummyData/ProductsDummy'
import { useGetProductDetailsQuery, useGetProductsQuery } from '../redux/backendAPI'
import HandleCartButton from '../Components/HandleCartButton'
import StarIcon from '@mui/icons-material/Star';
function Product() {
    const navigate = useNavigate()

    const { productid } = useParams()

    if (!productid || isNaN(productid)) {
        navigate('/')
    }
    const { data, isLoading, isError, isSuccess } = useGetProductDetailsQuery(productid)
    const { data: similardata, isLoading: isSimilarLoading } = useGetProductsQuery({ id: productid, keyword: data?.keyword }, { skip: !data })
    console.log(data, isLoading, isError, isSuccess)
    if (isLoading) {
        return <div style={{ display: 'flex', gap: '50px', width: '100%', alignItems: 'center' }}>
            <Skeleton sx={{ width: '35%', height: '80vh' }} />
            <div>
                <Skeleton sx={{ width: '400px', height: '50px' }} />
                <Skeleton sx={{ width: '400px', height: '50px' }} />
                <Skeleton sx={{ width: '400px', height: '50px' }} />
                <Skeleton sx={{ width: '400px', height: '50px' }} />
                <Skeleton sx={{ width: '400px', height: '50px' }} />
            </div>
        </div>
    }
    if (isSuccess && data) {
        console.log('request successful ', data)
    }

    if (isSuccess && data)
        return (
            <div className='ProductContainer'>
                <div className="wrapper">

                    {/* product Details  */}

                    <div className='productdetails'>
                        <div className="imagecard">

                            {/* <img src={"/images/" + data.keyword + "/" + data.id + ".jpg"} alt="" /> */}
                            <img src={'/' + data.image + '.jpg'} />
                        </div>
                        <div className="productinfo">
                            <h3 style={{ fontSize: '40px' }}> {data.name}</h3>
                            <h5 style={{ fontSize: '14px', color: 'gray', fontStyle: 'italic' }}>{data.seller}</h5>
                            <div>
                                <Rating precision={0.5} readOnly value={data.rating}
                                    className='custom-rating'
                                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                />
                            </div>
                            <ProductToken limitedStock={data?.limited_stock} BestSeller={data?.best_seller} NewArrival={data?.new_arrival} />
                            <p style={{ fontSize: '16px' }}> {data.short_desc}</p>
                            <p style={{ fontSize: '16px' }}>
                                {data.long_desc}
                            </p>
                            <div className='CTA'>

                                <HandleCartButton ProductID={data._id} />
                                <ProductQuantityPicker ProductID={data._id} />
                            </div>
                        </div>
                    </div>
                    {/* Similar Products */}
                    {similardata &&
                        <>
                            <h3 style={{ padding: '20px 10px' }}>Similar Products</h3>
                            <div className="similarproducts">

                                {
                                    similardata.result.slice(0, 8).map((item, i) => {

                                        return (
                                            <ProductCard key={item.id} {...item} />
                                        )
                                    })
                                }
                            </div>
                        </>
                    }
                </div>

            </div>
        )

    if (isError) {
        return (
            <div>
                OOPS... COULDN'T RETRIVE DATA FROM BACKEND
            </div>
        )
    }
}

export default Product
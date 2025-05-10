import React, { useEffect, useRef, useState } from 'react'
import './Home.css'
import './Page.css'
import Pagination from '@mui/material/Pagination';
import ProductCard from '../Components/ProductCard'

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { TextField } from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';


import { DummyProducts } from '../dummyData/ProductsDummy'
import { useSelector } from 'react-redux';

import { useGetCategoriesQuery, useGetProductsQuery } from '../redux/backendAPI';


function Home() {
    const userdata = useSelector((state) => state.User.userProfile)

    const [FilterParams, setFilterParams] = useState({ page: 1, keyword: '', text: '', order: '', id: null })
    const { data, isLoading, isError } = useGetProductsQuery(FilterParams)

    function updateCategory(category) {
        setFilterParams({ ...FilterParams, keyword: category })
    }
    function updateTextSearch(text) {
        setFilterParams({ ...FilterParams, text: text })
    }
    function updateID(id) {
        setFilterParams({ ...FilterParams, id: id })
    }
    function updateOrder(order) {
        setFilterParams({ ...FilterParams, order: order })
    }

    useEffect(() => {
        console.log(userdata)
    }, [userdata])

    useEffect(() => {
        console.log(data)
    }, [data])

    return (
        <div className='HomeContainer'>
            <SideBar active={FilterParams.keyword} updateCategory={updateCategory} />
            <ProductsTable
                updateTextSearch={updateTextSearch}
                products={data}
                updateOrder={updateOrder}
            />
        </div>
    )
}

export default Home


function SideBar({ updateCategory, active }) {

    const { isLoading, isError, data, isSuccess } = useGetCategoriesQuery()


    return (
        <div className='Sidebar'>
            <p
                className='sidebar-header'

            >
                Categories
            </p>
            <p className={`item ${active === '' ? 'active' : ''}`}
                onClick={() => updateCategory('')}

            // style={{ backgroundColor: active === '' ? 'lightgray' : '' }}
            >
                All Products
            </p>
            {
                isSuccess && data && data?.result.map((category, i) => {
                    return (
                        <p className={`item ${active === category ? 'active' : ''}`}
                            onClick={() => updateCategory(category)}
                            key={i}
                        // style={{ backgroundColor: active === category ? 'lightgray' : '' }}
                        >
                            {category}
                        </p>
                    )
                })
            }

        </div>
    )
}

function ProductsTable({ updateTextSearch, products, updateOrder }) {


    const [order, setorder] = React.useState('');
    const divref = useRef(null)
    const [searchText, setSearchText] = useState('')
    const [Page, ChangePage] = useState(1)


    useEffect(() => {
        if (Page && divref.current !== null) {
            // console.log("scrollto top now", divref.current.scrollTop)
            divref.current.scrollTo({ top: 0 })
        }
    }, [Page])

    useEffect(() => {
        updateTextSearch(searchText)
    }, [searchText])

    useEffect(() => {

        if (products && products?.result.length > 0) {
            console.log('products updated', Page, " count  :", Math.ceil(products.result.length / 8))

            if (Page > Math.ceil(products.result.length / 8)) {
                ChangePage(Math.ceil(products.result.length / 8))
            }

        }
    }, [products])

    const handleChange = (event) => {
        setorder(event.target.value);
        updateOrder(event.target.value)
    };
    return (
        <div className='ProductsTable'
            ref={divref}
        >

            <div className='tablewrapper'

            >

                {/* Filter section */}

                <div className='filterrow'>

                    <FormControl sx={{ minWidth: 'min(80% , 500px)' }} >
                        <OutlinedInput
                            // size='small'
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            id="outlined-adornment-password"
                            type={'text'}
                            placeholder='Enter Search Text'
                            endAdornment={
                                <InputAdornment position="end" >
                                    <SearchIcon
                                        sx={{ cursor: 'pointer' }}
                                        onClick={() => updateTextSearch(searchText)} />
                                </InputAdornment>
                            }

                        />

                    </FormControl>
                    <FormControl sx={{ minWidth: 200 }}
                    // size='small'
                    >
                        <InputLabel id="demo-simple-select-helper-label">Order By</InputLabel>
                        <Select
                            sx={{ maxHeight: '100%' }}
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            value={order}
                            label="OrderBy"
                            onChange={handleChange}
                        >
                            <MenuItem value={{}}>
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={"rating+"}>Rating (High to Low)</MenuItem>
                            <MenuItem value={"rating-"}>Rating (Low to High)</MenuItem>
                            <MenuItem value={'price+'}>Price (High to Low)</MenuItem>
                            <MenuItem value={"price-"}>Price (Low to High)</MenuItem>

                        </Select>

                    </FormControl>
                </div>
                {/* results */}



                <div className='productsResult'>

                    {

                        products?.result && products.result.slice(((Page - 1) * 8), Page * 8).map((item, i) => {

                            return (
                                <ProductCard key={item.id} {...item} />
                            )
                        })
                    }{

                        products?.result.length === 0 &&
                        <h3 style={{ color: 'gray', padding: '20px' }}>
                            No Prdoucts Found
                        </h3>
                    }

                </div>
                {/* Pagination */}
                <div className='pagination'>
                    {products?.result && <Pagination
                        page={Page}
                        onChange={(e, v) => ChangePage(v)}
                        count={Math.ceil(products.result.length / 8)}
                        size='large' />}
                </div>

                {/* dummy */}

            </div>
        </div>
    )
}
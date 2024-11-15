import React, { useState, useEffect } from 'react'
import './Profile.css'
import {
    Button, TextField, IconButton,
    InputLabel, OutlinedInput,
    FormControl, Rating
} from '@mui/material'


import { ProductToken } from '../Components/ProductCard'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'

import { ToastContainer, toast } from 'react-toastify';

import InputAdornment from '@mui/material/InputAdornment';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { MdVisibilityOff } from "react-icons/md";
import { MdVisibility } from "react-icons/md";
import { useGetMyOrdersQuery, useUpdateUserProfileMutation } from '../redux/backendAPI';
import { setUserProfile } from '../redux/UserProfileSlice';


function Profile() {
    const navigate = useNavigate()
    const userdata = useSelector((state) => state.User.userProfile)
    useEffect(() => {
        if (!userdata) {
            navigate('/signin')
        }
    }, [userdata])

    const [tab, setTab] = useState('OrderHistory')

    return (
        <div className='ProfileContainer'>
            <div className="tabs">
                <p className={tab === 'OrderHistory' ? 'active' : ''}
                    onClick={() => setTab('OrderHistory')}>
                    Order History
                </p>
                <p className={tab === 'Profile' ? 'active' : ''}
                    onClick={() => setTab('Profile')}>
                    Profile </p>
            </div>
            <div>
                {tab === 'OrderHistory' && <OrderHistory userId={userdata?._id} />}

                {tab === 'Profile' && <ProfileDetails />}
            </div>

        </div>
    )
}

export default Profile


function ProfileDetails() {

    const toastId = React.useRef(null);
    const dispatch = useDispatch()

    const userData = useSelector(state => state.User.userProfile)

    const [updateProfile, { data, isSuccess, isError, isLoading }] = useUpdateUserProfileMutation()
    const [Edit, EnableEdit] = useState(false)

    const [error, setError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };


    const [newCredentials, SetNewCredentials] = useState(
        {
            newpassword: '',
            confirmnewpassword: '',
            username: userData.username,
            email: userData.email
        })

    function HandleChange(e) {

        SetNewCredentials({ ...newCredentials, [e.target.name]: e.target.value })
    }

    function DiscardChanges() {
        EnableEdit(false)
        SetNewCredentials({
            newpassword: '',
            confirmnewpassword: '',
            username: userData.username,
            email: userData.email
        })
    }

    async function SaveChanges() {

        // perform validation 
        if (!newCredentials.username) {
            setError('UserName Cant be empty')
            return
        }

        if (newCredentials.newpassword.length > 0 && newCredentials.newpassword.length < 6) {
            setError('Password needs to be at least 6 characters long')
            return
        }

        if (newCredentials.newpassword !== newCredentials.confirmnewpassword) {
            setError('Confirm Password needs to match')
            return
        }

        setError('')

        EnableEdit(false)
        try {
            toastId.current = toast.loading('Updating Profile ', { autoClose: false })
            await updateProfile(newCredentials).unwrap()

            setTimeout(() => toast.dismiss(), 500)
            toast.success('Profile Updated Successfully')
        }
        catch (e) {
            setTimeout(() => toast.dismiss(), 500)

            toast.error('Couldn\'t update profile')
        }
        SetNewCredentials({
            newpassword: '', confirmnewpassword: '',
            email: userData.email,
            username: userData.username
        })
    }

    useEffect(() => {

        if (data) {
            SetNewCredentials({ ...newCredentials, username: data.username })
            dispatch(setUserProfile(data))
        }
    }, [data])

    return (
        <div className='ProfileDetails'>
            <ToastContainer

                position='top-center'
                closeOnClick

                pauseOnHover
                theme="dark"
            />
            <div className='ProfileCTA'>
                {!Edit && <Button
                    variant='contained'
                    onClick={() => EnableEdit(true)}>Edit</Button>}
                {Edit && <Button
                    variant='contained'
                    onClick={SaveChanges}>Save </Button>}
                {Edit && <Button
                    variant='contained'
                    onClick={DiscardChanges}>Discard</Button>}
            </div>
            <div className='ProfileField'>
                <p>Name</p>
                <TextField placeholder='Enter your Name'
                    size='small'
                    value={newCredentials.username}
                    name='username'
                    onChange={HandleChange}
                    sx={{ width: '250px', backgroundColor: Edit ? '' : '#ebebeb' }}
                    disabled={!Edit} />
            </div>
            {!Edit && <div className='ProfileField'>
                <p>Password</p>
                <FormControl>

                    <TextField sx={{ width: '250px', backgroundColor: Edit ? '' : '#ebebeb' }}
                        size='small'
                        type='password'
                        value={"*******"}
                        placeholder='' disabled={!Edit}

                    />
                </FormControl>

            </div>}
            {Edit && <>

                <div className='ProfileField'>
                    <p>New Password</p>
                    <FormControl sx={{ width: '250px' }} variant="outlined">
                        {/* <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel> */}
                        <OutlinedInput
                            id="outlined-adornment-password"
                            placeholder='Confirm Password'
                            type={showPassword ? 'text' : 'password'}
                            value={newCredentials.newpassword}
                            onChange={HandleChange}
                            name='newpassword'
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={
                                            showPassword ? 'hide the password' : 'display the password'
                                        }
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        onMouseUp={handleMouseUpPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }

                        />
                    </FormControl>
                </div>

                <div className='ProfileField'>
                    <p>Confirm Password</p>
                    <FormControl sx={{ width: '250px' }} variant="outlined">
                        {/* <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel> */}
                        <OutlinedInput
                            id="outlined-adornment-password"
                            placeholder='Confirm Password'
                            type={showPassword ? 'text' : 'password'}
                            value={newCredentials.confirmnewpassword}
                            onChange={HandleChange}
                            name='confirmnewpassword'
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={
                                            showPassword ? 'hide the password' : 'display the password'
                                        }
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        onMouseUp={handleMouseUpPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }

                        />
                    </FormControl>
                </div>
                {error && <div style={{
                    backgroundColor: 'red', color: 'white',
                    width: 'fit-content',
                    padding: '10px',
                    margin: '10px',
                    borderRadius: '10px'
                }}>
                    {error}
                </div>}
            </>
            }
        </div>
    )
}

function OrderHistory({ userId }) {

    const { data, isLoading, } = useGetMyOrdersQuery(userId)

    if (data)
        console.log(data)

    function formatTime(time) {
        const date = new Date(time);

        const formattedDate = date.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long', // "short" for abbreviated, "2-digit" for numeric
            day: '2-digit',
        });

        return formattedDate;
    }

    return (
        <div className='OrderHistory'>

            {data &&
                data.map((order, i) => {
                    return (
                        <div className='Order' key={i}>
                            <div className="OrderDetails">
                                <p>
                                    <b>

                                        Order placed on :
                                    </b>

                                    {formatTime(order.createdAt)}
                                </p>
                                <p> <b>Total Quantity :</b> {order.orderSize} Items</p>
                                <p>
                                    <b> Total Amount :</b> ${order.totalPrice}
                                </p>
                            </div>
                            {
                                order.products.map((orderItem, i) => {
                                    return (
                                        <OrderItem key={i} orderItem={orderItem} />
                                    )
                                })
                            }
                        </div>

                    )
                })
            }
        </div>
    )
}

function OrderItem({ orderItem }) {
    return (
        <div className='OrderItem'>

            <div className='OrderImageCard'>
                <img src={'/images/' + orderItem.product.keyword + '/' + orderItem.product.id + '.jpg'} />
            </div>
            <div className="OrderIteminfo">
                <p style={{ fontWeight: '800', fontSize: '20px' }}>{orderItem.product.name}</p>
                <p>{orderItem.product.seller}</p>
                <div>
                    <Rating precision={0.5} readOnly value={orderItem.product.rating} />
                </div>
                <ProductToken limitedStock={orderItem.product?.limited_stock} BestSeller={orderItem.product?.best_seller} NewArrival={orderItem.product?.new_arrival} />
                <p style={{ fontSize: '16px' }}> {orderItem.product.short_desc}</p>
            </div>
            <div className="OrderItemQuantity">


                <p><b>Rate : </b>${orderItem.product.price}</p>
                <p><b>SubTotal : </b>${orderItem.product.price} x {orderItem.quantity} = <span>${orderItem.itemSubtotal}</span></p>

            </div>

        </div>
    )
}
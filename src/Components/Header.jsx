import React from 'react'
import { IoCart } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
import DarkModeSwitch from './DarkModeSwitch';



function Header() {

    return (
        <div className='Header'>

            <Link to={'/'}>

                <h1>EHUB</h1>
            </Link>
            <div className='header-tabs'>
                <DarkModeSwitch />
                <Link to={'/cart'}>

                    <IoCart className='header-icons' fontSize={'30px'} />
                </Link>
                <Link to='/profile'>

                    <FaUserCircle className='header-icons' fontSize={'30px'} />
                </Link>
            </div>
        </div>
    )
}

export default Header
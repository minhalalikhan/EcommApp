import { lazy, Suspense, useState } from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import './App.css'
import './Components/Components.css'
import Header from './Components/Header'
import Profile from './pages/Profile'
const Home = lazy(() => import('./pages/Home'))
const SignIn = lazy(() => import('./pages/SignIn'))
const SignUp = lazy(() => import('./pages/SignUp'))
const Cart = lazy(() => import('./pages/Cart'))
const Product = lazy(() => import('./pages/Product'))
const Orders = lazy(() => import('./pages/Orders'))
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function Layout({ children }) {

  return (
    <>
      <Header />
      <div className='PageContainer'>

        <Suspense fallback={<div></div>}>

          <Outlet />
        </Suspense>
      </div>
    </>
  )
}


function AuthLayout({ children }) {
  return (<div className='authlayout'>
    <Suspense fallback={<div></div>}>

      <Outlet />
    </Suspense>
  </div>)
}
function App() {


  return (

    <BrowserRouter>

      <Routes>

        <Route element={<Layout />}>

          <Route index element={<Home />} />
          <Route path='product/:productid' element={<Product />} />
          <Route path='profile' element={<Profile />} />
          <Route path='cart' element={<Cart />} />
          <Route path='orders' element={<Orders />} />
        </Route>
        <Route element={<AuthLayout />}>

          <Route path='signin' element={<SignIn />} />
          <Route path='signup' element={<SignUp />} />
        </Route>

      </Routes>
    </BrowserRouter>

  )
}

export default App

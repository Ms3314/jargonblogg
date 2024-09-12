import logo from '../imgs/logo.png'
import { Link , Outlet} from 'react-router-dom'
import { useState } from 'react'
import "../index.css"
const Navbar = () => {
    const [open , setOpen] = useState(false)
    function handleOpen(){
        console.log(open)
        setOpen(!open)
    }
    return (
        <>
        <nav className="navbar">
            <Link to="/" className='flex-none w-10 mb-[-20px]' >
            <img src={logo} alt="a logo" /> 
            <button className='hide bg-red'>cool</button>
            </Link>
            <div className={`${open ? "show" : "hide"} py-4 px-[5vh] absolute w-full md:show left-0 top-full mt-0.5 border-b border-grey md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto`} >
                <input
                    type="text"
                    placeholder='Search'
                    className='w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12'
                    />
                    <i className="fi fi-rr-search-heart absolute right-[10%] top-1/2 -translate-y-1/2 md:pointer-events-none  md:left-5 text-xl text-dark-grey "></i>
            </div>
            <div className='flex items-center gap-3 md:gap-6 ml-auto'>
                <button onClick={handleOpen} className='md:hidden bg-grey w-12 h-12 flex rounded-full items-center justify-center'>
                <i class="fi fi-br-search-heart text-dark-grey"></i>
                </button>

                <Link to="editor" className='hidden md:flex gap-2 link'>
                    <p>Write</p>
                    <i className="fi fi-sr-file-edit"></i>                
                </Link>

               <Link className='btn-dark py-2' to="/signin">
                    <p>Sign In </p>
                </Link>

                <Link className='btn-light py-2 hidden md:block' to="/signup">
                    <p>Sign Up</p>
                </Link>
            </div>
        </nav>
        <Outlet />
        </>
    )
}

export default Navbar;
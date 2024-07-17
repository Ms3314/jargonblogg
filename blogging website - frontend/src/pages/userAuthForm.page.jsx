import React from 'react'
import InputBox from '../components/input.component'
import googleimg from '../imgs/google.png'
import { Link } from 'react-router-dom'
import AnimationWraper from '../common/page-animation'

function UserAuthForm({type}) {
  return (
    <AnimationWraper key={type}>
    <section className='h-cover flex items-center justify-center'>
        <form className='w-[80%] max-w-[400px]' >
            <h1 className='text-4xl font-gelasio capitalize text-center mb-24 '>
                {type == "sign-in" ? "Welcome Back" : "Join Us Today"}
            </h1>
            {
                type != "sign-in" ?
                <InputBox
                    type="text"
                    name = "fullname"
                    placeholder="Full Name"
                    iconclass="fi-rr-user"
                />
                // will add a costum input box component over here 
                : ""
            }
            
            <InputBox
                    type="email"
                    name = "email"
                    placeholder="Email"
                    iconclass="fi-rr-envelope"
            />
            <InputBox
                    type="password"
                    name = "password"
                    placeholder="Password"
                    iconclass="fi-rr-lock"
            />
            <button
                className="btn-dark center mt-14"
                type="submit"
            >
                {type.replace("-" ,"")}
            </button>
            <div className="relative w-full items-center flex gap-2 my-10 opacity-10 uppercase text-black font-bold">
                <hr className="w-1/2 border-black" />
                <p>or</p>
                <hr className="w-1/2 border-black" />
            </div>
            <button className="btn-dark flex items-center gap-4 justify-center w-[90%] center" > 
            <img src={googleimg} className='w-5' alt="" />
            Continue with Google
            </button>
            {
                type == "sign-in" ?
                <p className='mt-6 text-dark-grey flex align-middle justify-center text-xl align-center'>
                    Dont have an account ? 
                    <Link to='/signup' className='underline text-black text-xl ml-1'>
                    Join Us Today
                    </Link>
                </p>
                :
                <p className='mt-6 text-dark-grey flex align-middle justify-center text-xl'>
                    Already a member ? 
                    <Link to='/signin' className='underline text-black text-xl ml-1'>
                    Sign in here 
                    </Link>
                </p>
            }
        </form>
    </section>
    </AnimationWraper>
  )
}

export default UserAuthForm

import React, { useContext, useRef } from 'react';
import InputBox from '../components/input.component';
import googleimg from '../imgs/google.png';
import { Link, Navigate } from 'react-router-dom';
import AnimationWraper from '../common/page-animation';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';
import { storeinSession } from '../common/session';
import {UserContext} from '../App';


let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

function UserAuthForm({ type }) {
    const authform = useRef();

    let {userAuth : {access_token} , setUserAuth } = useContext(UserContext);
    // console.log(useContext(UserContext))
    console.log(access_token)
    // Async/Await for better error handling
    const userAuthThroughServer = async (serverRoute, formData) => {
        try {
            const response = await axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            console.log(response.data);
            toast.success("Authentication successful");
            if(response) {
                storeinSession("user" , JSON.stringify(response.data))
                setUserAuth(response.data)
                console.log(sessionStorage , "data of session")
            }
            // Handle successful authentication (e.g., save token, redirect)
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                toast.error(error.response.data.error || "An error occurred");
            } else if (error.request) {
                // The request was made but no response was received
                toast.error("No response from server. Check your internet connection.");
            } else {
                // Something happened in setting up the request that triggered an Error
                toast.error("Error: " + error.message);
            }
        }
    };
    const handleSubmitfn = (e) => {
        e.preventDefault(); // Prevent the form from submitting and reloading the page
    
        // Retrieving form data
        let form = new FormData(authform.current);
        let formData = {};
        let serverRoute = type === "sign-in" ? "/signin" : "/signup";

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        const { fullname, email, password } = formData;

        // Validation checks
        if (type !== "sign-in" && fullname && fullname.length < 3) {
            return toast.error("Fullname must be at least 3 characters long");
        }
        if (!email || !email.length) {
            return toast.error("Email is required");
        }
        if (!password || !password.length) {
            return toast.error("Password is required");
        }
        if (!emailRegex.test(email)) {
            return toast.error("Email is not valid");
        }
        if (!passwordRegex.test(password)) {
            return toast.error("Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letter");
        }

        // Call your server authentication function
        userAuthThroughServer(serverRoute, formData);
    };

    return (
        access_token ? 
        <Navigate to="/" />
        :
        <AnimationWraper key={type}>
            <section className="h-cover flex items-center justify-center">
                <Toaster />
                <form ref={authform} className="w-[80%] max-w-[400px]" onSubmit={handleSubmitfn}>
                    <h1 className="text-4xl font-gelasio capitalize text-center mb-24 ">
                        {type === "sign-in" ? "Welcome Back" : "Join Us Today"}
                    </h1>
                    {type !== "sign-in" && (
                        <InputBox
                            type="text"
                            name="fullname"
                            placeholder="Full Name"
                            iconclass="fi-rr-user"
                        />
                    )}

                    <InputBox
                        type="email"
                        name="email"
                        placeholder="Email"
                        iconclass="fi-rr-envelope"
                    />
                    <InputBox
                        type="password"
                        name="password"
                        placeholder="Password"
                        iconclass="fi-rr-lock"
                    />
                    <button
                        className="btn-dark center mt-14"
                        type="submit" // Ensure proper form submission
                    >
                        {type.replace("-", "")}
                    </button>
                    <div className="relative w-full items-center flex gap-2 my-10 opacity-10 uppercase text-black font-bold">
                        <hr className="w-1/2 border-black" />
                        <p>or</p>
                        <hr className="w-1/2 border-black" />
                    </div>
                    <button className="btn-dark flex items-center gap-4 justify-center w-[90%] center">
                        <img src={googleimg} className="w-5" alt="" />
                        Continue with Google
                    </button>
                    {type === "sign-in" ? (
                        <p className="mt-6 text-dark-grey flex align-middle justify-center text-xl align-center">
                            Don't have an account?{" "}
                            <Link to="/signup" className="underline text-black text-xl ml-1">
                                Join Us Today
                            </Link>
                        </p>
                    ) : (
                        <p className="mt-6 text-dark-grey flex align-middle justify-center text-xl">
                            Already a member?{" "}
                            <Link to="/signin" className="underline text-black text-xl ml-1">
                                Sign in here
                            </Link>
                        </p>
                    )}
                </form>
            </section>
        </AnimationWraper>
    );
}

export default UserAuthForm;

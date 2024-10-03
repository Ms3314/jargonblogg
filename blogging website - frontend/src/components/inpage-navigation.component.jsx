import { useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import React from "react"
export let activeTabLineRef ;
export let activeTabRef ; 

const InPageNavigation = ({ routes , defaultActiveIndx = 0 , defaultHidden , children}) => {
    activeTabLineRef = useRef();
    activeTabRef = useRef()
    let [inPageNavIndex , setInPageNavIndex] = useState(defaultActiveIndx);
    
    const changePageState =(btn , i)=> {
        let {offsetWidth , offsetLeft} = btn 
        activeTabLineRef.current.style.width = offsetWidth + "px"
        activeTabLineRef.current.style.left = offsetLeft + "px"
        setInPageNavIndex(i)
    }

    useEffect(()=> {
      changePageState(activeTabRef.current , defaultActiveIndx)  
    },[])

    return (
        <>
           <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
                    {routes.map((route, i) => (
                        <>
                                <button
                                    className={`p-4 px-5 capitalize ${inPageNavIndex === i ? "text-black" : "text-dark-grey"} ${defaultHidden.includes(route) ? "md:hidden" : ""}`}
                                    ref={i === defaultActiveIndx ? activeTabRef : null}
                                    key={i}
                                    onClick={(e) => {
                                    changePageState(e.target, i);
                                    }}
                                >
                                    {route}
                                </button>
                                <hr
                                ref={activeTabLineRef}
                                className={`absolute bottom-0 duration-300 `}
                            />
                            </>
                                
                    ))}
        </div>
                                

            {/* isArray is methood used to check if the given item is an array or not   */}
    {/* ao basically when we pass the children normally it does not act as an array but if we pass more than one children it will act as an array to becomes in a form of Array*/}
                {Array.isArray(children) && children[inPageNavIndex] }
        </>
    )
}

export default InPageNavigation;;
import { useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const InPageNavigation = ({ routes , defaultActiveIndx = 0 }) => {
    let activeTabLineRef = useRef();
    let activeTabRef = useRef()
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
                        {
                            routes.map((route , i ) => {
                                return (
                                    <button key={i} className={"p-4 px-5 capitalize " + (inPageNavIndex == i ? "text-black" : "text-dark-grey" )}
                                    ref={ i == defaultActiveIndx ? activeTabRef : null }
                                    onClick={(e)=>{
                                        changePageState(e.target , i)
                                    }}
                                    >
                                        {route}
                                    </button>
                                )
                            })
                        }
                        <hr ref={activeTabLineRef} className="absolute bottom-0 duration-300 "/>
            </div>
        </>
    )
}

export default InPageNavigation;;
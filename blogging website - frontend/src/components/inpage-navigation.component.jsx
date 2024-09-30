import { useScroll } from "framer-motion";
import { useRef, useState } from "react";

const InPageNavigation = ({ routes }) => {
    let activeTabLineRef = useRef();
    let [inPageNavIndex , setInPageNavIndex] = useState(0);
    return (
        <>
            <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
                        {
                            routes.map((route , i ) => {
                                return (
                                    <button key={i} className={"p-4 px-5 capitalize " + (inPageNavIndex == i ? "text-dark-grey" : "text-black" )}>
                                        {route}
                                    </button>
                                )
                            })
                        }
            </div>
        </>
    )
}

export default InPageNavigation;;
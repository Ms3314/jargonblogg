import { useState } from "react"
const InputBox = ({name , id , type , value , placeholder , iconclass}) => {
    const [passwordVisible , setPasswordVisible] = useState(false)
    return (
       <div className="relative w-[100%] mb-4">
            <input
            name={name}
            type={type == "password" ? (passwordVisible ? "text" : "password") : type}
            placeholder={placeholder}
            defaultValue={value}
            id={id}
            className="input-box"
            />
            <i className={`fi ${iconclass} input-icon`}></i>

            {
                type === "password" &&
                <i onClick={()=> setPasswordVisible(e=> !e)} className={`fi fi-rr-eye${!passwordVisible ? "-crossed" : ''} input-icon left-[auto] right-5 cursor-pointer`}></i>
                
            }
       </div>
    )
}
export default InputBox
import { Link } from "react-router-dom";
import AnimationWraper from "../common/page-animation";
import { useContext } from "react";
import {UserContext} from "../App";
import { removeFromSession } from "../common/session";


const UserNavigationPanel = () => {
    const { userAuth : {username} , setUserAuth}  = useContext(UserContext);

    const signOutUser =() => {
        removeFromSession("user")
        setUserAuth({access_token : null})
    }
    return (
      <AnimationWraper transition={{duration : 0.2}} className="absolute right-0 z-50">

        <div className="bg-white absolute right-0 border border-grey w-60 overflow-hidden duration-200">
            <Link to="/editor" className="flex gap-2 link md:hidden pl-8 py-4  ">
            <i className="fi fi-sr-file-edit"></i> 
            <p>Write</p>              
            </Link>
            <Link to={`/user/${username}`}  className="flex gap-2 link md:hidden pl-8 py-4  ">
            <i class="fi fi-rs-user"></i>
            <p>Profile</p>
            </Link>
            <Link to='/dasboard/blogs'  className="flex gap-2 link md:hidden pl-8 py-4  ">
            <i class="fi fi-rs-user"></i>
            <p>Dashboard</p>
            </Link>
            <Link to='/settings/edit-profile'  className="flex gap-2 link md:hidden pl-8 py-4  ">
            <i class="fi fi-rs-user"></i>
            <p>Settings</p>
            </Link>
            <span className="absolute border-t border-grey w-[100%]"></span>
            <button onClick={signOutUser} className="text-left p-4 hover:bg-grey w-full pl-8 py-4 ">
                <h1 className="font-bold test-xl mb-1">Sign Out</h1>
                <p className="text-dark-grey">@{username}</p>
            </button>
        </div>

      </AnimationWraper>
    )
}

export default UserNavigationPanel;
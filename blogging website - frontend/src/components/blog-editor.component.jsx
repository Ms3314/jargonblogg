import { Link } from "react-router-dom";
import logo from "../imgs/logo.png"
import AnimationWraper from "../common/page-animation";

const BlogEditor = () => {
    return (
        <>
        <nav className="navbar">
            <Link to="/">
                <img src={logo} alt="logo" className="flex-none w-10 "/>
            </Link>
            <p className="max-md:hidden text-black line-clamp-1 w-full "> 
                New Blog 
            </p> 
            <div className="flex gap-4 ml-auto">
                <button className="btn-dark py-2">
                    Publish
                </button>
                <button className="w-[100px] btn-light py-2 px-[10px]">
                    Save Draft
                </button>
            </div>
        </nav>
        <AnimationWraper>
            <section>
                <div className="mx-auto max-w-[900px] w-full ">
                    <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey"> 
                        <label htmlFor="uploadBanner">
                            <input id="uploadBanner"
                            type="file"
                            accept=".png , .jpg , .jpeg"
                            hidden
                            />
                        </label>
                    </div>
                </div>
            </section>
        </AnimationWraper>
        </>
    )
}

export default BlogEditor   
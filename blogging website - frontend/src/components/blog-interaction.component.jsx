import { useContext } from "react";
import {BlogContext} from "../pages/blog.page.jsx"
import { Link } from "react-router-dom";
import {UserContext} from "../App.jsx"


const BlogInteraction = () => {
    let { blog : {title ,blog_id , activity , activity : {total_likes , total_comments} , author : {personal_info : { username : author_username}} }, setBlog } = useContext(BlogContext)

    let { userAuth : {username} } = useContext(UserContext)
    return (
        <>
            <hr className="border-grey my-2" />
                <div className="flex gap-6 flex-row justify-between p-2">
                    {/* this is the left wala column */}
                    <div className="flex gap-6 flex-row">
                    {/* the link button */}
                    <div className="flex gap-3 items-center">
                        <button className="w-10 h-10 rounded-full flex-center justify-center bg-grey/80">
                            <i className="fi fi-rr-heart" ></i>
                        </button>
                        <p className="text-xl test-dark-grey">{total_likes}</p>
                    </div>
                    {/* this is the comment icon */}
                    <div className="flex gap-3 items-center">
                        <button className="w-10 h-10 rounded-full flex-center justify-center bg-grey/80">
                            <i className="fi fi-rr-comment-dots" ></i>
                        </button>
                        <p className="text-xl test-dark-grey">{total_likes}</p>
                    </div>
                    </div>
                    <div className="flex gap-6 items-center">
                            {
                                username == author_username ? 
                                <Link to={`/editor/${blog_id}`} className="underline" >Edit</Link> 
                                : ""
                            }
                            {/* redirect to twitter */}
                            <a
                                href={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="fi fi-brands-twitter text-xl hover:text-twitter"></i>
                            </a>
                    </div>
                </div>
            <hr className="border-grey my-2" />

            
        </>
    )
}

export default BlogInteraction ;
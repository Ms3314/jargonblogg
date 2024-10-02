import AnimationWraper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import axios from "axios"
import Loader from "../components/loader.component"
import BlogPostCard from "../components/blog-post.component"
import {useEffect , useState} from "react"

const HomePage = () => {
    let [blog , setBlog] = useState(null)

    const fetchLatestBlogs = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + '/latest-blogs')
        .then(({ data })  => {
            setBlog(data.blogs)
        })
        .catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        fetchLatestBlogs()
    } , [])

    return (
        <AnimationWraper>
            <section className="h-cover flex justify-center gap-10 ">
                {/* this div will be for the latest blogs */}
                <div className="w-full">
                    {/* the routes will be displayed on screen , and on the other hand the defaultHidden is which will be hidden in larger screens */}
                    <InPageNavigation routes={["home" , "trending blogs"]} defaultHidden={["trending blogs"]}>
                       
                        <>
                            {
                                blog == null ? <Loader /> :
                                blog.map((blog , i) => {
                                    return <AnimationWraper transition={{duration : 1 , delay : i*.1}} key={i}>
                                        <BlogPostCard content={blog} author={blog.author.personal_info}/>
                                    </AnimationWraper>
                                })  
                            }
                        </>                

                        <h1>Trending Blogs here </h1>

                    </InPageNavigation>
                </div>

                {/* filters and trending blogs */}
                <div>
                     
                </div>
            </section>
        </AnimationWraper>
    )
}

export default HomePage; 
import AnimationWraper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import axios from "axios"
import Loader from "../components/loader.component"
import BlogPostCard from "../components/blog-post.component"
import MinimalBlogPost from "../components/nobanner-blog-post.component"
import {useEffect , useState} from "react"
import  {activeTabRef }  from "../components/inpage-navigation.component";
import NoDataMessage from "../components/nodata.component";


const HomePage = () => {
    let [blog , setBlog] = useState(null)
    let [trendingBlog , setTrendingBlog] = useState(null)
    let [pageState , setPageState] = useState("home")
    let categories = ["programming" , 'Masters' , "crypto" , "design" , "tech" , "AI" , "gaming" , "csi" , "marketting" ]

    const fetchLatestBlogs = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + '/latest-blogs')
        .then(({ data })  => {
            setBlog(data.blogs)
        })
        .catch(err => {
            console.log(err);
        })
    }

    const fetchBlogByCategory = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/search-blogs' , {tag : pageState})
        .then(({ data })  => {
            setBlog(data.blogs)
        })
        .catch(err => {
            console.log(err.message);
        })
    }

    const fetchTrendingBlogs = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + '/trending-blog')
        .then(({ data })  => {
            setTrendingBlog(data.blogs)
        })
        .catch(err => {
            console.log(err);
        })
    }

    const loadBlogByCategory = (e) => {
        let category = e.target.innerText.toLowerCase() ; 
        // agar tum blog ko null kar diye koyi bhi blog display nai hone wale hai 
        setBlog(null);
        if(pageState == category) {
            // this implies if u clicked the button onces again just go back to the home page or just set it back to home ok
            setPageState("home");
            return ; 
        }
        console.log(category);
        console.log("ye wala state exist karra", pageState)
        setPageState(category)
    }   

    useEffect(() => {
        activeTabRef.current.click()

        if(pageState == "home") {
            fetchLatestBlogs();
        } else {
            fetchBlogByCategory()
        }


        if(!trendingBlog) {
        fetchTrendingBlogs()
        }

    } , [pageState])

    return (
        <AnimationWraper>
            <section className="h-cover flex justify-center gap-10 ">
                {/* this div will be for the latest blogs */}
                <div className="w-full">
                    {/* the routes will be displayed on screen , and on the other hand the defaultHidden is which will be hidden in larger screens */}
                    <InPageNavigation routes={[pageState , "trending blogs"]} defaultHidden={["trending blogs"]}>
                       
                        <>
                            {
                                blog == null ? <Loader /> : 
                                (
                                blog.length ? blog.map((blog , i) => {
                                    return <AnimationWraper transition={{duration : 1 , delay : i*.1}} key={i}>
                                        <BlogPostCard content={blog} author={blog.author.personal_info}/>
                                    </AnimationWraper>
                                }) : 
                                <NoDataMessage
                                message="No Blogs published"
                                />
                                )
                            }
                        </>                

                        <>
                            {
                                trendingBlog == null ? <Loader /> :
                                trendingBlog.length ? 
                               ( 
                                trendingBlog.map((blog , i) => {
                                    return <AnimationWraper transition={{duration : 1 , delay : i*.1}} key={i}>
                                        <MinimalBlogPost blog={blog} index={i}/>
                                    </AnimationWraper>
                                }
                            ) )
                                : <NoDataMessage
                                message="No Trending Blogs"
                                />

                            }
                        </>

                    </InPageNavigation>
                </div>

                {/* filters and trending blogs */}
                {/* max-md means from smaller screens to medium screens  */}
                            <div className="min-w-[40%] lg:min-[400px] max-w-min border-2 pr-[120px] border-grey pl-8 pt-10 mt-[-20px] max-md:hidden">
                                <div className="flex flex-col gap-10">
                                {/* this is the main div in which we have trensing and the isk those buttons  */}
                                
                                {/* here we have those category buttons */}
                                <div>
                                    <h1 className="font-medium text-xl mb-8 ">Stories from all intrests</h1>
                                    
                                    <div className="flex gap-3 flex-wrap ">
                                        {
                                            categories.map((category , i)=> {
                                                return <button onClick={loadBlogByCategory} className={'tag ' + ( pageState == category ? "bg-black text-white" : "") } key={i} >{category}</button>
                                            })
                                        }
                                    </div>
                                </div>
                                {/* here we have the trending blogs */}
                                <div>
                                    {/* trending blog part , fetching the data from backend  */}
                                    <h1 className="font-medium text-xl mb-8 ">Trending <i class="fi fi-rr-arrow-trend-up"></i></h1>
                                    
                                    {
                                        trendingBlog == null ? <Loader /> :
                                        trendingBlog.length ? 
                                        trendingBlog.map((blog , i) => {
                                            return <AnimationWraper transition={{duration : 1 , delay : i*.1}} key={i}>
                                                <MinimalBlogPost blog={blog} index={i}/>
                                            </AnimationWraper>
                                        })  
                                        :
                                        <NoDataMessage
                                        message="No Trending Blogs"
                                        />
                                    }
                                </div>

                                </div>
                            </div>

                <div>
                     
                </div>
            </section>
        </AnimationWraper>
    )
}

export default HomePage; 
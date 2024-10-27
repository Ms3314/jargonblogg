import axios from "axios";
import { createContext, useState } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/loader.component";
import AnimationWraper from "../common/page-animation"
import { getDay } from "../common/date";
import BlogInteraction from "../components/blog-interaction.component"

const data = {
    title: "",
    content: [],
    banner: "",
    tags: [],
    blogs: "",
    author: {
        personal_info: {
            fullname: "",
            username: "",
            profile_img: "",
        },
    },
    publishedAt: "",
};

export const BlogContext = createContext();

const Blogpage = () => {
    let { blog_id } = useParams();
    let [blog, setBlog] = useState(data);
    let [loading, setLoading] = useState(true);
    let [similiarBlogs, setSimiliarBlogs] = useState(null);

    let {
        title,
        content,
        banner,
        tags,
        author: {
            personal_info: { fullname, username: author_username, profile_img },
        },
        publishedAt,
    } = blog;

    const fetchBlog = () => {
        axios
            .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", { blog_id })
            .then(({ data: { blog } }) => {
                console.log("these are the tags", blog.tags);
                setBlog(blog);

                // Fetch similar blogs based on the first tag
                if (blog.tags.length > 0) {
                    axios
                        .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { tag: blog.tags[0], limit: 6 , eliminate_blog : blog_id})
                        .then(({ data }) => {
                            console.log("Fetched similar blogs:", data.blogs);
                            setSimiliarBlogs(data.blogs); // Update state with similar blogs
                        })
                        .catch((err) => {
                            console.error("Error fetching similar blogs:", err);
                        });
                }

                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching blog:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchBlog();
    }, []); // Fetch blog only once when the component mounts

    // Track updates to similarBlogs state
    useEffect(() => {
        console.log("Updated similarBlogs:", similiarBlogs);
    }, [similiarBlogs]);

    return (
        <AnimationWraper>
            {loading ? (
                <Loader />
            ) : (
                <BlogContext.Provider value={{ blog, setBlog }}>
                    <div className="max-w-[900px] center py-10 max-lg:py-[5vw] px-3">
                        <img src={banner} className="aspect-video" />
                        <div className="mt-12">
                            <h2>{title}</h2>
                            <div className="flex max-sm:flex-col justify-between my-8">
                                <div className="flex gap-5 items-start">
                                    <img src={profile_img} className="w-12 h-12 rounded-full" />
                                    <p>
                                        {fullname}
                                        <br />@
                                        <Link className="underline" to={`/user/${author_username}`}>
                                            {author_username}
                                        </Link>
                                    </p>
                                </div>
                                <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                                    Published on {getDay(publishedAt)}
                                </p>
                            </div>
                        </div>
                        {/* Blog content and other sections */}
                    <BlogInteraction/>
                        
                    <BlogInteraction/>
                    </div>
                </BlogContext.Provider>
            )}
        </AnimationWraper>
    );
};

export default Blogpage;

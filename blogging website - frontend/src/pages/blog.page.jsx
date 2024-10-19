import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const data = {
    title : "",
    content : [] ,
    tags : [],
    banner : "",
    author : {
        personal_info : {
            fullname : "",
            username : "",
            profile_img : ""
        }
    } , 
    publishedAt : ""
}


const Blogpage = () => {
    let { blog_id } = useParams()
    let [blog , setBlog] = useState(data)

    let {title , content , banner , author : {personal_info : {fullname , username , profile_img }} , publishedAt} = blog;

    const fetchBlog = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", { blog_id })
        .then(({data : {blog}}) => {
            console.log("checkpoint 1" , blog)
            setBlog(blog)
        })
        .catch(err => {
            console.log(err)
        }
        )
    }

    useEffect(()=> {
        fetchBlog()
        console.log("checkpoint 2" , blog)
    },[])

    console.log(blog.title)

    return (
        <h1>Hello mann ... solo sanemi {blog.title} </h1>
    )
}

export default Blogpage;
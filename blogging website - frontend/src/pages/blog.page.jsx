import { useParams } from "react-router-dom";

const Blogpage = () => {
    
    let { blog_id } = useParams()
    return (
        <h1>Hello mann ... solo sanemi {blog_id}</h1>
    )
}

export default Blogpage;
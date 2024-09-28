import { Link } from "react-router-dom";
import logo from "../imgs/logo.png"
import {useContext} from "react"
import AnimationWraper from "../common/page-animation";
import defaultBanner from "../imgs/blog banner.png"
import { uploadImage } from "../common/aws";
import { useEffect} from "react";
import {Toaster , toast} from "react-hot-toast"
import {EditorContext} from "../pages/editor.pages"
import EditorJS from "@editorjs/editorjs"
import {tools} from "./tools.component"

const BlogEditor = () => {

    let {blog , blog : {title , banner , content , tags , des} , setEditorState , setBlog , textEditor , setTextEditor } =  useContext(EditorContext)

    // useEffect 
    useEffect(()=> {
        setTextEditor(new EditorJS({
            holderId : "textEditor",
            data : '',
            tools : tools,
            placeholder : "lets write an awesome story"
        }))
    },[])

    const handleBannerUpload = (e) => {
        let img = e.target.files[0]
        if (img) {
            let loadingToast = toast.loading("Uploading...")

            uploadImage(img).then((url) => {
                if(url) {
                    toast.dismiss(loadingToast)
                    toast.success("Uploaded Successfully")
                    setBlog({...blog , banner : url })
                }
            })
            .catch(err => {
                toast.dismiss(loadingToast)
                return toast.error(err)
            })
        }
    }
    const handleTitleKeyDown = (e) => {
        if (e.keyCode == 13) {
            e.preventDefault()
        }
    }
    const handleTitleChange = (e) => {
        let input = e.target;
        input.style.height = 'auto' ;
        input.style.height = input.scrollHeight + "px"
        setBlog({...blog , title : input.value })
    }
    const handleError = (e) => {
         const img = e.target
        img.src = defaultBanner
    }
    const handlePublishEvent = (e) => {
        if (!banner.length) {
            return toast.error("Upload a blog banner to publish it")
        }
        if (!title.length) {
            return toast.error("Write blog title for the blog")
        }
        if (textEditor.isReady) {
            textEditor.save().then(data => {
                if(data.blocks.length) {
                    setBlog({...blog , content : data});
                    setEditorState("publish")
                } else {
                    return toast.error("Write something in the blog to publish it ")
                }
            })
            .catch((err) => {
                console.log(err)
            })
        }
    }
    return (
        <>
        <nav className="navbar">
            <Link to="/">
                <img src={logo} alt="logo" className="flex-none w-10 "/>
            </Link>
            <p className="max-md:hidden text-black line-clamp-1 w-full text-[22px] "> 
                {title.length ? title : "New Blog" }                              
            </p> 
            <div className="flex gap-4 ml-auto">
                <button className="btn-dark py-2"
                onClick = {handlePublishEvent}
                >
                    Publish
                </button>
                <button className="w-[100px] btn-light py-2 px-[10px]">
                    Save Draft
                </button>
            </div>
        </nav>
        <Toaster />
        <AnimationWraper>
            <section>
                <div className="mx-auto max-w-[900px] w-full ">
                    <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey"> 
                        <label htmlFor="uploadBanner">
                            
                            <img
                            src={banner} 
                            onError={handleError}
                            alt="the banner of the blog" />

                            <input id="uploadBanner"
                            type="file"
                            accept=".png , .jpg , .jpeg"
                            hidden
                            onChange={handleBannerUpload}
                            
                            />
                        </label>
                    </div>
                    <textarea 
                    placeholder="Blog Title"
                    className="text-4xl font-medium w-full h-20 resize-none mt-10 leading-tight placeholder:opacity-40 placeholder:pl-10"
                    onKeyDown={handleTitleKeyDown}
                    onChange = {handleTitleChange}
                    >

                    </textarea>

                    <hr classname="w-full opacity-10 my-5 " />

                    <div id="textEditor" classname="font-gelasio"></div>

                </div>
            </section>
        </AnimationWraper>
        </>
    )
}

export default BlogEditor   
import { useContext } from "react"
import AnimationWraper from "../common/page-animation"
import { Toaster , toast} from "react-hot-toast"
import {EditorContext} from "../pages/editor.pages"
import Tag from "./tags.component"

const PublishForm = () => {
    let Characterlimit = 200;
    let tagLimit = 10
    let { setEditorState , blog , blog : {banner , title , tags , des} , setBlog} = useContext(EditorContext)
    
    
    const handleTitleKeyDown = (e) => {
        if (e.keyCode == 13) {
            e.preventDefault()
        }
    }

    const handleCloseEvent = () => {
        setEditorState("editor")
    }

    const handleBlogTitleChange = (e) => {
        let input = e.target ;
        setBlog({...blog , title : input.value})

    }
    const handleBlogDesChange = (e) => {
        let des = e.target ;
        setBlog({...blog , des : des.value}) 

    }

    const handleKeyDown = (e) => {
        if (e.keyCode === 13 || e.keyCode === 188) {
            e.preventDefault();
            let tag = e.target.value
            if(tags.length < tagLimit ) {
                if(!tags.includes(tag) && tag.length) {
                    setBlog({...blog , tags : [...tags , tag]})
                }
            } else {
                toast.error(`You can add max  ${tagLimit} tags`)
            }
            e.target.value = ""
        }
    }
    return (
        <AnimationWraper>
            <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
                <Toaster/>
                <button className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]" 
                onClick={handleCloseEvent}
                >
                    <i className="fi fi-br-x"></i>
                </button>

                <div className="max-w-[550px] center">
                    <p className="text-dark-grey mb-1">Preview</p>
                    <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
                        <img src={banner} alt="" />
                    </div>
                    <h1 className="text-4xl font-medium leading-tight line-clamp-2">{title}</h1>
                    <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">{des}</p>
                </div>

                <div className="border-grey lg:border-1 lg:pl-8">
                    <p className="text-dark-grey mb-2 mt-9">Blog Title</p>
                    <input type="text" plaveholder="Blog Title" 
                    defaultValue={title} className="input-box pl-4 " onChange={handleBlogTitleChange}/>
                    
                    <p className="text-dark-grey mb-2 mt-9">Short description about your blog</p>
                    <textarea 
                    defaultValue={des} 
                    maxLength={Characterlimit}
                    className="h-40 resize-none leading-7 input-box pl-4 "
                    onChange={handleBlogDesChange}
                    onKeyDown={handleTitleKeyDown}
                    >
                       
                    </textarea>
                    <p className="mt-1 text-dark-grey text-sm text-right ">{ Characterlimit - des.length } characters left</p>
                
                    <p className="text-dark-grey mb-2 mt-9">Topics - (helps in searching and ranking your blog post )</p>
                    
                    <div className="relative postion input-box pl-2 py-2 pb-4 ">
                        <input type="text" placeholder="Topics"
                        onKeyDown={handleKeyDown}
                        className="focus:bg-white sticky pl-4 mb-3 input-box bg-white top-0 left-0" />
                        {
                            tags.map((tag , i) => {
                                return <Tag tag={tag} key={i} tagIndex={i}/>
                            })
                        }
                    </div>
                    <p className="mt-1 mb-4 text-dark-grey text-sm text-right">{tagLimit - tags.length} tags left</p>
                    <button className="btn-dark px-8 ">Publish</button>
                </div>
            </section>
        </AnimationWraper>
    )
}

export default PublishForm   
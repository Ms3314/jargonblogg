import React, { useContext } from 'react';
import { EditorContext } from '../pages/editor.pages'

const Tag = ({tag , tagIndex}) => {
    let {blog : {tags} , setBlog , blog } = useContext(EditorContext);

    const handleTagDelete = () => {
        tags = tags.filter(t => t != tag)
        setBlog({...blog , tags})
    }
    const handleTagEdit =(e) => {
        if (e.keyCode == 13 || e.keyCode == 188) {
            e.preventDefault();
            let currentTag = e.target.innerText
            tags[tagIndex] = currentTag
            setBlog({...blog , tags})
            e.target.setAttribute("contenteditable" , "false");
            console.log(tags)
        }
    }
    const addEditableFn = (e) => {
        e.target.setAttribute("contenteditable" , "true");
        e.target.focus();
    }
  return (
    <div className='relative p-2 mt-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10'>
        <p className='ouline-none' onClick={addEditableFn}
         onKeyDown={handleTagEdit} contentEditable="true">{tag}</p>
        <button className='mt-[2px] rounded-full  absolute right-3 top-1/2 -translate-y-1/2'
        onClick={handleTagDelete}
        >
        <i className="fi fi-br-x text-sm pointer-events-none"></i>
        </button>
    </div>
)
}

export default Tag
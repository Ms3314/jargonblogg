// importing the tools  

import Embed from "@editorjs/embed"
import List from "@editorjs/list"
import Image from "@editorjs/image"
import Header from "@editorjs/header"
import Quote from "@editorjs/quote"
import Marker from "@editorjs/marker"
import InlineCode from "@editorjs/inline-code"

const uploadImageByUrl = () {
    
}


export const tools = {
    embed : Embed ,
    list : {
        class : List , 
        inlineToolbar : true
    } ,
    image : {
        class : Image , 
        config : {
            uploader : {
                uploadByUrl :  , 
                uploadByFile : 
            }
        }
    } , 
    header : {
        class : Header , 
        config : {
            placeholder : "Type Heading...",
            levels : [2 , 3],
            defaultLevel:2
        }
    } , 
    quote : {
        class : Quote , 
        inlineToolBar : true
    } , 
    maker : Marker , 
    inlineCode : InlineCode 
}

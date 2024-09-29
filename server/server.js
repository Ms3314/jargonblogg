import express from "express"
import mongoose from "mongoose";
import 'dotenv/config'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { nanoid } from "nanoid";
import cors from "cors"
// schema imported here
import Blog from "./Schema/Blog.js"
import User from "./Schema/User.js"
import admin from "firebase-admin";
import serviceAccountKey from './jargon-blog-firebase-adminsdk-j8izb-43dd6bbe561.json' assert {type : "json" }
import {getAuth} from "firebase-admin/auth"
import aws from "aws-sdk";

const app = express()
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
let PORT = 3000;

admin.initializeApp({
    credential : admin.credential.cert(serviceAccountKey)
})

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

mongoose.connect(process.env.DB_LOCATION)
.then(() => {
    console.log("Connected to database")
})

// setting up the s3 bucket 
const s3 = new aws.S3({
    region : 'eu-north-1',
    accessKeyId : process.env.AWS_ACCESS_KEY,
    secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY
})

const generateUploadURL = async () => {
    const date = new Date()
    const imageName = `${nanoid()}-${date.getTime}.jpeg`
    return await s3.getSignedUrlPromise('putObject' , {
        Bucket : 'myjargonbucket',
        Key : imageName,
        Expires : 1000,
        ContentType : 'image/jpeg'
    })
}

// IF its saying that we cannot send a callback in the connect stmt then i just use a then statemnt 

app.use(express.json());


app.get("/" , (req ,res) => {

    res.send("Hello World") }
)

const generateUsername = async (email) => {
    let username = email.split("@")[0]
    let isUsernameNotUnique = await User.exists({ "personal_info.username" : username }).then((result) =>  result)

    isUsernameNotUnique ? username += nanoid(3) : "" ;
    return username
               
}

const verifyJWT = (req , res , next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) {
        return res.status(401).json({"error" : "No access token"})
    }

    jwt.verify(token , process.env.SECRET_ACCESS_KEY , (err , user) => {
        if (err) {
            return res.status(403).json({"error" : "Invalid access token"})
        } else {
            req.user = user.id
            next()
        }
    } ) 
}
 
const formatDatatoSend = (user) => {

    const access_token = jwt.sign({ id : user._id} , process.env.SECRET_ACCESS_KEY )
    console.log(access_token)
    return {
        access_token : access_token,
        profile_img : user.personal_info.profile_img,
        fullname : user.personal_info.fullname,
        username : user.personal_info.username,
    }
}

app.get('/get-upload-url' , (req , res) => {
        generateUploadURL().then(url => res.status(200).json({"uploadURL" : url}))
        .catch(err => {
        console.log(err.message)
        return res.status(500).json({"error" : "Something went wrong"})
    })
})

app.post("/signup" , (req ,res) => {
    const {fullname , email , password} = req.body
    console.log(req.body)
    console.log("data  reach till here ")
    // validating the data from frontend 
    if(fullname.length < 3){
        return res.status(403).json({"error" : "Fullname must be at least 3 characters long"})
    }
    if(!email.length){
        return res.status(403).json({"error" : "Email is required"})
    }
    if(!password.length){
        return res.status(403).json({"error" : "Password is required"})
    }
    if(!emailRegex.test(email)){
        return res.status(403).json({"error" : "Email is not valid"})
    }
    if(!passwordRegex.test(password)) {
        return res.status(403).json({"error" : "Password should be 6 to 20 characters long with a numeric , 1 lowercase and 1 uppercase letter"})
    }
    bcrypt.hash(password , 10 , async (err , hashpasword)=>{
        const username = await  generateUsername(email) 

        let user = new User({
            personal_info : {fullname , email , password : hashpasword , username }
        })
        user.save().then((user) => {
            return res.status(200).json(formatDatatoSend(user))
            // console.log(FormatDatatoSend(user))
        }).catch((err) => {
            if(err.code = 11000) {
                return res.status(403).json({"error" : "Email already exists"})
            }
            res.status(500).json({"error" : "Something went wrong"} )
        })
    })    
    
})

app.post("/signin" , (req , res) => {
    const {email , password} = req.body
    User.findOne({ "personal_info.email" : email }).
    then((user) => {
        if (!user) {
            return res.status(403).json({"error" : "Invalid credentials"})
        }

        if (user.google_auth) {
             res.status(403).json({"error" : "Account was looged in with google try logging in with it "})
        }else {
            bcrypt.compare(password , user.personal_info.password , (err , result) => {
                if(err) {
                    return res.status(403).json({"error" : "Invalid credentials"})
                }else {
                    return res.status(200).json(formatDatatoSend(user))
                }
            })
        }
        // return res.json({"status" : "got user Document "})
    }).
    catch(err=> {
        console.log(err.message)
        return res.status(500).json({"error" : err.message})
    })
} )

app.post("/google-auth" , async (req , res) => {
    let {access_token} = req.body  
    getAuth().verifyIdToken(access_token)
    .then(async (decodedUser)=> {
        let {email , name , picture} = decodedUser
        picture = picture.replace("s96-c" , "s384-c")

        let user = await User.findOne({"personal_info.email" : email})
            .select("personal_info.fullname personal_info.username personal_info.profile_img google_auth ").then((user) => {
                return user || null 
        })
        .catch(err => {
            res.status(500).json({"error" : err.message})
        })
            if (user) { //checking if the user already exists 
                if(!user.google_auth) { // if not from the gAuth tell them to sign using the email and the password 
                    return res.status(403).json({"error" : "this email was signed up with google , please login with password to access the accound "})
                }
            }
            else {
                let username = await generateUsername(email)
                // if does not exists create a new db for it 
                user = new User({
                    personal_info : {fullname : name , email , username  },
                    google_auth : true
                })

                await user.save().then((data)=>{
                    user = data 
                    console.log(user)
                })
                .catch(err => {
                    return res.status(500).json({"error" : err.message})
                })
            }
            return res.status(200).json(formatDatatoSend(user))

    })
    .catch(err => {
        return res.status(500).json({"error" : err.message})
    })
})

app.post("/create-blog" , verifyJWT ,(req , res) => {
    let authodId = req.user

    let {title , banner , content , tags , des , draft} = req.body

    if(!title.length) {
        return res.status(403).json({error : "you must provide a title to publish your blog "})
    } 

    if(!draft) {
        if (!des.length || des.length > 200) {
            return res.status(403).json({error : "You must provide blog description under 200 characters "})
        }
        if (!banner.length) {
            return res.status(403).json({error : "You must provide a blog banner to publish it"})
        }
        if(!content.blocks.length) {
            return res.json(403).json({error : "There must be some content to publish it "})
        }
        if (!tags.length || tags.length > 10) {
            return res.json(403).json({error : "Provide tags in order to publish the blog , Maximum 10 "})
        }
    }

    
   
    tags  = tags.map(tag => tag.toLowerCase());

    let blog_id = title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g , "-").trim() + nanoid()
    let blog = new Blog({
        title , des , banner , content , tags  , author : authodId , blog_id , draft : Boolean(draft)
    })
    blog.save().then(blog => {
        let incrementVal = draft ? 0 : 1;
        User.findOneAndUpdate({_id : authodId} ,{ $inc : {"account_info.total_posts" : incrementVal } , $push : {"blogs" : blog._id}})
        .then(user => {
            return res.status(200).json({id : blog.blog_id})
        })
        .catch(err => {
            return res.status(500).json({error : "Failed to update total number of piost"})
        })
    })
    .catch(err => {
        return res.status(500).json({error : err.message})
    })
})

app.listen(PORT , () => {
    console.log("Server is running on port " + PORT)
})
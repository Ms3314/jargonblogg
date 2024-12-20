// basic default imports 
import express from "express"
import mongoose from "mongoose";
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"
import { nanoid } from "nanoid";
import cors from "cors"

// schema imported here
import Blog from "./Schema/Blog.js"
import User from "./Schema/User.js"

// firebase authenitcation imports 
import admin from "firebase-admin";
// import serviceAccountKey from './jargon-blog-firebase-adminsdk-j8izb-43dd6bbe561.json' assert {type : "json" }
import {getAuth} from "firebase-admin/auth"

// aws imports 
import aws from "aws-sdk";

const app = express()
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
let PORT = process.env.PORT || 3000; 
// logic for firebase 

// creating an object that have all the content of serviceAcc

const serviceAccount = {
  "type": process.env.FIREBASE_TYPE,
  "project_id": process.env.FIREBASE_ID ,
  "private_key_id": process.env.FIREBASE_3,
  "private_key": process.env.FIREBASE_4 , 
  "client_email": process.env.FIREBASE_5,
  "client_id": process.env.FIREBASE_6,
  "auth_uri": process.env.FIREBASE_7,
  "token_uri": process.env.FIREBASE_8,
  "auth_provider_x509_cert_url": process.env.FIREBASE_9,
  "client_x509_cert_url": process.env.FIREBASE_10,
  "universe_domain": process.env.FIREBASE_11
}

admin.initializeApp({
    credential : admin.credential.cert(serviceAccount)
})

const corsOptions = {
    // origin: "https://blog-editor-frontend.onrender.com", // Allow your specific frontend domain
    origin : `${process.env.CLIENT_URL}` ,
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
  };
  
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

// Use cors middleware
// app.use(cors());

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


// this root is to display the data without any authentication 

app.post("/latest-blogs" , (req , res) => {
    let { page } = req.body
    let maxLimit = 5;

    Blog.find({draft : false })
    .populate("author" , "personal_info.username personal_info.fullname personal_info.profile_img -_id")
    .sort({"publishedAt" : -1 })
    .select("blog_id title des banner activity tags publishedAt -_id")
    .skip((page - 1)*maxLimit) //SO THIS FUNCTION SKIPS THE PAGES ... SO INITIALLY MY PAGE IS 1 , SO (1 - 1 ) * 5 THUS IT DOESNT SKIP ANYTHING SO U UNDERSTAND IT RIGHT 
    .limit(maxLimit)
    .then(blogs => {
        return res.status(200).json({ blogs : blogs})
    })
    .catch(err => {
        return res.status(500).json({error : err.message })
    })
})

app.post("/all-latest-blogs-count" ,  (req , res) => {
    Blog.countDocuments({draft : false})
    .then(count => {
        return res.status(200).json({ totalDocs : count })
    })
    .catch(err => {
        return res.status(500).json({error : err.message })
    })
} )


app.get("/trending-blog" , (req , res) => {
    Blog.find({draft : false})
    .populate("author" , "personal_info.username personal_info.fullname personal_info.profile_img -_id" )
    .sort({ "activity.total_reads" : -1 , "activity.total_likes" : -1 , "publishedAt" : -1 })
    .select("blog_id title publishedAt -_id")
    .limit(5)
    .then((blogs)=> {
        return res.status(200).json({blogs})
    })
    .catch(err => {
        return res.status(500).json({"error" : err.message})
    })
})

// this below root we will be using to filter the blogs and also to search the blogs 

app.post("/search-blogs" , (req , res) => {

    let { tag , page , author , query , limit , eliminate_blog} = req.body;
    let findQuery;

    if (tag) {
        findQuery = {tags : tag , draft:false , blog_id : {$ne : eliminate_blog} };
    } else if (query) {
        findQuery = {draft : false , title: new RegExp(query , 'i')}
    } else if (author) {
        findQuery = {draft : false , author}
    }

    let maxLimit = limit ? limit : 2;

    Blog.find(findQuery)
    .populate("author" , "personal_info.username personal_info.fullname personal_info.profile_img -_id")
    .sort({"publishedAt" : -1 })
    .select("blog_id title des banner activity tags publishedAt -_id")
    .skip((page - 1)*maxLimit)
    .limit(maxLimit)
    .then(blogs => {
        return res.status(200).json({ blogs : blogs})
    })
    .catch(err => {
        return res.status(500).json({error : err.message })
    })

} )

app.post("/search-blogs-count" , (req , res) => {
    let {tag , query , author} = req.body
    let findQuery;
    console.log("author serve ku aya ",author)
    if (tag) {
        findQuery = {tags : tag , draft:false };
    } else if (query) {
        findQuery = {draft : false , title: new RegExp(query , 'i')}
    } else if (author) {
        findQuery = {draft : false , author}
    }

    Blog.countDocuments(findQuery)
    .then(count => {
        return res.status(200).json({totalDocs : count})
    })
    .catch(err=> {
        console.log(err.message)
        return res.status(500).json({error : err.message})
    })
})

app.post("/search-users" , (req,res)=> {
    let {query} = req.body 
    User.find({ "personal_info.username" : new RegExp(query , 'i') })
    .limit(50)
    .select("personal_info.fullname personal_info.username personal_info.profile_img -_id")
    .then((users)=> {
        return res.status(200).json({users})
    }).catch(err => {
        return res.status(500).json({error : err.message})
    })
})

app.post("/get-profile" , (req , res) => {
    let {username} = req.body;
    User.findOne({ "personal_info.username" : username })
    .select("-personal_info.password -google_auth -updatedAt -blogs")
    .then((user) => {
        console.log(user)
        return res.status(200).json(user)
    })
    .catch((err)=>{
        return res.status(500).json({erroor : err.message})
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

app.post("/get-blog" , (req , res) => {
    let {blog_id} = req.body 
    let incremental = 1; 
    // yaha humlog blogkitne log pade dekhre 
    Blog.findOneAndUpdate({ blog_id }, {$inc : {"activity.total_reads" : incremental }}  )
    // the populate usually works for the Schema.Types.ObjectId wala thingy 
    .populate("author" , "personal_info.fullname personal_info.username personal_info.profile_img")
    .select("title des content banner activity publishedAt blog_id tags")
    .then(blog => {
        // ye mtlb humlog pick karre the author of this specific blog 
        // we increment on the blog as well as for the total reads for the user 
        User.findOneAndUpdate({"personal_info.username" : blog.author.personal_info. 
        username} , {$inc : {"account_info.total_reads" : incremental }})
        .catch(err => {
            res.status(500).json({error : err.message})
        })
        return res.status(200).json({ blog })
    })
    .catch(err => {
        return res.status(500).json({error : err.message})
    })
})


app.listen(PORT , () => {
    console.log("Server is running on port " + PORT)
})
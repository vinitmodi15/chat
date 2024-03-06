const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const Chat = require("./models/chat.js")
const methodOverride = require("method-override");
const ErrorExpress = require("./ErrorExpress.js")

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));


main()
.then(()=>{
    console.log("connection successfull");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}


function asyncwrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    }
}

//index route
app.get("/chats",asyncwrap(async (req,res)=>{
        let chats = await Chat.find();
    // console.log(chats);
    // res.send("successfully getting data")
    res.render("index.ejs",{chats})
    
}))

app.get("/chats/new",asyncwrap ((req,res)=>{

        res.render("newchat.ejs")
   
    // throw new ErrorExpress(401,"chat not")
    
}))

//new route for new chat
app.post("/chats",asyncwrap(async(req,res,next)=>{

        let{from,to,msg} = req.body;  
        let newchat = new Chat({
        from:from,
        to:to,
        msg:msg,
        created_at:new Date(),
        })
    // console.log(newchat);
        await newchat.save();
        res.redirect("/chats"); 
     
}))
//edit route
app.get("/chats/:id/edit",asyncwrap(async (req,res)=>{
        let {id} = req.params;
        let chat =  await Chat.findById(id);
        res.render("edit.ejs",{chat});
}))

//show route
app.get("/chats/:id",asyncwrap(async(req,res,next)=>{
        let {id} = req.params;
        let chat = await Chat.findById(id);
        // if(!chat){
        //     next (new ErrorExpress(401.,"not found"));
        // }
        res.render("edit.ejs",{chat});

}))

//update route

app.put("/chats/:id",asyncwrap(async (req,res)=>{
  
        let {id} = req.params;
        let {msg:newMsg} = req.body;
        let updatedChat = await Chat.findByIdAndUpdate(id,{msg:newMsg},{runValidators:true,new:true});
        console.log(updatedChat);
        res.redirect("/chats")
    
   
}))

//delete route

app.delete("/chats/:id",asyncwrap(async (req,res)=>{

        let {id} = req.params;
        let deletedChat = await Chat.findByIdAndDelete(id);
        console.log(deletedChat);
        res.redirect("/chats")
}))

const handleValidationError = (err)=>{
    console.log("this was a validation error");
    return(err);

}

app.use((err,req,res,next)=>{
    console.log(err.name);
    if(err.name === "ValidationError"){
        err= handleValidationError(err);
    }
    next(err);
})

app.use((err,req,res,next)=>{
    let {status = 500,message="chat not"} = err;
    res.status(status).send(message);
})

app.listen(8080,()=>{
    console.log(`listening to the port 8080`);
})
// let chat1 = new Chat({
//     from:"vinit",
//     to:"vijit",
//     msg:"hey buddy",
//     created_at:new Date(),
// });
// chat1.save().then(()=>{
//     console.log
// })
app.get("/",(req,res)=>{
    res.send("root is working");
})


//try catch one example
// app.get("/chats/:id",async(req,res,next)=>{
//     try{
//         let {id} = req.params;
//         let chat = await Chat.findById(id);
//         if(!chat){
//             next (new ErrorExpress(401.,"not found"));
//         }
//         res.render("edit.ejs",{chat});
//     } catch(err){
//         next(err);
//     }
// })   
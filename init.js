const mongoose = require('mongoose');
const Chat = require("./models/chat.js")
main()
.then(()=>{
    console.log("connection successfull");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}
let allchats = [{
    from:"vinit",
    to:"vijit",
    msg:"hey buddy",
    created_at:new Date(),
    },
    {
        from:"ronit",
        to:"mohit",
        msg:"hey buddy",
        created_at:new Date(),
    },
    {
        from:"rohit",
        to:"manu",
        msg:"hey buddy",
        created_at:new Date(),
    },
    {   
        from:"sumit",
        to:"vyas",
        msg:"hey buddy",
        created_at:new Date(),
    },
    {
        from:"bhandari",
        to:"modi",
        msg:"hey buddy",
        created_at:new Date(),
}];

Chat.insertMany(allchats);
// chat1.save().then((res)=>{
//     console.log(res)
// })
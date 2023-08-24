const mongoose=require('mongoose'); 

const Schema=mongoose.Schema;

const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
    },
    role:{
        type:String,
        default:'customer'
    },
}, { timestamps:true })

const User = mongoose.model('User',userSchema);

module.exports=User;
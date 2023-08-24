const mongoose=require('mongoose'); 

const Schema=mongoose.Schema;

const orderSchema=new Schema({
    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    items:{
        type:Object,
        required:true
    },
    phone:{
        type:String,
    },
    address:{
        type:String,
        required:true
    },
    paymentType:{
        type: String,
        default:'Cash on Delivery'
    },
    status:{
        type: String,
        default:'order_placed'
    },
}, { timestamps:true })

const Order = mongoose.model('Order',orderSchema);

module.exports=Order;
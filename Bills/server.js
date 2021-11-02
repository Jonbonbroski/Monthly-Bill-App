const express = require("express");
const cors = require('cors')
const PORT = 5000
const app = express()
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const model = mongoose.model


mongoose.connect("mongodb://localhost:27017/bills", {useNewUrlParser: true})


const BillSchema = new Schema({
    name : {
        type:String,
    },
    amount : {
        type:Number,
    },
    day : {
        type:String,
    } 
})


const Bills = model("bills",BillSchema)



app.use(cors());
app.use(express.json());


app.post("/addBill",(req,res)=>{
    console.log("request made to add")
    const addBill = new Bills({name: req.body.billName, amount:req.body.amount, day:req.body.day })

    addBill.save((err,result)=>{
        if(err){
            console.log(err)
            res.send({message:"Bill was not added"})
        }else{
        console.log(result)
        res.send(result)
        }
    })

})


app.get("/getBills",(req,res)=>{

    Bills.find({},(err,result)=>{
        if(err){
            console.log(err)
        }
        console.log(result)
        res.send(result)
    })
    
})


app.delete("/deleteBill",(req,res)=>{
    console.log("Delete request was made")
    Bills.deleteOne({name:req.body.name,amount:req.body.amount,day:req.body.day},(err,result)=>{
        if(err){
            console.log(err)
        }else{
        res.send(result);
        }
    })
})

app.put("/editBill",(req,res)=>{
    console.log("Edit request was made")
    Bills.updateOne({name:req.body.editName,amount:req.body.editAmount,day:req.body.editDay},{name:req.body.name,
    amount:req.body.amount, day:req.body.day},(err,result)=>{
        if(err){
            console.log(err)
        }else{
        res.send(result);
        }
    })
})

app.listen(PORT,(req,res)=>{
    console.log(`Server listening on port: ${PORT}`)
})
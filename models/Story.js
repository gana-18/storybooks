const { application, json } = require('express')
const mongoose=require('mongoose')
const StorySchema=new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trime:true
      },
      body: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        default: true,
        enum:['public','private']
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
})
module.exports=mongoose.model('Story',StorySchema)
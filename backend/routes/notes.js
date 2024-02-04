const express= require('express');
const fetchuser=require('./../middleware/fetchuser');
const notes= require('./../models/Notes');
const router= express.Router();
const { body, validationResult } = require("express-validator");
// const Notes = require('./../models/Notes');
//route to fetch all notes
router.get('/fetchallnotes',fetchuser,async(req,res)=>{
  try{const all_notes= await notes.find({user: req.user.id});
  console.log(all_notes);
  res.status(200).json(all_notes);
} catch(err){
    console.log(err.message);
        res.status(400).send("some error occured");
  }
});
//a new note
router.post('/addnote',fetchuser,[
    body('title',"enter a valid title").isLength({min:3}),
    body('description',"description must be atleast 5 characters").isLength({min:5})
],async(req,res)=>{
    try{const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const {title,description,tag}= req.body;
    const note=new notes({
     title,description,tag,user:req.user.id
    });
    const savedNote= await note.save();
    res.json(savedNote);}catch(err){
        console.log(err.message);
        res.status(400).send("some error occured");
    }
});
//update note
router.patch('/updatenote/:id',fetchuser,async(req,res)=>{
    try{const {title,description,tag}= req.body;
    const newNote= {};
    if(title) newNote.title=title;
    if(description) newNote.description=description;
    if(tag) newNote.tag=tag;
    //find the note to be update and update it
    var note= await notes.findById(req.params.id);
    if(!note) res.status(404).send("not found");
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("not allowed");
    }
    note=await notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});
    return res.json(note);}catch(err){
        console.log(err.message);
        res.status(400).send("some error occured");   
    }
});

router.delete('/deletenote/:id',fetchuser,async(req,res)=>{
    try{var note= await notes.findById(req.params.id);
    if(!note) res.status(404).send("not found");
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("not allowed");
    }
    note=await notes.findByIdAndDelete(req.params.id);
    return res.json(note);}catch(err){
        console.log(err.message);
        res.status(400).send("some error occured");
    }
});
module.exports=router;

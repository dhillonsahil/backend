const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes')
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

// Fetch all notres associated with the user using get "api/auth/getuser". Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        res.status(500).send("Internal Server error");
    }
})


// add  notes  get "api/auth/addnote". Login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Enter a valid note').isLength({ min: 1 })
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        // if any error send error response
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ error: errors.array() })
        }
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()
        res.json(savedNote)
    } catch (error) {
        res.status(500).send("Internal Server error");
    }
})

// route for update notes using PUt , login required "api/notes/updatenote/id"
router.put('/updatenote/:id', fetchuser, [
    body('title', 'Please enter a valid title').isLength({ min: 3 })
], async (req, res) => {
    const { title, description, tag } = req.body;
    // create a new note object
    const newNote = {};
    if (title) { newNote.title = title };
    if (description) { newNote.description = description };
    if (tag) { newNote.tag = tag };

    // find the note not found for user 
    let note =await Notes.findById(req.params.id);
    if (!note) {return res.status(404).send("Not found") }

    // check is user note and user same
    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not allowed")
    }

    note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }), { new: true }
    res.send({note})
})

// route for deleting note : DELETE "api/notes/deletenote/id"
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    
    // find the note to delete it
    let note =await Notes.findById(req.params.id);
    if (!note) { return res.status(404).send("Not found") }

    // allow note only if user owns this Note
    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not allowed")
    }

    note = await Notes.findByIdAndDelete(req.params.id)
    res.send({"Sucess":"Note has been deleted"})
})
module.exports = router;
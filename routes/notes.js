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


// add  notres  get "api/auth/addnote". Login required
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

module.exports = router;
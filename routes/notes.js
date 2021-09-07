const note = require("express").Router();
const uuid = require("../helpers/uuid");
const {
    readFromFile,
    readAndAppend,
    writeToFile,
  } = require('../helpers/fsUtils');

// GET Route for all notes
note.get("/notes", (req, res) => 
    readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)))
);

// GET Route for a specific note
note.get('/:id', (req, res) => {
    const noteId = req.params.id;
    readFromFile('./db/db.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
        const result = json.filter((note) => note.id === noteId);
        return result.length > 0
          ? res.json(result)
          : res.json("No note with that ID");
      });
  });

// POST Route for submitting new note
note.post("/", (req, res) => {
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
    // If all the required properties are present
    if (req.body) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
        id: uuid(),
      };
      readAndAppend(newNote, "./db/db.json");
      res.json("Note Added!");
    } else {
      res.error("Note did NOT add!!");
    }
  });

// DELETE Route for a specific tip
note.delete("/:id", (req, res) => {
    const noteId = req.params.id;
    readFromFile('./db/db.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
        // Make a new array of all notes except the one with the ID provided in the URL
        const result = json.filter((note) => note.id !== noteId);
  
        // Save that array to the filesystem
        writeToFile('./db/db.json', result);
  
        // Respond to the DELETE request
        res.json(`Item ${noteId} has been deleted 🗑️`);
      });
});

  module.exports = note;
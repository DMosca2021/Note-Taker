const express = require("express");
const path = require("path");
const fs = require("fs")
const uuid = require("./helpers/uuid")

const PORT = process.env.port || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, "./public/index.html"))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET Route for /api/notes
app.get("/api/notes", (req, res) => {
    res.json(db)
});

// GET Route for catch all
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

/**
 *  Function to write data to the JSON file given a destination and some content
 *  @param {string} destination The file you want to write to.
 *  @param {object} content The content you want to write to the file.
 *  @returns {void} Nothing
 */
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );
/**
 *  Function to read data from a given a file and append some content
 *  @param {object} content The content you want to append to the file.
 *  @param {string} file The path to the file you want to save to.
 *  @returns {void} Nothing
 */
const readAndAppend = (content, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

// POST Route for new note
app.post("/api/notes", (req, res) => {
    const { title, text } = req.body;

    if (req.body) {
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

// DELETE Route for deleting note
app.delete("/api/notes/:id", (req, res) => {
    const deleteNote = req.params.id;
    console.log(`Deleting note: ${deleteNote}`);
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if(err) {
            console.error(err);
        } else {
            const parsedData = JSON.parse(data);
            parsedData.forEach(element, i => {
                if (selectedNote === element.id) {
                    parsedData.splice(i, 1)
                }
            });
            writeToFile("./db/db.json", parsedData);
            res.json("Note Deleted!");
        };
    });
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
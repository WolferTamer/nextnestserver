const express = require('express');
const cors = require('cors')
const app = express();
const fs = require('fs')
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 3001;
const {db} = require('./db')
const initialize = require('./initializers')
if(process.argv.length > 2) {
 initialize(process.argv)
}

//Requires CORS headers to run on localhost with react app
app.use(cors());

//Reads every file inside /routes and uses them to initialize endpoints
fs.readdir('server/routes', (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }
  let filteredfiles = files.filter((file) => file.endsWith('.js'))

  for (let file of filteredfiles) {
    const methods = require(`./routes/${file}`);

    //We have to manually seperate each method since Express uses different functions for each one.
    if (methods["get"]) {
      app.get(methods["get"].route, methods["get"].execute)
      console.log(`Initialized GET Method at ${methods["get"].route}`)
    } if (methods["post"]) {
      app.post(methods["post"].route, methods["post"].execute)
      console.log(`Initialized POST Method at ${methods["post"].route}`)
    } if (methods["put"]) {
      app.put(methods["put"].route, methods["put"].execute)
      console.log(`Initialized put Method at ${methods["put"].route}`)
    } if (methods["delete"]) {
      app.delete(methods["delete"].route, methods["delete"].execute)
      console.log(`Initialized delete Method at ${methods["delete"].route}`)
    }
  }
});

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server Wow!" });
  });

//Start accepting HTTP requests
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
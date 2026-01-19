//import express from "express";

//const app = express();
//const PORT = process.env.PORT || 3000;

//app.use(express.json());

//app.get("/", (_req, res) => {
  //res.send("API is running");
//});

//app.listen(PORT, () => {
  //console.log(`Server listening on port ${PORT}`);
//});

import app from "./app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const express = require("express");
const cors = require("cors");
const tareaRoutes = require("./routes/tarea.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API TaskFlow Solutions funcionando");
});

app.use("/api/tareas", tareaRoutes);

module.exports = app;
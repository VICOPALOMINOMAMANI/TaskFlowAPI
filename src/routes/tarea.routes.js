const express = require("express");

const router = express.Router();

const {
    listarTareas,
    obtenerTarea,
    crearTarea,
    actualizarTarea,
    eliminarTarea
} = require("../controllers/tarea.controller");

router.get("/", listarTareas);

router.get("/:id", obtenerTarea);

router.post("/", crearTarea);

router.put("/:id", actualizarTarea);

router.delete("/:id", eliminarTarea);

module.exports = router;
const { sql, poolPromise } = require("../config/db");

// Listar tareas (con filtros opcionales)
const listarTareas = async (req, res) => {
  try {
    const { usuario_asignado, estado, prioridad } = req.query;

    const pool = await poolPromise;

    let query = "SELECT * FROM tareas WHERE 1=1";

    const request = pool.request();

    if (usuario_asignado) {
      query += " AND usuario_asignado = @usuario_asignado";
      request.input("usuario_asignado", sql.VarChar, usuario_asignado);
    }

    if (estado) {
      query += " AND estado = @estado";
      request.input("estado", sql.VarChar, estado);
    }

    if (prioridad) {
      query += " AND prioridad = @prioridad";
      request.input("prioridad", sql.VarChar, prioridad);
    }

    const result = await request.query(query);

    res.json(result.recordset);

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al listar tareas",
      error: error.message
    });
  }
};

// Obtener una tarea por ID
const obtenerTarea = async (req, res) => {
  try {

    const pool = await poolPromise;

    const result = await pool.request()
      .input("id", sql.Int, req.params.id)
      .query("SELECT * FROM tareas WHERE id=@id");

    if (result.recordset.length === 0) {
      return res.status(404).json({
        mensaje: "Tarea no encontrada"
      });
    }

    res.json(result.recordset[0]);

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener tarea",
      error: error.message
    });
  }
};

// Crear tarea
const crearTarea = async (req, res) => {

  try {

    const {
      titulo,
      descripcion,
      prioridad,
      estado,
      usuario_asignado
    } = req.body;

    const pool = await poolPromise;

    await pool.request()
      .input("titulo", sql.VarChar, titulo)
      .input("descripcion", sql.VarChar, descripcion)
      .input("prioridad", sql.VarChar, prioridad)
      .input("estado", sql.VarChar, estado)
      .input("usuario_asignado", sql.VarChar, usuario_asignado)
      .query(`
        INSERT INTO tareas
        (titulo, descripcion, prioridad, estado, usuario_asignado)
        VALUES
        (@titulo,@descripcion,@prioridad,@estado,@usuario_asignado)
      `);

    res.status(201).json({
      mensaje: "Tarea registrada correctamente"
    });

  } catch (error) {

    res.status(500).json({
      mensaje: "Error al crear tarea",
      error: error.message
    });

  }

};

// Actualizar tarea
const actualizarTarea = async (req, res) => {

  try {

    const {
      titulo,
      descripcion,
      prioridad,
      estado,
      usuario_asignado
    } = req.body;

    const pool = await poolPromise;

    await pool.request()
      .input("id", sql.Int, req.params.id)
      .input("titulo", sql.VarChar, titulo)
      .input("descripcion", sql.VarChar, descripcion)
      .input("prioridad", sql.VarChar, prioridad)
      .input("estado", sql.VarChar, estado)
      .input("usuario_asignado", sql.VarChar, usuario_asignado)
      .query(`
        UPDATE tareas
        SET
        titulo=@titulo,
        descripcion=@descripcion,
        prioridad=@prioridad,
        estado=@estado,
        usuario_asignado=@usuario_asignado
        WHERE id=@id
      `);

    res.json({
      mensaje: "Tarea actualizada correctamente"
    });

  } catch (error) {

    res.status(500).json({
      mensaje: "Error al actualizar tarea",
      error: error.message
    });

  }

};

// Eliminar tarea
const eliminarTarea = async (req, res) => {

  try {

    const pool = await poolPromise;

    await pool.request()
      .input("id", sql.Int, req.params.id)
      .query("DELETE FROM tareas WHERE id=@id");

    res.json({
      mensaje: "Tarea eliminada correctamente"
    });

  } catch (error) {

    res.status(500).json({
      mensaje: "Error al eliminar tarea",
      error: error.message
    });

  }

};

module.exports = {
  listarTareas,
  obtenerTarea,
  crearTarea,
  actualizarTarea,
  eliminarTarea
};
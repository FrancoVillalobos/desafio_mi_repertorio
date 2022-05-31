const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "admin",
    port: 5432,
    database: "repertorio",
    max: 20,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 2000
});

// Función asíncrona que recibe el parámetro datos y lo inserta en la BD
const insertar = async (datos) => {
    const consulta = {
        text: "INSERT INTO repertorio values(DEFAULT, $1, $2, $3) RETURNING *",
        values: datos,
    };

    try {
        const result = await pool.query(consulta);
        return result; 

    } catch (error) {
        //console.log(error.code); 
        return error; 
    }
}

//Función asíncrona para consulta
const consultar = () =>{
    return new Promise(async (resolve, reject) => {
        try {
            const result = await pool.query("SELECT * FROM repertorio;")
            resolve(result);
            
        } catch (error) {
            reject(error);
        }
    })
}

//Funcion asíncrona para edición
const editar = async (id, datos) => {
    const consulta = {
        text: `UPDATE repertorio SET cancion=$1, artista=$2, tono=$3 WHERE id=${id} RETURNING *`,
        values: datos,
    };
    try {
        const result = await pool.query(consulta);
        return result;
    } catch (error) {
        console.log(error.code);
        return error;
    }
}

//Funcion asíncrona para eliminar
const eliminar = async (id) => {
    try {
        const result = await pool.query(`DELETE FROM repertorio WHERE id = '${id}'`);
        return result;
    } catch (error) {
        console.log(error.code);
        return error;
    }
}

//Exportar módulos
module.exports = { insertar, consultar, editar, eliminar};

const http = require('http');
const url = require('url');
const fs = require('fs');
const { insertar, consultar, editar, eliminar } = require('./consultas');

// id, canción, artista, tono

http.createServer(async (req, res) => {

    if (req.url == '/' && req.method === 'GET') {
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 200;
        const html = fs.readFileSync('./index.html', "utf8");
        res.end(html);
    }

    // Petición POST para agregar una cancion
    if (req.url == '/cancion' && req.method === 'POST') {
        res.setHeader('Content-Type', 'application/json');
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', async () => {
            //console.log(body);
            const datos = Object.values(JSON.parse(body));
            const respuesta = await insertar(datos);
            res.end(JSON.stringify(respuesta));
        });
    }

    // Petición GET para obtener todas las canciones
    if (req.url == '/canciones' && req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json');
        const result = await consultar();
        res.end(JSON.stringify(result.rows));
    }

    // Petición PUT para editar una cancion
    if (req.url.startsWith("/cancion?") && req.method === 'PUT') {
        const { id } = url.parse(req.url, true).query;
        //console.log(id)
        res.setHeader('Content-Type', 'application/json');
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', async () => {
            const datos = Object.values(JSON.parse(body));
            const result = await editar(id, datos);
            res.statusCode = 200;
            console.log(result);
            res.end(JSON.stringify(result));
        });
    }
    // Petición DELETE para eliminar una cancion
    if (req.url.startsWith('/cancion?') && req.method == 'DELETE') {
        const { id } = url.parse(req.url, true).query;
        console.log(id)
        const respuesta = await eliminar(id);
        res.end(JSON.stringify(respuesta));
    }

}).listen(3000, console.log("Servidor corriendo en http://localhost:3000/"))
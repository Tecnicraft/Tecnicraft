const http = require('http');

const server = http.createServer((req, res) => {
 res.end('¡Hola Mundo esto es una Prueba!')
})

server.listen(3000);
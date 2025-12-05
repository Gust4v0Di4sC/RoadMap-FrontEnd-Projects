import http from "http";

const server = http.createServer((req, res) => {
  res.end("Servidor rodando!");
});

server.listen(3000, () => console.log("Rodando na porta 3000"));

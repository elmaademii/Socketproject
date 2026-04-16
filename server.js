const net = require("net");
const fs = require("fs");
const path = require("path");

const PORT = 5000;
const HOST = "0.0.0.0"; 

const dir = "./server_files";
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

let adminIP = null; 

const server = net.createServer((socket) => {
    const clientIP = socket.remoteAddress.replace(/^.*:/, '');
    console.log(`[+] Klient i ri u lidh nga IP: ${clientIP}`);

    socket.write("MIRËSEERDHËT NË SERVER!\nKomandat: AUTH <pass>, READ, WRITE <emri> <teksti>, EXECUTE ls, MSG <teksti>\n");

    socket.on("data", (data) => {
        const input = data.toString().trim();
        console.log(`[${clientIP}]: ${input}`);

        fs.appendFileSync("log.txt", `[${clientIP}]: ${input}\n`);

        const parts = input.split(" ");
        const command = parts[0].toUpperCase();
        const arg1 = parts[1];
        const content = parts.slice(2).join(" ");

        const isAdmin = (clientIP === adminIP);



        // pjesa e try catch dhe logjika kryesore e ketij projekti. 
        // Duhet te perfshihe case per autentifikim, read, write dhe execute
        try {
           
        } catch (error) {

        }
    });

    socket.on("error", (err) => console.log(`Gabim me klientin ${clientIP}:`, err.message));
    
    socket.on("end", () => console.log(`[-] Klienti ${clientIP} u shkëput`));
});
server.listen(PORT, HOST, () => {
    console.log(`[!] Serveri po dëgjon në ${HOST}:${PORT}`);
});

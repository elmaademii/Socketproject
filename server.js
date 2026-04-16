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

        try {
            switch (command) {
             case "AUTH": 
                    if (arg1 === "admin123") {
                        adminIP = clientIP;
                        socket.write("SERVER: Jeni autorizuar si ADMIN (READ, WRITE, EXECUTE).\n");
                    } else {
                        socket.write("SERVER: Fjalëkalim i gabuar!\n");
                    }
                    break;

             case "READ":
                    const files = fs.readdirSync(dir);
                    socket.write(`FILES: ${files.join(", ")}\n`);
                    break;

             case "WRITE": 
                    if (!isAdmin) return socket.write("GABIM: Nuk keni privilegje WRITE!\n");
                    if (!arg1 || !content) return socket.write("Përdorni: WRITE <file.txt> <teksti>\n");
                    
                    fs.writeFileSync(path.join(dir, arg1), content);
                    socket.write(`SERVER: File '${arg1}' u krijua me sukses.\n`);
                    break;

             case "EXECUTE":
                    if (!isAdmin) return socket.write("GABIM: Nuk keni privilegje EXECUTE!\n");
                    if (arg1 === "ls") {
                        const info = fs.statSync(dir);
                        socket.write(`SERVER EXEC: Folderi u krijua më ${info.birthtime}\n`);
                    } else {
                        socket.write("SERVER: Komandë ekzekutimi e panjohur.\n");
                    }
                    break;

             case "MSG":
                    socket.write(`SERVER: Mesazhi u pranua.\n`);
                    break;

             default:
                    socket.write("SERVER: Komandë e panjohur.\n");
            }
        } catch (err) {
            socket.write(`GABIM SERVERI: ${err.message}\n`);
        }
    });

    socket.on("error", (err) => console.log(`Gabim me klientin ${clientIP}:`, err.message));
    
    socket.on("end", () => console.log(`[-] Klienti ${clientIP} u shkëput`));
});
server.listen(PORT, HOST, () => {
    console.log(`[!] Serveri po dëgjon në ${HOST}:${PORT}`);
});
try {
switch (command) {
case "AUTH":
if (arg1 === "admin123") {
adminIP = clientIP;
socket.write("SERVER: Jeni autorizuar si ADMIN (READ, WRITE, EXECUTE).\n");
} else {
socket.write("SERVER: Fjalëkalim i gabuar!\n");
}
break;

case "READ":
const files = fs.readdirSync(dir);
socket.write(`FILES: ${files.join(", ")}\n`);
break;

case "WRITE":
if (!isAdmin) return socket.write("GABIM: Nuk keni privilegje WRITE!\n");
if (!arg1 || !content) return socket.write("Përdorni: WRITE <file.txt> <teksti>\n");

fs.writeFileSync(path.join(dir, arg1), content);
socket.write(`SERVER: File '${arg1}' u krijua me sukses.\n`);
break;

case "EXECUTE":
if (!isAdmin) return socket.write("GABIM: Nuk keni privilegje EXECUTE!\n");
if (arg1 === "ls") {
const info = fs.statSync(dir);
socket.write(`SERVER EXEC: Folderi u krijua më ${info.birthtime}\n`);
} else {
socket.write("SERVER: Komandë ekzekutimi e panjohur.\n");
}
break;

case "MSG":
socket.write(`SERVER: Mesazhi u pranua.\n`);
break;

default:
socket.write("SERVER: Komandë e panjohur.\n");
}
} catch (err) {
socket.write(`GABIM SERVERI: ${err.message}\n`);
}

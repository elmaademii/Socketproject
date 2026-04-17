const net = require("net");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const PORT = 5001;
const HOST = "0.0.0.0";

const dir = "./server_files";
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

let admins = [];
let clients = [];

const server = net.createServer((socket) => {
    const clientIP = socket.remoteAddress.replace(/^.*:/, '');
    console.log(`[+] Klient i ri: ${clientIP}`);

    clients.push(socket);

    socket.write(
        "MIRËSEVINI!\n" +
        "Komandat:\n" +
        "AUTH <pass>\n" +
        "READ\n" +
        "READFILE <file>\n" +
        "WRITE <file> <text>\n" +
        "EXECUTE <cmd>\n" +
        "MSG <text>\n" +
        "READCHAT\n"
    );

    socket.on("data", (data) => {
        const input = data.toString().trim();
        console.log(`[${clientIP}]: ${input}`);

        fs.appendFileSync("log.txt", `[${clientIP}]: ${input}\n`);

        const parts = input.split(" ");
        const command = parts[0].toUpperCase();
        const arg1 = parts[1];
        const content = parts.slice(2).join(" ");

        const isAdmin = admins.includes(clientIP);

        try {
            switch (command) {

                case "AUTH":
                    if (arg1 === "admin123") {
                        if (!admins.includes(clientIP)) {
                            admins.push(clientIP);
                        }
                        socket.write("SERVER: Jeni ADMIN.\n");
                    } else {
                        socket.write("SERVER: Password gabim.\n");
                    }
                    break;

                case "READ":
                    const files = fs.readdirSync(dir);
                    socket.write(`FILES: ${files.join(", ")}\n`);
                    break;

                case "READFILE":
                    if (!arg1) return socket.write("Përdor: READFILE file.txt\n");

                    const filePath = path.join(dir, arg1);
                    if (!fs.existsSync(filePath)) {
                        return socket.write("File nuk ekziston!\n");
                    }

                    const dataFile = fs.readFileSync(filePath);
                    socket.write(`\n--- ${arg1} ---\n${dataFile}\n`);
                    break;

                case "WRITE":
                    if (!isAdmin) return socket.write("Nuk ke WRITE permission!\n");
                    if (!arg1 || !content) {
                        return socket.write("Përdor: WRITE file.txt tekst\n");
                    }

                    fs.writeFileSync(path.join(dir, arg1), content);
                    socket.write("File u krijua me sukses.\n");
                    break;

                case "EXECUTE":
                    if (!isAdmin) return socket.write("Nuk ke EXECUTE permission!\n");

                    exec(arg1, (err, stdout, stderr) => {
                        if (err) return socket.write(`Error: ${err.message}\n`);
                        if (stderr) return socket.write(`STDERR: ${stderr}\n`);
                        socket.write(`OUTPUT:\n${stdout}\n`);
                    });
                    break;

                case "MSG":
                    const message = content;

                    // ruaj në text.txt
                    fs.appendFileSync("text.txt", `[${clientIP}]: ${message}\n`);

                    // dërgo te klientët tjerë
                    clients.forEach((client) => {
                        if (client !== socket) {
                            client.write(`[${clientIP}]: ${message}\n`);
                        }
                    });

                    socket.write("Mesazhi u ruajt dhe u dërgua.\n");
                    break;

                case "READCHAT":
                    if (!fs.existsSync("text.txt")) {
                        return socket.write("text.txt nuk ekziston!\n");
                    }

                    const chat = fs.readFileSync("text.txt", "utf8");
                    socket.write(`\n--- CHAT HISTORY ---\n${chat}\n`);
                    break;

                default:
                    socket.write("Komandë e panjohur.\n");
            }
        } catch (err) {
            socket.write(`GABIM: ${err.message}\n`);
        }
    });

    socket.on("end", () => {
        console.log(`[-] ${clientIP} u shkëput`);
        clients = clients.filter(c => c !== socket);
    });

    socket.on("error", (err) => {
        console.log(`Gabim: ${err.message}`);
    });
});

server.listen(PORT, HOST, () => {
    console.log(`Serveri po dëgjon në ${HOST}:${PORT}`);
});
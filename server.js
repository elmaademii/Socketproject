const net = require("net");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const PORT = 5001;
const HOST = "0.0.0.0";

// Folderi kryesor
const dir = path.join(__dirname, "server_files");
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

<<<<<<< HEAD
// log file brenda server_files
const logPath = path.join(dir, "log.txt");
if (!fs.existsSync(logPath)) fs.writeFileSync(logPath, "");

let admins = [];
=======
>>>>>>> d8d3f2a08e8df0a1eb22edd20d7187430b9ade79
let clients = [];

const server = net.createServer((socket) => {
    const clientIP = socket.remoteAddress.replace(/^.*:/, '');
    const clientPort = socket.remotePort;
    const clientID = `${clientIP}:${clientPort}`;
    console.log(`[+] Klient i ri: ${clientIP}`);

    socket.isAdmin = false;
    clients.push(socket);

    socket.write(`SERVER: MIRËSEVINI ${clientID}!\n`);
    socket.write("Komandat:\nAUTH admin123 | READ | READFILE <file> | WRITE <file> <text> | EXECUTE <cmd> | MSG <text> | READCHAT\n");

    socket.on("data", (data) => {
        const input = data.toString().trim();
        if (!input) return;

        console.log(`[${clientIP}]: ${input}`);

<<<<<<< HEAD
        // LOG në file korrekt
        fs.appendFileSync(logPath, `[${clientIP}]: ${input}\n`);
=======
       try {
            fs.appendFileSync("log.txt", `[${clientID}]: ${input}\n`);
        } catch (e) {
            console.error("Log gabim:", e);
        }
>>>>>>> d8d3f2a08e8df0a1eb22edd20d7187430b9ade79

        const spaceIndex = input.indexOf(" ");

        let command = input.toUpperCase();
        let rest = "";

        if (spaceIndex !== -1) {
            command = input.substring(0, spaceIndex).toUpperCase();
            rest = input.substring(spaceIndex + 1);
        }

        const args = rest.split(" ");
        const arg1 = args[0];

        try {
            switch (command) {

                case "AUTH":
                    if (arg1 === "admin123") {

                        if (!admins.includes(clientIP)) admins.push(clientIP);
                        socket.write("SERVER: Jeni ADMIN.\n");

                        socket.isAdmin = true;
                        socket.write("Jeni ADMIN! (WRITE/EXECUTE OK)\n");

                    } else {
                        socket.write("Password gabim!\n");
                    }
                    break;

                case "READ":
                    const files = fs.readdirSync(dir);
                    socket.write(`FILES: ${files.join(", ") || "Bosh"}\n`);
                    break;

                case "READFILE":
                    if (!arg1) {
                        socket.write("Përdor: READFILE <file>\n");
                        break;
                    }

                    const safeReadFile = path.basename(arg1);
                    const filePath = path.join(dir, safeReadFile);

                    if (!fs.existsSync(filePath)) {
                        socket.write("File nuk ekziston\n");
                        break;
                    }

                    const fileData = fs.readFileSync(filePath, "utf8");
                    socket.write(`${safeReadFile}:\n${fileData}\n---\n`);
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

                    fs.appendFileSync(path.join(dir, "text.txt"), `[${clientIP}]: ${message}\n`);

                    clients.forEach((client) => {
                        if (client !== socket) {
                            client.write(`[${clientIP}]: ${message}\n`);
                        }
                    });

                    socket.write("Mesazhi u ruajt dhe u dërgua.\n");
                    break;

                case "READCHAT":
                    const chatPath = path.join(dir, "text.txt");

                    if (!fs.existsSync(chatPath)) {
                        return socket.write("text.txt nuk ekziston!\n");
                    }

                    const chat = fs.readFileSync(chatPath, "utf8");
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
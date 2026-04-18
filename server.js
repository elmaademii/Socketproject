const net = require("net");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const PORT = 5001;
const HOST = "0.0.0.0";

const dir = "./server_files";
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

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

       try {
            fs.appendFileSync("log.txt", `[${clientID}]: ${input}\n`);
        } catch (e) {
            console.error("Log gabim:", e);
        }

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
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
    
    console.log(`[+] Klient: ${clientID}`);
    
    socket.isAdmin = false;  
    clients.push(socket);

    socket.write(`SERVER: MIRËSEVINI ${clientID}!\n`);
    socket.write("Komandat:\nAUTH admin123 | READ | READFILE <file> | WRITE <file> <text> | EXECUTE <cmd> | MSG <text> | READCHAT\n");

    socket.on("data", (data) => {
        const input = data.toString().trim();
        if (!input) return;

        console.log(`[${clientID}]: ${input}`);

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
                    if (!socket.isAdmin) {
                        socket.write("Vetëm ADMIN! Bëj AUTH\n");
                        break;
                    }

                    if (!arg1 || !rest) {
                        socket.write("Përdor: WRITE <file> <text>\n");
                        break;
                    }

                    const safeWriteFile = path.basename(arg1);
                    const text = rest.substring(arg1.length + 1);
                    fs.writeFileSync(path.join(dir, safeWriteFile), text);

                    socket.write(`'${safeWriteFile}' u krijua / përditësua!\n`);
                    break;

                case "EXECUTE":
                    if (!socket.isAdmin) {
                        socket.write("Vetëm ADMIN!\n");
                        break;
                    }

                    if (!rest) {
                        socket.write("Përdor: EXECUTE <cmd>\n");
                        break;
                    }

                    exec(rest, (err, stdout, stderr) => {
                        if (err) {
                            socket.write(`Error: ${err.message}\n`);
                            return;
                        }
                        if (stderr) socket.write(stderr + "\n");
                        socket.write(stdout || "OK\n");
                    });
                    break;

                case "MSG":
                    if (!rest) {
                        socket.write("Përdor: MSG <teksti>\n");
                        break;
                    }

                    clients.forEach(client => {
                        if (!client.destroyed) {
                            client.write(`${clientID}: ${rest}\n`);
                        }
                    });
                    break;

                case "READCHAT":
                    if (!fs.existsSync("log.txt")) {
                        socket.write("Chat/Log bosh\n");
                        break;
                    }

                    const chat = fs.readFileSync("log.txt", "utf8");
                    socket.write(`CHAT/LOG:\n${chat}\n---\n`);
                    break;

                default:
                    socket.write("Komandë e panjohur.\n");
            }

        } catch (err) {
            socket.write(`Gabim: ${err.message}\n`);
            console.error(`${clientID} error:`, err);
        }
    });

    const removeClient = () => {
        console.log(`[-] ${clientID} disconnect`);
        clients = clients.filter(c => c !== socket);
    };

    socket.on("end", removeClient);

    socket.on("error", (err) => {
        console.log(`${clientID} error:`, err.message);
        removeClient();
    });

    socket.setTimeout(300000);
    socket.on("timeout", () => {
        socket.end("Timeout\n");
        removeClient();
    });
});

server.on("error", (err) => {
    console.error("Server error:", err.code || err.message);
});

server.listen(PORT, HOST, () => {
    console.log(`Server në ${HOST}:${PORT}`);
});

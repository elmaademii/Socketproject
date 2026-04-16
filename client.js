const net = require("net");
const readline = require("readline");

// NDERHYRJE KETU
const HOST = "127.0.0.1"; 
const PORT = 5000;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const client = new net.Socket();

client.on("error", (err) => {
    console.log("[-] GABIM: Nuk u lidh me serverin. Sigurohuni që IP është e saktë dhe serveri është 'On'.");
    process.exit();
});

client.connect(PORT, HOST, () => {
    console.log(`[+] U lidhët me serverin në ${HOST}:${PORT}`);
    prompt();
});

client.on("data", (data) => {
    console.log(`\n[Përgjigje]: ${data.toString()}`);
    prompt();
});

function prompt() {
    rl.question("Shkruaj komandën: ", (input) => {
        if (input.toLowerCase() === "exit") {
            client.destroy();
            process.exit();
        }
        client.write(input);
    });
}

client.on("close", () => {
    console.log("\n[-] Lidhja u mbyll.");
    process.exit();
});
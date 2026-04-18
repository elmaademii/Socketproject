const net = require("net");
const readline = require("readline");

const HOST = "192.168.1.9"; 
const PORT = 5001;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "Komanda: " 
});

const client = new net.Socket();

client.connect(PORT, HOST, () => {
    console.log(`U lidhët me serverin ${HOST}:${PORT}`);
    rl.prompt(); 
});

client.on("data", (data) => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    
    console.log(`SERVER: ${data.toString().trim()}`);
    
    rl.prompt();
});

client.on("error", (err) => {
    console.log(`\nGabim gjatë lidhjes: ${err.message}`);
});

client.on("close", () => {
    console.log("\nLidhja u mbyll.");
    process.exit();
});

rl.on("line", (input) => {
    const command = input.trim();

    if (command.toLowerCase() === "exit") {
        client.end();
        return;
    }

    if (command) {
        client.write(command);
    }
    rl.prompt();
});
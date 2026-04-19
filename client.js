const net = require("net");
const readline = require("readline");

const HOST = "172.20.10.3";
const PORT = 5001;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const client = new net.Socket();

client.connect(PORT, HOST, () => {
    console.log(`U lidhët me serverin ${HOST}:${PORT}`);
    prompt();
});

client.on("data", (data) => {
    console.log("\nSERVER:", data.toString());
    prompt();
});

client.on("error", () => {
    console.log("Nuk u lidh me serverin!");
});



function prompt() {
    rl.question("Komanda: ", (input) => {
        if (input === "exit") {
            client.destroy();
            return;
        }
        client.write(input);
    });
}


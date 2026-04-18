Server & Client – Rrjetat Kompjuterike
Përshkrimi i Projektit

Ky projekt implementon një sistem komunikimi Client-Server duke përdorur Node.js (TCP sockets).

Serveri pranon lidhje nga shumë klientë dhe u mundëson atyre të komunikojnë, të lexojnë dhe të shkruajnë në file, si dhe të ekzekutojnë komanda (në varësi të privilegjeve).

Qëllimi
Të implementohet komunikimi Client-Server
Të përdoren socket TCP në Node.js
Të menaxhohen klientë të shumtë njëkohësisht
Të implementohen privilegje (ADMIN vs USER)
Të ruhet komunikimi në log
⚙️ Si funksionon
🔹 Serveri
Vendoset IP dhe porti
Serveri dëgjon (listen) për lidhje nga klientët
Pranon kërkesa (request) nga klientët
Lexon dhe përpunon mesazhet
Menaxhon file në folderin server_files
Ruajnë të gjitha mesazhet në log.txt
🔹 Klienti
Krijon lidhje me serverin përmes IP dhe portit
Dërgon komanda nga terminali
Merr përgjigje nga serveri

 Komandat
AUTH admin123 → bëhesh ADMIN
READ → liston file-t
READFILE <file> → lexon një file
WRITE <file> <text> → shkruan në file (vetëm ADMIN)
EXECUTE <cmd> → ekzekuton komandë (ADMIN)
MSG <text> → dërgon mesazh te të gjithë klientët
READCHAT → lexon log-un
exit → del nga klienti

▶️ Si të ekzekutohet
Sigurohu që ke të instaluar Node.js
Starto serverin:
node server.js
Starto klientin:
node client.js
(Opsionale) Ndrysho IP në client.js nëse serveri është në pajisje tjetër

📁 Struktura e Projektit
project/
│
├── server.js
├── client.js
├── log.txt
├── server_files/
└── README.md

Siguria & Privilegjet
Vetëm klienti që bën AUTH admin123 është ADMIN
ADMIN ka akses në:
WRITE
EXECUTE

Log / Chat
Të gjitha mesazhet ruhen në: log.txt


Punuar nga
Aulona Xhema
Aurela Kajtazi
Elma Ademi
# Server & Client – Rrjetat Kompjuterike

## Përshkrimi i Projektit
Ky projekt implementon një sistem komunikimi Client-Server duke përdorur Node.js (TCP sockets).

Serveri pranon lidhje nga shumë klientë dhe u mundëson atyre të komunikojnë, të lexojnë dhe të shkruajnë në file, si dhe të ekzekutojnë komanda në varësi të privilegjeve.

## Qëllimi
- Implementimi i komunikimit Client-Server
- Përdorimi i TCP sockets në Node.js
- Menaxhimi i klientëve të shumtë njëkohësisht
- Implementimi i privilegjeve (ADMIN dhe USER)
- Ruajtja e komunikimit në log

## Si funksionon

### Serveri
- Vendoset IP dhe porti
- Dëgjon për lidhje nga klientët
- Pranon dhe përpunon kërkesa
- Menaxhon file në folderin `server_files`
- Ruajnë mesazhet në `log.txt`

### Klienti
- Lidhet me serverin përmes IP dhe portit
- Dërgon komanda nga terminali
- Merr përgjigje nga serveri

## Komandat
- AUTH admin123 – bëhesh ADMIN
- READ – liston file-t
- READFILE <file> – lexon një file
- WRITE <file> <text> – shkruan në file (vetëm ADMIN)
- EXECUTE <cmd> – ekzekuton komandë (ADMIN)
- MSG <text> – dërgon mesazh te klientët
- READCHAT – lexon log-un
- exit – del nga klienti

## Si të ekzekutohet
node server.js  
node client.js  

Ndrysho IP në `client.js` nëse serveri është në pajisje tjetër.

## Struktura e Projektit
project/
- server.js
- client.js
- log.txt
- server_files/
- README.md

## Siguria dhe privilegjet
Vetëm klienti që bën AUTH admin123 është ADMIN.  
ADMIN ka akses në WRITE dhe EXECUTE.

## Log
Të gjitha mesazhet ruhen në log.txt.

## Punuar nga
- Aulona Xhema  
- Aurela Kajtazi  
- Elma Ademi  
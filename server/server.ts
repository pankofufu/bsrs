import { WebSocket, WebSocketServer } from 'ws';
import { spawn } from 'child_process';

const socketPort = 8049;

const connections: Map<Number, WebSocket> = new Map();
const wss = new WebSocketServer({ port: socketPort });
const process = spawn('nc -l -p 514 -u', {shell:true,stdio:['ignore', 'pipe', 'pipe']});

var rateChange = false;

var internetDown = false;
var voiceDown = false;

wss.on('connection', function connection(ws) {

    const id = connections.size;
    console.log(`WS#${id} has connected`);
    connections.set(id, ws);
    ws.send(JSON.stringify( {internetDown: internetDown, voiceDown: voiceDown, log: 'Connected'} ));
    ws.on('close', () => { connections.delete(id);console.log(`WS#${id} has disconnected`) });

});

process.stdout.on('data', (data) => {
    const line = (data.toString() as string).trimEnd();
    if ( line.includes('msg=linkreestablish') ) return; // Who cares
    if (line.includes('Rate Change') && !rateChange) {
        rateChange = true;
        setTimeout(()=>{ rateChange = false }, 3000);
    }

    if (line.includes('WAN link DOWN.')) internetDown = true;
    if (line.includes('WAN link UP.')) internetDown = false;


    if (line.includes('Voice Connected')) voiceDown = false;
    if (line.includes('Voice IP Connection Down')) voiceDown = true;


    connections.forEach(connection => {connection.send(JSON.stringify( {internetDown: internetDown, voiceDown: voiceDown, log: line} ));});
});

console.log(`WSS -> localhost:${socketPort}`);
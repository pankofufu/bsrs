import { change } from "./lights";
import { sound, time } from "./middleman";

let ws: WebSocket;

const configBox = document.getElementById("configBox");
const configError = document.getElementById("configError");
const wssBox = document.getElementById("wssBox");
const connectButton = document.getElementById("connectButton");

const controlBox = document.getElementById("controlBox");
const controlLog = document.getElementById("controlLog");
const saveLogButton = document.getElementById("saveLogButton");

const horizontalDiv = document.getElementById("horizontalDiv");
const humanLog = document.getElementById("humanLog");

// const headerStatus = document.getElementById("headerStatus");

var internetDown = false;
var voiceDown = true;

if (
  !configBox ||
  !wssBox ||
  !connectButton ||
  !configError ||
  !controlBox ||
  !controlLog ||
  // !headerStatus ||
  !saveLogButton ||
  !horizontalDiv ||
  !humanLog
)
  throw new Error("Elements are missing");

// export const log = (line: string) => (headerStatus.innerText = line); // Ease

wssBox.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    connectButton.click();
  }
});

connectButton.onclick = () => {
  // log("Connecting...");
  configBox.hidden = true;
  ws = new WebSocket(`ws://${(wssBox as HTMLInputElement).value}:8049`); // TypeScript at its peak
  ws.onerror = () => {
    // log("Failed to connect");
    configBox.hidden = false;
    configError.hidden = false;
    configError.innerText = "There was an error connecting to the WSS.";

    ws.onerror = () => {}; /* Reset */
  };

  ws.onopen = () => {
    // log("Connected to WSS");
    setup();
  };
};

saveLogButton.onclick = () => {
  const link = document.createElement("a");
  const file = new Blob([controlLog.innerText], { type: "text/plain" });
  link.href = URL.createObjectURL(file);
  link.download = "sky.log";
  link.click();
  URL.revokeObjectURL(link.href);
};

const setup = () => {
  controlBox.hidden = false;
  horizontalDiv.style.display = "flex";

  ws.onmessage = (ev) => {
    const data = JSON.parse(ev.data) as {
      internetDown: boolean;
      voiceDown: boolean;
      log: string;
    };

    if (data.internetDown !== internetDown && data.log !== "Connected") {
      sound("internet");
      if (data.internetDown)
        humanLog.append(`Internet disconnected at ${time()}\n`);
      if (!data.internetDown)
        humanLog.append(`Internet reconnected at ${time()}\n`);
    }

    if (data.voiceDown !== voiceDown && data.log !== "Connected") {
      sound("voice");
      if (data.voiceDown) humanLog.append(`Voice disconnected at ${time()}\n`);
      if (!data.voiceDown) humanLog.append(`Voice reconnected at ${time()}\n`);
    }

    internetDown = data.internetDown;
    voiceDown = data.voiceDown;
    if (data.log === "Connected") {
      data.log = `Connected to WSS, received values:\n- internetDown = ${internetDown}\n- voiceDown = ${voiceDown}`;
    }

    change(data.log); // Change the vLights

    controlLog.append(data.log + "\n");
    controlLog.scrollTop = controlLog.scrollHeight;
  };
};

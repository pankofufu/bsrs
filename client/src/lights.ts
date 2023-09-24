const power = document.getElementById("powerLight");
const internet = document.getElementById("internetLight");
const wifi = document.getElementById("wifiLight");
const voice = document.getElementById("voiceLight");

if (!power || !internet || !wifi || !voice)
  throw new Error("Lights are missing");

export const change = (line: string) => {
  if (line.includes("src=led")) {
    if (line.includes("cat=internet")) {
      if (line.includes("status=on")) {
        if (line.includes("colour=green")) {
          (internet as HTMLMediaElement).src = "lights/green.png";
        }
        if (line.includes("colour=amber")) {
          (internet as HTMLMediaElement).src = "lights/amber.png";
        }
      }
      if (line.includes("status=blink")) {
        if (line.includes("colour=amber")) {
          (internet as HTMLMediaElement).src = "lights/flash_amber.gif";
        }
      }
    }

    if (line.includes("cat=voip")) {
      if (line.includes("status=on")) {
        if (line.includes("colour=green")) {
          (voice as HTMLMediaElement).src = "lights/green.png";
        }
        if (line.includes("colour=amber")) {
          (voice as HTMLMediaElement).src = "lights/amber.png";
        }
      }
      if (line.includes("status=blink")) {
        if (line.includes("colour=amber")) {
          (voice as HTMLMediaElement).src = "lights/flash_amber.gif";
        }
      }
    }
  }

  return line;
};

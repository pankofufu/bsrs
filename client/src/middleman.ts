type SoundType = "internet" | "voice";
export const sound = (type: SoundType) => {
  const chime = new Audio();

  if (type === "internet") chime.src = "sfx/internet.mp3";
  if (type === "voice") chime.src = "sfx/voice.mp3";

  chime.play();

  chime.onended = () => {
    chime.remove();
  };
};

export const time = () => {
  const now = new Date(Date.now());
  return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
};

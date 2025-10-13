const clickSounds = [
  'assets/sounds/click1.mp3',
  'assets/sounds/click2.mp3',
  'assets/sounds/click3.mp3',
  'assets/sounds/click4.mp3'
];

document.addEventListener('click', function () {
  const soundSrc = clickSounds[Math.floor(Math.random() * clickSounds.length)];
  const audio = new Audio(soundSrc);
  audio.volume = 0.5; // 可调节音量
  audio.play().catch(err => {
    console.warn('音效播放失败：', err);
  });
});

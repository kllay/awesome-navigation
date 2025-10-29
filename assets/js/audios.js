const clickSounds = [
  'assets/sounds/click1.mp3',
  'assets/sounds/click2.mp3',
  'assets/sounds/click3.mp3',
  'assets/sounds/click4.mp3'
];

// 初始化音效状态
let soundEnabled = localStorage.getItem('soundEnabled') !== 'false'; // 默认开启

function updateSoundButton() {
  const btn = document.getElementById('toggle-sound');
  btn.textContent = soundEnabled ? '🔊 音效开启' : '🔇 音效关闭';
}

// 点击按钮切换音效状态
document.getElementById('toggle-sound').addEventListener('click', function () {
  soundEnabled = !soundEnabled;
  localStorage.setItem('soundEnabled', soundEnabled);
  updateSoundButton();
});

// 键盘快捷键切换音效（按 S 键）
document.addEventListener('keydown', function (e) {
  if (e.key.toLowerCase() === 's') {
    soundEnabled = !soundEnabled;
    localStorage.setItem('soundEnabled', soundEnabled);
    updateSoundButton();
  }
});

// 播放音效（仅当开启时）
document.addEventListener('click', function () {
  if (!soundEnabled) return;
  const soundSrc = clickSounds[Math.floor(Math.random() * clickSounds.length)];
  const audio = new Audio(soundSrc);
  audio.volume = 0.5;
  audio.play().catch(err => {
    console.warn('音效播放失败：', err);
  });
});

// 页面加载时更新按钮状态
updateSoundButton();


const bgAudio = document.getElementById('bg-music');
const toggleBtn = document.getElementById('toggle-music');
let musicEnabled = localStorage.getItem('musicEnabled') !== 'false'; // 默认开启

function updateMusicButton() {
  toggleBtn.textContent = musicEnabled ? '🔇 停止音乐' : '🎵 播放音乐';
}

toggleBtn.addEventListener('click', function () {
  musicEnabled = !musicEnabled;
  localStorage.setItem('musicEnabled', musicEnabled);
  updateMusicButton();
  if (musicEnabled) {
    bgAudio.play().catch(err => console.warn('音乐播放失败', err));
  } else {
    bgAudio.pause();
  }
});

// 页面加载时自动播放（如果开启）
window.addEventListener('DOMContentLoaded', () => {
  updateMusicButton();

  if (musicEnabled) {
    const tryPlay = () => {
      bgAudio.play().then(() => {
        console.log('音乐已播放');
      }).catch(err => {
        console.warn('音乐播放失败', err);
      });

      // 播放一次后移除监听器
      document.removeEventListener('click', tryPlay);
      document.removeEventListener('touchstart', tryPlay);
    };

    // 等待用户交互
    document.addEventListener('click', tryPlay);
    document.addEventListener('touchstart', tryPlay);
  }
});


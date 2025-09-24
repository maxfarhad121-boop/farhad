import { useCallback } from 'react';

const sounds = {
  correct: 'https://cdn.pixabay.com/audio/2022/03/15/audio_193b386376.mp3',
  wrong: 'https://cdn.pixabay.com/audio/2021/08/04/audio_c65c5576b5.mp3',
  click: 'https://cdn.pixabay.com/audio/2022/03/10/audio_82aa783091.mp3',
  levelUp: 'https://cdn.pixabay.com/audio/2022/11/17/audio_88746c2439.mp3',
};

type SoundName = keyof typeof sounds;

export const useSound = (isSoundOn: boolean) => {
  const playSound = useCallback((soundName: SoundName) => {
    if (isSoundOn && typeof window !== 'undefined') {
      const audio = new Audio(sounds[soundName]);
      audio.play().catch(e => console.error("Sound play failed", e));
    }
  }, [isSoundOn]);

  return playSound;
};

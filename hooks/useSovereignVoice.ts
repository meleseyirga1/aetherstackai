"use client"
export const useSovereignVoice = () => {
  const speak = (text, pitch = 0.7) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = pitch; 
    utterance.rate = 0.9;
    utterance.volume = 0.45;
    window.speechSynthesis.speak(utterance);
  };
  return { speak };
};

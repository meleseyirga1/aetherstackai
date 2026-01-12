"use client"

export const useSovereignVoice = () => {
  const speak = (text: string, pitch: number = 0.7) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Interrupt current speech for real-time authority
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Hardened "Silent Power" Parameters
    utterance.pitch = pitch; 
    utterance.rate = 0.9;
    utterance.volume = 0.45;

    // Attempt to select the most authoritative natural voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Premium'));
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);
  };

  return { speak };
};
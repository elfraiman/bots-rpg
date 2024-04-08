import { useState, useEffect } from "react";
import TypeWritterSound from '/sounds/typewriter.wav';

const useTypewriter = (text: string, speed: number = 50) => {
  const [displayText, setDisplayText] = useState('');
  let typewriterSound = new Audio(TypeWritterSound);

  useEffect(() => {
    setDisplayText(''); // Reset displayText when text changes
    typewriterSound.play();
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(prevText => prevText + text.charAt(i));

        i++;
      } else {

        clearInterval(typingInterval);
      }
    }, speed);

    return () => {
      typewriterSound.pause();
      clearInterval(typingInterval)
    }; // Clean up the interval on component unmount or when text/speed changes
  }, [text, speed]); // Rerun the effect if text or speed changes

  return displayText;
};

export default useTypewriter;

/**
 * SpeechSynthesis Utility Module
 * Provides natural speech output with voice selection and interruption handling
 */

/**
 * Checks if Speech Synthesis is supported in the current browser
 */
export function isSpeechSynthesisSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
}

/**
 * In-memory cache for available voices
 */
let cachedVoices = [];

/**
 * Retrieves the available speech synthesis voices, caching when possible
 */
export function getAvailableVoices() {
  if (!isSpeechSynthesisSupported()) return [];
  if (cachedVoices.length > 0) return cachedVoices;
  cachedVoices = window.speechSynthesis.getVoices();
  return cachedVoices;
}

// Preload and listen for asynchronous voice changes
if (isSpeechSynthesisSupported()) {
  getAvailableVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoices = window.speechSynthesis.getVoices();
    };
  }
}

/**
 * Selects a natural-sounding English voice if available.
 * Priority:
 * 1. Voices marked as "Natural", "Neural", "Google", "Samantha", "Daniel", "Karen", or "Enhanced"
 * 2. Any en-US voice
 * 3. Any English voice
 * 4. Browser default voice
 */
export function getNaturalEnglishVoice() {
  const voices = getAvailableVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Natural / Neural / Premium English voices
  const naturalVoice = voices.find(
    (v) =>
      v.lang.startsWith('en') &&
      /natural|neural|google|samantha|daniel|karen|oliver|arthur|premium|enhanced/i.test(v.name)
  );
  if (naturalVoice) return naturalVoice;

  // 2. Standard en-US voice
  const usVoice = voices.find((v) => v.lang === 'en-US' || v.lang.startsWith('en_US'));
  if (usVoice) return usVoice;

  // 3. Any English voice (e.g. en-GB, en-AU, en-CA)
  const englishVoice = voices.find((v) => v.lang.startsWith('en'));
  if (englishVoice) return englishVoice;

  // 4. Default voice
  return voices.find((v) => v.default) || voices[0] || null;
}

/**
 * Cancels any ongoing speech synthesis gracefully without unhandled exceptions
 */
export function stopSpeech() {
  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Gracefully ignore cancel exceptions
    }
  }
}

/**
 * Requirement 1 & 2:
 * Utility function speakText(text, options) that uses window.speechSynthesis
 * and selects a natural-sounding English voice if available.
 *
 * Requirement 5:
 * Handles unsupported environments and interrupted speech gracefully.
 */
export function speakText(text, options = {}) {
  // Support both speakText("text") and speakText("text", { onStart, onEnd, onError, ... })
  const {
    onStart,
    onEnd,
    onError,
    rate = 0.95,
    pitch = 1,
    lang = 'en-US'
  } = options;

  if (!isSpeechSynthesisSupported()) {
    console.warn("SpeechSynthesis API is not supported in this browser.");
    if (onError) onError(new Error("Speech synthesis is not supported."));
    return null;
  }

  if (!text || typeof text !== 'string' || !text.trim()) {
    return null;
  }

  try {
    // Interruption handling: cancel previous speech before beginning the new utterance
    stopSpeech();

    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.lang = lang;

    // Requirement 2: Ensure it selects a natural-sounding English voice if available
    const voice = getNaturalEnglishVoice();
    if (voice) {
      utterance.voice = voice;
    }

    if (onStart) {
      utterance.onstart = onStart;
    }

    utterance.onend = (event) => {
      if (onEnd) onEnd(event);
    };

    // Requirement 5: Handle cases where speech is interrupted or canceled gracefully
    utterance.onerror = (event) => {
      // Interrupted/canceled states occur routinely when the user replays or navigates
      if (event.error === 'interrupted' || event.error === 'canceled') {
        if (onEnd) onEnd(event);
        return;
      }
      console.warn("Speech synthesis error:", event.error);
      if (onError) onError(event);
    };

    window.speechSynthesis.speak(utterance);
    return utterance;
  } catch (err) {
    console.warn("Failed to trigger speech synthesis:", err);
    if (onError) onError(err);
    return null;
  }
}

/**
 * Helper to speak word, part of speech, definition, and example smoothly
 */
export function speakWordDefinition(word, partOfSpeech, definition, example, callbacks = {}) {
  let text = word;
  if (partOfSpeech) {
    text += `, ${partOfSpeech}. `;
  } else {
    text += `. `;
  }
  text += definition;
  if (example) {
    text += ` For example: ${example}`;
  }

  return speakText(text, callbacks);
}

/**
 * Plays an audio URL or falls back to speech synthesis
 */
export function playPronunciation({ audioUrl, word, onStart, onEnd, onError }) {
  stopSpeech();

  if (audioUrl && audioUrl.trim().length > 0) {
    try {
      const audio = new Audio(audioUrl);
      if (onStart) audio.onplay = onStart;
      if (onEnd) audio.onended = onEnd;
      audio.onerror = () => {
        // Fallback to Web Speech Synthesis if audio URL fails to load
        speakText(word, { onStart, onEnd, onError });
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback to speech synthesis
          speakText(word, { onStart, onEnd, onError });
        });
      }
      return audio;
    } catch {
      speakText(word, { onStart, onEnd, onError });
      return null;
    }
  } else {
    // No audio URL available, use synthesized voice
    speakText(word, { onStart, onEnd, onError });
    return null;
  }
}

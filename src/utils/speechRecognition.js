/**
 * Web Speech API - SpeechRecognition / webkitSpeechRecognition Module
 * Handles speech-to-text, phrase parsing, and browser permission states.
 */

/**
 * Checks if Speech Recognition is supported in the current browser
 */
export function isSpeechRecognitionSupported() {
  return typeof window !== 'undefined' && Boolean(
    window.SpeechRecognition || window.webkitSpeechRecognition
  );
}

/**
 * Retrieves the SpeechRecognition constructor
 */
export function getSpeechRecognitionClass() {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

/**
 * Requirement 3:
 * Parses the spoken transcript using regular expressions and keyword matching
 * to cleanly extract the target word.
 *
 * Handles sentences like:
 * - "What does the word 'Resilient' mean?" -> "resilient"
 * - "What is the meaning of the word Resilient?" -> "resilient"
 * - "What does Resilient mean?" -> "resilient"
 * - "What is the definition of Resilient?" -> "resilient"
 * - "What is Resilient?" -> "resilient"
 * - "Define the word Resilient" -> "resilient"
 * - "Can you define Resilient?" -> "resilient"
 * - "Tell me the meaning of Resilient" -> "resilient"
 * - "Look up the word Resilient" -> "resilient"
 * - "Meaning of Resilient" -> "resilient"
 * - "Search for Resilient" -> "resilient"
 * - "How do you spell Resilient?" -> "resilient"
 * - Or just "Resilient" -> "resilient"
 */
export function extractWordFromVoice(transcript) {
  if (!transcript || typeof transcript !== 'string') return '';

  let cleaned = transcript.trim().toLowerCase();

  // Strip single/double quotes and smart quotes
  cleaned = cleaned.replace(/['"“”‘’]/g, '');

  // Strip non-alphanumeric punctuation marks but keep word spaces and hyphens
  cleaned = cleaned.replace(/[.,/#!$%^&*;:{}=_`~()?]/g, ' ');

  // Collapse multiple spaces into single space
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // Comprehensive regular expression patterns in order of specificity
  const patterns = [
    // "Can you please tell me what is the definition of the word X"
    /^(?:can you\s+)?(?:please\s+)?(?:tell me\s+|give me\s+)?(?:what is\s+|whats\s+)?(?:the\s+)?(?:definition|meaning)\s+(?:of|for)\s+(?:the word\s+|the\s+|a\s+|an\s+)?([a-z\s-]+?)(?:\s+mean|\s+meaning)?$/i,

    // "What does the word 'Resilient' mean?"
    /^(?:can you\s+)?(?:please\s+)?(?:what does)\s+(?:the word\s+|the\s+|a\s+|an\s+)?([a-z\s-]+?)\s+mean$/i,

    // "Can you please define the word X"
    /^(?:can you\s+)?(?:please\s+)?(?:tell me\s+)?(?:give me\s+)?define\s+(?:the word\s+|the\s+|a\s+|an\s+)?([a-z\s-]+?)$/i,

    // "Meaning of the word X" / "Definition of X"
    /^(?:meaning|definition)\s+(?:of|for)\s+(?:the word\s+|the\s+|a\s+|an\s+)?([a-z\s-]+?)$/i,

    // "Look up the word X" / "Search for X" / "Find X"
    /^(?:can you\s+)?(?:please\s+)?(?:look up|search for|search|find)\s+(?:the word\s+|the\s+|a\s+|an\s+)?([a-z\s-]+?)$/i,

    // "How do you spell/pronounce the word X"
    /^(?:how do you\s+)?(?:pronounce|spell)\s+(?:the word\s+|the\s+|a\s+|an\s+)?([a-z\s-]+?)$/i,

    // "What is the word X" / "What is X"
    /^(?:what is|whats)\s+(?:the word\s+|the\s+|a\s+|an\s+)?([a-z\s-]+?)$/i,

    // "Tell me about the word X"
    /^(?:tell me about\s+)(?:the word\s+|the\s+|a\s+|an\s+)?([a-z\s-]+?)$/i
  ];

  for (const pattern of patterns) {
    const match = cleaned.match(pattern);
    if (match && match[1]) {
      const extracted = match[1].trim();
      if (extracted.length > 0) {
        return extracted;
      }
    }
  }

  // If no prefix matched, remove any leading article (the/a/an)
  const words = cleaned.split(/\s+/);
  if (words.length > 1 && (words[0] === 'the' || words[0] === 'a' || words[0] === 'an')) {
    return words.slice(1).join(' ').trim();
  }

  return cleaned;
}

/**
 * Requirement 1 & 4:
 * Creates and configures a SpeechRecognition instance with clear error handling
 * and permissions management.
 */
export function createSpeechRecognizer({
  onStart,
  onInterimResult,
  onFinalResult,
  onError,
  onEnd,
  lang = 'en-US'
}) {
  if (!isSpeechRecognitionSupported()) {
    if (onError) {
      onError({
        code: 'unsupported',
        message: 'Speech recognition is not supported in this browser. Please use the manual search box below.',
        isBlocked: false
      });
    }
    return null;
  }

  const SpeechRecognitionClass = getSpeechRecognitionClass();
  const recognizer = new SpeechRecognitionClass();

  recognizer.continuous = false;
  recognizer.interimResults = true;
  recognizer.lang = lang;
  recognizer.maxAlternatives = 1;

  recognizer.onstart = () => {
    if (onStart) onStart();
  };

  recognizer.onresult = (event) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const result = event.results[i];
      if (result.isFinal) {
        finalTranscript += result[0].transcript;
      } else {
        interimTranscript += result[0].transcript;
      }
    }

    if (interimTranscript && onInterimResult) {
      onInterimResult(interimTranscript);
    }

    if (finalTranscript && onFinalResult) {
      onFinalResult(finalTranscript);
    }
  };

  recognizer.onerror = (event) => {
    let message = 'Voice recognition encountered an error. Please try again or type below.';
    let isBlocked = false;

    // Requirement 4: Handle browser permissions gracefully with clear error messages
    switch (event.error) {
      case 'not-allowed':
      case 'permission-denied':
        isBlocked = true;
        message = 'Microphone access is blocked. Please enable microphone permissions in your browser settings (look for the lock/camera icon in the address bar), or use the search box below.';
        break;
      case 'no-speech':
        message = 'No speech was detected. Please speak clearly into your microphone, or type your word below.';
        break;
      case 'audio-capture':
        isBlocked = true;
        message = 'No microphone was found on your device. Please verify your audio input settings or type your word below.';
        break;
      case 'network':
        message = 'A network error occurred while connecting to the speech service. You can type your word in the search box below.';
        break;
      case 'service-not-allowed':
        isBlocked = true;
        message = 'Speech recognition service is currently unavailable or restricted. Please type your word in the search box below.';
        break;
      case 'aborted':
        // User stopped listening manually; ignore as an error
        return;
      default:
        message = `Speech recognition error: ${event.error || 'Unknown error'}. Please type your word below.`;
        break;
    }

    if (onError) {
      onError({
        code: event.error,
        message,
        isBlocked
      });
    }
  };

  recognizer.onend = () => {
    if (onEnd) onEnd();
  };

  return recognizer;
}

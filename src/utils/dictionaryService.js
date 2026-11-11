import { WORDS_OF_THE_DAY } from '../data/wordsOfTheDay';

/**
 * Robust local fallback JSON dictionary for common and curated words.
 * Ensures instant responses even if network is slow, offline, or rate-limited.
 */
const OFFLINE_DICTIONARY = {
  serendipity: {
    word: "serendipity",
    phonetic: "/ˌsɛr.ənˈdɪp.ɪ.ti/",
    phonetics: [
      {
        text: "/ˌsɛr.ənˈdɪp.ɪ.ti/",
        audio: "https://api.dictionaryapi.dev/media/pronunciations/en/serendipity-au.mp3"
      }
    ],
    meanings: [
      {
        partOfSpeech: "noun",
        definitions: [
          {
            definition: "The occurrence and development of events by chance in a happy or beneficial way.",
            example: "A fortunate stroke of serendipity brought our two research teams together in the same library.",
            synonyms: ["chance", "good fortune", "happy accident", "providence"],
            antonyms: ["misfortune", "bad luck"]
          }
        ],
        synonyms: ["chance", "good fortune", "happy accident"],
        antonyms: ["misfortune"]
      }
    ]
  },
  resilient: {
    word: "resilient",
    phonetic: "/rɪˈzɪl.jənt/",
    phonetics: [
      {
        text: "/rɪˈzɪl.jənt/",
        audio: "https://api.dictionaryapi.dev/media/pronunciations/en/resilient-us.mp3"
      }
    ],
    meanings: [
      {
        partOfSpeech: "adjective",
        definitions: [
          {
            definition: "Able to withstand or recover quickly from difficult conditions; adaptable and robust.",
            example: "The resilient community rebuilt their homes stronger than ever after the severe storm.",
            synonyms: ["tough", "hardy", "adaptable", "buoyant", "flexible"],
            antonyms: ["fragile", "vulnerable", "delicate"]
          }
        ],
        synonyms: ["tough", "hardy", "strong"],
        antonyms: ["fragile", "weak"]
      }
    ]
  },
  resilience: {
    word: "resilience",
    phonetic: "/rɪˈzɪl.jəns/",
    phonetics: [
      {
        text: "/rɪˈzɪl.jəns/",
        audio: "https://api.dictionaryapi.dev/media/pronunciations/en/resilience-us.mp3"
      }
    ],
    meanings: [
      {
        partOfSpeech: "noun",
        definitions: [
          {
            definition: "The capacity to withstand or to recover quickly from difficulties; toughness and fortitude.",
            example: "Her emotional resilience helped her overcome severe setbacks and achieve lasting success.",
            synonyms: ["fortitude", "perseverance", "toughness", "adaptability"],
            antonyms: ["fragility", "vulnerability"]
          }
        ],
        synonyms: ["fortitude", "toughness"],
        antonyms: ["fragility"]
      }
    ]
  },
  petrichor: {
    word: "petrichor",
    phonetic: "/ˈpɛt.rɪ.kɔːr/",
    phonetics: [{ text: "/ˈpɛt.rɪ.kɔːr/" }],
    meanings: [
      {
        partOfSpeech: "noun",
        definitions: [
          {
            definition: "A pleasant, earthy scent frequently accompanying the first rain after a long period of warm, dry weather.",
            example: "We opened the veranda doors to drink in the refreshing petrichor.",
            synonyms: ["rain scent", "earthy aroma"]
          }
        ],
        synonyms: ["rain scent", "earthy scent"]
      }
    ]
  },
  ephemeral: {
    word: "ephemeral",
    phonetic: "/ɪˈfɛm.ər.əl/",
    phonetics: [
      {
        text: "/ɪˈfɛm.ər.əl/",
        audio: "https://api.dictionaryapi.dev/media/pronunciations/en/ephemeral-us.mp3"
      }
    ],
    meanings: [
      {
        partOfSpeech: "adjective",
        definitions: [
          {
            definition: "Lasting for a very short time; transitory; fleeting.",
            example: "Fashions are ephemeral, but true style remains timeless.",
            synonyms: ["fleeting", "short-lived", "transient", "evanescent"],
            antonyms: ["permanent", "eternal", "enduring"]
          }
        ],
        synonyms: ["fleeting", "transient"],
        antonyms: ["permanent", "perpetual"]
      }
    ]
  },
  mellifluous: {
    word: "mellifluous",
    phonetic: "/məˈlɪf.lu.əs/",
    phonetics: [{ text: "/məˈlɪf.lu.əs/" }],
    meanings: [
      {
        partOfSpeech: "adjective",
        definitions: [
          {
            definition: "(Of a voice or words) sweet or musical; pleasant to hear.",
            example: "The radio host possessed a mellow, mellifluous voice that listeners found deeply calming.",
            synonyms: ["sweet-sounding", "dulcet", "honeyed", "melodious"],
            antonyms: ["cacophonous", "harsh", "strident"]
          }
        ],
        synonyms: ["dulcet", "melodious"],
        antonyms: ["harsh"]
      }
    ]
  },
  eloquent: {
    word: "eloquent",
    phonetic: "/ˈɛl.ə.kwənt/",
    phonetics: [{ text: "/ˈɛl.ə.kwənt/" }],
    meanings: [
      {
        partOfSpeech: "adjective",
        definitions: [
          {
            definition: "Fluent or persuasive in speaking or writing; vividly expressive.",
            example: "Her eloquent defense of civil liberties moved the courtroom to silence.",
            synonyms: ["articulate", "persuasive", "expressive", "fluent"],
            antonyms: ["inarticulate", "hesitant"]
          }
        ],
        synonyms: ["articulate", "expressive"]
      }
    ]
  },
  sonder: {
    word: "sonder",
    phonetic: "/ˈsɒn.dər/",
    phonetics: [{ text: "/ˈsɒn.dər/" }],
    meanings: [
      {
        partOfSpeech: "noun",
        definitions: [
          {
            definition: "The profound realization that each random passerby is living a life as vivid and complex as your own.",
            example: "Looking out over the crowded subway car, a sudden sense of sonder washed over him.",
            synonyms: ["empathy", "awareness", "compassion"]
          }
        ],
        synonyms: ["empathy", "deep awareness"]
      }
    ]
  },
  ineffable: {
    word: "ineffable",
    phonetic: "/ɪnˈɛf.ə.bəl/",
    phonetics: [{ text: "/ɪnˈɛf.ə.bəl/" }],
    meanings: [
      {
        partOfSpeech: "adjective",
        definitions: [
          {
            definition: "Too great or extreme to be expressed or described in words.",
            example: "Standing atop the Himalayan summit, an ineffable tranquility settled over his spirit.",
            synonyms: ["indescribable", "unutterable", "transcendent"],
            antonyms: ["definable", "expressible"]
          }
        ],
        synonyms: ["indescribable", "transcendent"]
      }
    ]
  },
  ubiquitous: {
    word: "ubiquitous",
    phonetic: "/juːˈbɪk.wɪ.təs/",
    phonetics: [{ text: "/juːˈbɪk.wɪ.təs/" }],
    meanings: [
      {
        partOfSpeech: "adjective",
        definitions: [
          {
            definition: "Present, appearing, or found everywhere; omnipresent.",
            example: "Coffee shops have become ubiquitous fixtures in urban neighborhoods across the world.",
            synonyms: ["omnipresent", "pervasive", "everywhere", "universal"],
            antonyms: ["rare", "scarce"]
          }
        ],
        synonyms: ["omnipresent", "pervasive"]
      }
    ]
  },
  tenacity: {
    word: "tenacity",
    phonetic: "/təˈnæs.ɪ.ti/",
    phonetics: [{ text: "/təˈnæs.ɪ.ti/" }],
    meanings: [
      {
        partOfSpeech: "noun",
        definitions: [
          {
            definition: "The quality or fact of being very determined; determination; persistent resolve.",
            example: "His sheer tenacity propelled him from poverty to international academic acclaim.",
            synonyms: ["perseverance", "persistence", "grit", "determination"],
            antonyms: ["irresolution", "hesitation"]
          }
        ],
        synonyms: ["perseverance", "grit"]
      }
    ]
  },
  pragmatic: {
    word: "pragmatic",
    phonetic: "/præɡˈmæt.ɪk/",
    phonetics: [{ text: "/præɡˈmæt.ɪk/" }],
    meanings: [
      {
        partOfSpeech: "adjective",
        definitions: [
          {
            definition: "Dealing with things sensibly and realistically based on practical considerations rather than theoretical ones.",
            example: "We need a pragmatic solution that works within our current budget constraints.",
            synonyms: ["practical", "realistic", "sensible", "down-to-earth"],
            antonyms: ["idealistic", "impractical"]
          }
        ],
        synonyms: ["practical", "sensible"]
      }
    ]
  }
};

/**
 * LocalStorage cache helper to provide instant responses on repeated searches
 */
const CACHE_KEY = 'voxlex_dictionary_cache';

function getCachedWord(word) {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cache = JSON.parse(raw);
    return cache[word.toLowerCase()] || null;
  } catch {
    return null;
  }
}

function setCachedWord(word, entry) {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const cache = raw ? JSON.parse(raw) : {};
    cache[word.toLowerCase()] = entry;
    // Limit cache size to 100 entries
    const keys = Object.keys(cache);
    if (keys.length > 100) {
      delete cache[keys[0]];
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Normalizes dictionary entry for clean UI consumption
 */
function normalizeEntry(entry) {
  if (!entry) return null;

  // Extract phonetic text
  let phoneticText = entry.phonetic || "";
  if (!phoneticText && Array.isArray(entry.phonetics)) {
    const found = entry.phonetics.find(p => p.text);
    if (found) phoneticText = found.text;
  }

  // Extract phonetic audio URL
  let audioUrl = "";
  if (Array.isArray(entry.phonetics)) {
    const withAudio = entry.phonetics.find(p => p.audio && p.audio.trim().length > 0);
    if (withAudio) {
      audioUrl = withAudio.audio;
      if (audioUrl.startsWith("//")) {
        audioUrl = "https:" + audioUrl;
      }
    }
  }

  // Collect unique synonyms & antonyms
  const allSynonyms = new Set();
  const allAntonyms = new Set();

  (entry.meanings || []).forEach(m => {
    (m.synonyms || []).forEach(s => allSynonyms.add(s));
    (m.antonyms || []).forEach(a => allAntonyms.add(a));
    (m.definitions || []).forEach(d => {
      (d.synonyms || []).forEach(s => allSynonyms.add(s));
      (d.antonyms || []).forEach(a => allAntonyms.add(a));
    });
  });

  return {
    word: entry.word,
    phonetic: phoneticText,
    audioUrl,
    meanings: entry.meanings || [],
    allSynonyms: Array.from(allSynonyms).slice(0, 8),
    allAntonyms: Array.from(allAntonyms).slice(0, 8),
    sourceUrls: entry.sourceUrls || []
  };
}

/**
 * Requirement 1:
 * Connect to the free public Dictionary API (https://api.dictionaryapi.dev/api/v2/entries/en/{word})
 * with a robust local fallback JSON object for common words to ensure instant responses.
 */
export async function fetchWord(query) {
  const cleanWord = query.trim().toLowerCase();
  if (!cleanWord) {
    throw new Error("Please enter or say a word to look up.");
  }

  // 1. Check local in-memory/localStorage cache first for instant response
  const cached = getCachedWord(cleanWord);
  if (cached) {
    return cached;
  }

  // 2. Check local fallback JSON dictionary for instant response
  if (OFFLINE_DICTIONARY[cleanWord]) {
    const normalized = normalizeEntry(OFFLINE_DICTIONARY[cleanWord]);
    setCachedWord(cleanWord, normalized);
    return normalized;
  }

  // 3. Check curated WORDS_OF_THE_DAY
  const dayWord = WORDS_OF_THE_DAY.find(w => w.word.toLowerCase() === cleanWord);
  if (dayWord) {
    const fromWotd = {
      word: dayWord.word,
      phonetic: dayWord.phonetic,
      audioUrl: "",
      meanings: [
        {
          partOfSpeech: dayWord.partOfSpeech,
          definitions: [
            {
              definition: dayWord.definition,
              example: dayWord.example,
              synonyms: dayWord.synonyms || []
            }
          ],
          synonyms: dayWord.synonyms || []
        }
      ],
      allSynonyms: dayWord.synonyms || [],
      allAntonyms: [],
      sourceUrls: []
    };
    setCachedWord(cleanWord, fromWotd);
    return fromWotd;
  }

  // 4. Query the free public Dictionary API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6500);

    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanWord)}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      if (res.status === 404) {
        const err = new Error(`Sorry, we couldn't find definitions for "${cleanWord}". Try checking the spelling or search another word.`);
        err.isNotFound = true;
        throw err;
      }
      throw new Error(`Dictionary service returned status ${res.status}`);
    }

    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const normalized = normalizeEntry(data[0]);
      setCachedWord(cleanWord, normalized);
      return normalized;
    }

    throw new Error(`No definition found for "${cleanWord}".`);
  } catch (error) {
    // If network or timeout occurred, check if there's any partial or fallback match
    if (OFFLINE_DICTIONARY[cleanWord]) {
      return normalizeEntry(OFFLINE_DICTIONARY[cleanWord]);
    }
    throw error;
  }
}

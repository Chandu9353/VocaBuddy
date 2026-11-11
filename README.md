# VoxLex — Vocabulary Voice Assistant

A sleek, modern React.js voice assistant, pronunciation coach, and vocabulary companion built with Tailwind CSS, the Web Speech API (SpeechRecognition + SpeechSynthesis), and the Free Dictionary API.

## Features

1. **Vocabulary Data (Public Dictionary API + Robust Local Fallback)**:
   - Queries `https://api.dictionaryapi.dev/api/v2/entries/en/{word}`.
   - Comprehensive local fallback dictionary covering common and curated words (*resilient*, *resilience*, *serendipity*, *petrichor*, *ephemeral*, *mellifluous*, *sonder*, *eloquent*, *ineffable*, *ubiquitous*, *tenacity*, *pragmatic*, etc.) ensuring instant offline responses.
   - Local storage caching for zero-latency repeated lookups.

2. **Pronunciation Practice Mode ("Practice Speaking")**:
   - Tap **"Practice Speaking"** on any word to practice saying it out loud.
   - User listens to native audio guide, clicks the microphone, and speaks the word.
   - Compares spoken speech against the target word using SpeechRecognition and string similarity scoring (Levenshtein distance).
   - Generates instant visual feedback:
     - **🎉 Great job!** (Perfect pronunciation, emerald celebration card).
     - **👏 Almost there!** (Close attempt with syllable tips, amber card).
     - **❌ Try again!** (Clear guidance on heard vs. expected word, rose card).
     - Interactive **"Try Again"** button to practice repeatedly.

3. **Daily Rotating "Word of the Day"**:
   - Strictly deterministically rotates based on the current calendar date (`new Date()`).
   - Displays the formatted date (*e.g., Wednesday, November 11, 2026*), phonetic pronunciation, definition, example sentence, and etymological origins.
   - Includes quick-access **"Practice Speaking"** and **"Full Analysis"** buttons.

4. **Speech Output (SpeechSynthesis API)**:
   - Automated voice readout on successful word lookups with natural English voice prioritization.
   - Manual **"Listen"** replay buttons beside every definition and example sentence.

5. **Voice Input (SpeechRecognition API)**:
   - Prominent central pulsing microphone with `"Listening..."` state.
   - Natural question parsing (*e.g., "What does the word 'Resilient' mean?" $\rightarrow$ "resilient"*).
   - Browser permission handling with fallback button to manual typing.

## Quick Start

```powershell
cd C:\Users\VSEIPL\vocabulary-voice-assistant

# Start development server
npm run dev

# Build for production
npm run build
```

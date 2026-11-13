export interface DictationMerge {
  text: string;
  /** True when the spoken words had to be cut to fit `maxLength`. */
  truncated: boolean;
}

/**
 * Appends what's been said so far to the text that was in the field when dictation started.
 * Recomputed from scratch on every recognition event, so interim words can be revised freely.
 */
export function mergeDictation(base: string, spoken: string, maxLength: number): DictationMerge {
  let words = spoken.replace(/\s+/g, " ").trim();
  if (!words) return { text: base, truncated: false };

  const head = base.trimEnd();
  if (!head || /[.!?]$/.test(head)) words = words.charAt(0).toUpperCase() + words.slice(1);

  const text = head ? `${head} ${words}` : words;
  if (text.length <= maxLength) return { text, truncated: false };

  // Cut at a word boundary, but never into the text that was already there.
  const cut = text.slice(0, maxLength);
  const boundary = cut.lastIndexOf(" ");
  return { text: (boundary > head.length ? cut.slice(0, boundary) : cut).trimEnd(), truncated: true };
}

export function describeDictationError(code: string): string | null {
  switch (code) {
    case "aborted":
      return null;
    case "no-speech":
      return "Didn't catch that. Tap the mic and try again.";
    case "audio-capture":
      return "No microphone was found. Check your device, or type your idea instead.";
    case "not-allowed":
      return "Microphone access is blocked. Allow it in your browser's site settings, or type your idea instead.";
    case "service-not-allowed":
      return "Speech recognition is turned off in this browser. Enable dictation in your settings, or type your idea instead.";
    case "network":
      return "Couldn't reach your browser's speech service. Try again in Chrome, Edge, or Safari, or type your idea instead.";
    case "language-not-supported":
      return "Voice input doesn't support your language setting. Type your idea instead.";
    case "unavailable":
      return "Voice input isn't working in this browser. Try Chrome, Edge, or Safari, or type your idea instead.";
    default:
      return "Voice input stopped unexpectedly. Try again, or type your idea instead.";
  }
}

/** English variants keep regional accents (en-IN, en-GB); anything else falls back to en-US. */
export function pickDictationLanguage(preferred: string | undefined): string {
  return preferred && /^en(-|$)/i.test(preferred) ? preferred : "en-US";
}

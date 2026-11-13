"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  describeDictationError,
  mergeDictation,
  pickDictationLanguage,
} from "@/lib/speech-dictation";

// The Web Speech API's recognizer isn't in TypeScript's DOM lib yet, so describe the parts we use.
interface RecognitionResultEvent extends Event {
  readonly results: SpeechRecognitionResultList;
}

interface RecognitionErrorEvent extends Event {
  readonly error: string;
}

interface Recognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult: ((event: RecognitionResultEvent) => void) | null;
  onerror: ((event: RecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

type RecognitionConstructor = new () => Recognition;

function getRecognitionConstructor(): RecognitionConstructor | null {
  if (typeof window === "undefined" || !window.isSecureContext) return null;
  const speechWindow = window as Window & {
    SpeechRecognition?: RecognitionConstructor;
    webkitSpeechRecognition?: RecognitionConstructor;
  };
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
}

const subscribeToNothing = () => () => {};

// Some browsers (embedded and in-app ones especially) expose the API but never start listening.
const START_TIMEOUT_MS = 6_000;
// First-time visitors need time to answer the browser's microphone prompt.
const PERMISSION_PROMPT_TIMEOUT_MS = 30_000;
// A stop normally ends within a second; past this, assume the browser won't confirm it.
const STOP_TIMEOUT_MS = 3_000;
// Like voice search, a pause this long after speaking means the speaker is done.
const DICTATION_PAUSE_MS = 2_500;

interface SpeechDictationOptions {
  maxLength: number;
  onText: (text: string) => void;
  /** Runs when the speaker pauses to finish; not when they press stop, or speech hits the limit. */
  onDone?: (text: string) => void;
}

export function useSpeechDictation({ maxLength, onText, onDone }: SpeechDictationOptions) {
  // False during SSR and hydration, so the server markup never includes a control that might not work.
  const supported = useSyncExternalStore(
    subscribeToNothing,
    () => getRecognitionConstructor() !== null,
    () => false,
  );
  // True once hydrated, so callers can tell "not checked yet" apart from "unsupported".
  const ready = useSyncExternalStore(subscribeToNothing, () => true, () => false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const [limitReached, setLimitReached] = useState(false);
  /** The speaker pressed stop, so their words wait in the field for a manual Generate. */
  const [stoppedForReview, setStoppedForReview] = useState(false);
  const recognitionRef = useRef<Recognition | null>(null);
  const endRef = useRef<((submit: boolean) => void) | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const onTextRef = useRef(onText);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onTextRef.current = onText;
    onDoneRef.current = onDone;
  }, [onText, onDone]);

  const clearTimers = useCallback(() => {
    clearTimeout(timerRef.current);
    clearTimeout(pauseTimerRef.current);
    timerRef.current = undefined;
    pauseTimerRef.current = undefined;
  }, []);

  /** Stops immediately and ignores anything still in flight. */
  const cancel = useCallback(() => {
    clearTimers();
    setStoppedForReview(false);
    const recognition = recognitionRef.current;
    if (!recognition) return;
    recognitionRef.current = null;
    endRef.current = null;
    recognition.abort();
    setListening(false);
  }, [clearTimers]);

  useEffect(() => cancel, [cancel]);

  /** Finishes the current phrase and keeps what was heard for editing, without submitting it. */
  const stop = useCallback(() => {
    endRef.current?.(false);
  }, []);

  /** `base` is the text already in the field; speech is appended to it. */
  const start = useCallback(
    (base: string) => {
      const RecognitionImpl = getRecognitionConstructor();
      if (!RecognitionImpl || recognitionRef.current) return;

      const recognition = new RecognitionImpl();
      recognition.lang = pickDictationLanguage(navigator.language);
      // Chrome on Android repeats earlier phrases in continuous mode, so there it takes one
      // utterance per tap; each new tap appends to what's already in the field.
      recognition.continuous = !/Android/i.test(navigator.userAgent);
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      // Events can still arrive after cancel(); only the active recognizer may touch state.
      const isActive = () => recognitionRef.current === recognition;
      let started = false;
      let heard = "";
      let failed = false;
      let truncated = false;
      // A recognizer that ends on its own (Android after one phrase) counts as a finished thought.
      let submitOnEnd = true;

      const finish = () => {
        if (!isActive()) return;
        clearTimers();
        recognitionRef.current = null;
        endRef.current = null;
        setListening(false);
        if (!heard || failed || truncated) return;
        if (submitOnEnd) onDoneRef.current?.(heard);
        else setStoppedForReview(true);
      };

      const end = (submit: boolean) => {
        if (!isActive()) return;
        submitOnEnd = submit;
        clearTimers();
        recognition.stop();
        timerRef.current = setTimeout(() => {
          finish();
          recognition.abort();
        }, STOP_TIMEOUT_MS);
      };

      const giveUp = () => {
        if (!isActive() || started) return;
        cancel();
        setError(describeDictationError("unavailable") ?? "");
      };

      recognition.onstart = () => {
        started = true;
      };
      recognition.onresult = (event) => {
        if (!isActive()) return;
        started = true;
        const spoken = Array.from(event.results, (result) => result[0]?.transcript ?? "").join(" ");
        const merged = mergeDictation(base, spoken, maxLength);
        onTextRef.current(merged.text);
        if (spoken.trim()) heard = merged.text;
        if (merged.truncated) {
          truncated = true;
          setLimitReached(true);
          end(false);
          return;
        }
        // Interim results stream in while someone talks, so this only fires once they go quiet.
        clearTimeout(pauseTimerRef.current);
        if (heard) pauseTimerRef.current = setTimeout(() => end(true), DICTATION_PAUSE_MS);
      };
      recognition.onerror = (event) => {
        if (!isActive()) return;
        failed = true;
        const message = describeDictationError(event.error);
        if (message) setError(message);
      };
      recognition.onend = finish;

      clearTimers();
      setError("");
      setLimitReached(false);
      setStoppedForReview(false);
      recognitionRef.current = recognition;
      endRef.current = end;
      try {
        recognition.start();
        setListening(true);
      } catch {
        recognitionRef.current = null;
        endRef.current = null;
        setError(describeDictationError("start-failed") ?? "");
        return;
      }

      const watchdog = setTimeout(giveUp, START_TIMEOUT_MS);
      timerRef.current = watchdog;
      navigator.permissions
        ?.query({ name: "microphone" as PermissionName })
        .then((status) => {
          if (status.state !== "prompt" || !isActive() || timerRef.current !== watchdog) return;
          clearTimeout(watchdog);
          timerRef.current = setTimeout(giveUp, PERMISSION_PROMPT_TIMEOUT_MS);
        })
        .catch(() => {});
    },
    [cancel, clearTimers, maxLength],
  );

  return { ready, supported, listening, error, limitReached, stoppedForReview, start, stop, cancel };
}

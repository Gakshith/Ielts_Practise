"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* Minimal shape of the Web Speech API. It is not in TypeScript's DOM lib and is
   prefixed in most browsers, so we declare only what we use. When the real voice
   API lands, it replaces the body of this hook and nothing above it changes. */
interface SpeechResultAlt { transcript: string }
interface SpeechResult { 0: SpeechResultAlt; isFinal: boolean; length: number }
interface SpeechResultList { length: number; [i: number]: SpeechResult }
interface SpeechEvent { resultIndex: number; results: SpeechResultList }
interface Recognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((e: SpeechEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}
type RecognitionCtor = new () => Recognition;

function getCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export interface Transcript {
  supported: boolean;
  listening: boolean;
  /** committed text so far */
  final: string;
  /** the words still being recognised, shown greyed so the candidate sees it live */
  interim: string;
  start: () => void;
  stop: () => void;
  reset: () => void;
  append: (text: string) => void;
}

export function useSpeechTranscript(): Transcript {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [final, setFinal] = useState("");
  const [interim, setInterim] = useState("");
  const rec = useRef<Recognition | null>(null);
  const wanted = useRef(false);

  useEffect(() => {
    setSupported(getCtor() !== null);
  }, []);

  const start = useCallback(() => {
    const Ctor = getCtor();
    if (!Ctor) return;
    wanted.current = true;
    const r = new Ctor();
    r.continuous = true;
    r.interimResults = true;
    r.lang = "en-GB";
    r.onresult = (e) => {
      let live = "";
      for (let i = e.resultIndex; i < e.results.length; i += 1) {
        const res = e.results[i];
        if (res.isFinal) setFinal((prev) => `${prev}${prev ? " " : ""}${res[0].transcript.trim()}`);
        else live += res[0].transcript;
      }
      setInterim(live);
    };
    r.onerror = () => setListening(false);
    // Browsers stop recognition on their own after a pause; restart while wanted.
    r.onend = () => {
      if (wanted.current) {
        try {
          r.start();
        } catch {
          setListening(false);
        }
      } else setListening(false);
    };
    try {
      r.start();
      rec.current = r;
      setListening(true);
    } catch {
      setListening(false);
    }
  }, []);

  const stop = useCallback(() => {
    wanted.current = false;
    rec.current?.stop();
    setListening(false);
    setInterim("");
  }, []);

  useEffect(() => () => {
    wanted.current = false;
    rec.current?.stop();
  }, []);

  return {
    supported,
    listening,
    final,
    interim,
    start,
    stop,
    reset: () => {
      setFinal("");
      setInterim("");
    },
    append: (t: string) => setFinal((p) => `${p}${p ? " " : ""}${t}`),
  };
}

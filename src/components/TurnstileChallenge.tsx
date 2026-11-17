"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

interface TurnstileOptions {
  sitekey: string;
  action: string;
  callback: (token: string) => void;
  "expired-callback": () => void;
  "error-callback": () => void;
}

interface TurnstileAPI {
  render: (container: HTMLElement, options: TurnstileOptions) => string;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileAPI;
  }
}

export function TurnstileChallenge({
  siteKey,
  onToken,
}: {
  siteKey: string;
  onToken: (token: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [scriptFailed, setScriptFailed] = useState(false);

  useEffect(() => {
    const turnstile = window.turnstile;
    const container = containerRef.current;
    if (!scriptReady || !turnstile || !container) return;

    const widgetId = turnstile.render(container, {
      sitekey: siteKey,
      action: "ux_architect",
      callback: onToken,
      "expired-callback": () => onToken(""),
      "error-callback": () => {
        onToken("");
        setScriptFailed(true);
      },
    });

    return () => turnstile.remove(widgetId);
  }, [onToken, scriptReady, siteKey]);

  if (!siteKey) {
    return (
      <p role="alert" className="text-sm text-[var(--av-color-danger)]">
        Security verification is not configured. Please try again later.
      </p>
    );
  }

  return (
    <div className="grid gap-2">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => {
          if (window.turnstile) setScriptReady(true);
          else setScriptFailed(true);
        }}
        onError={() => setScriptFailed(true)}
      />
      <div ref={containerRef} />
      {scriptFailed ? (
        <p role="alert" className="text-sm text-[var(--av-color-danger)]">
          Security verification couldn&apos;t load. Refresh the page and try again.
        </p>
      ) : (
        <p className="text-xs text-[var(--av-color-muted)]">
          Complete the security check before generating a brief.
        </p>
      )}
    </div>
  );
}

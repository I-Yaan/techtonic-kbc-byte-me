"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import styles from "./ChatAgent.module.css";

type Message = { role: "user" | "model"; text: string };

type ChatAgentProps = {
  title?: string;
  emptyText?: string;
  placeholder?: string;
  endpoint?: string;
};

export default function ChatAgent({
  title = "Assistant",
  emptyText = "Pose ta question, l'assistant te répond en direct.",
  placeholder = "Écris ton message",
  endpoint = "/api/chat",
}: ChatAgentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Fait défiler la conversation vers le bas à chaque nouveau contenu.
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, error]);

  // Annule la requête en cours si le composant est démonté.
  useEffect(() => () => abortRef.current?.abort(), []);

  function resizeInput() {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }

  async function send(text: string) {
    const history: Message[] = [...messages, { role: "user", text }];
    setMessages([...history, { role: "model", text: "" }]);
    setInput("");
    setError(null);
    setLoading(true);
    requestAnimationFrame(resizeInput);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Erreur serveur (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          next[next.length - 1] = { ...last, text: last.text + chunk };
          return next;
        });
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
      // Retire la bulle vide du modèle si rien n'est arrivé.
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        return last?.role === "model" && last.text === "" ? prev.slice(0, -1) : prev;
      });
    } finally {
      setLoading(false);
      abortRef.current = null;
      inputRef.current?.focus();
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    void send(text);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    // Entrée envoie, Maj+Entrée ajoute un retour à la ligne.
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  function reset() {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
    setLoading(false);
  }

  return (
    <section className={styles.root} aria-label={title}>
      <header className={styles.header}>
        <span>{title}</span>
        {messages.length > 0 && (
          <button type="button" className={styles.link} onClick={reset}>
            Nouvelle conversation
          </button>
        )}
      </header>

      <div
        ref={logRef}
        className={styles.log}
        role="log"
        aria-live="polite"
        aria-busy={loading}
      >
        {messages.length === 0 && <p className={styles.empty}>{emptyText}</p>}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`${styles.msg} ${m.role === "user" ? styles.user : styles.model}`}
          >
            {m.text ||
              (loading && i === messages.length - 1 ? (
                <span className={styles.dots} aria-label="L'assistant écrit">
                  <i />
                  <i />
                  <i />
                </span>
              ) : null)}
          </div>
        ))}

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <textarea
          ref={inputRef}
          className={styles.input}
          value={input}
          rows={1}
          placeholder={placeholder}
          aria-label={placeholder}
          onChange={(e) => {
            setInput(e.target.value);
            resizeInput();
          }}
          onKeyDown={handleKeyDown}
        />
        {loading ? (
          <button
            type="button"
            className={`${styles.button} ${styles.secondary}`}
            onClick={() => abortRef.current?.abort()}
          >
            Arrêter
          </button>
        ) : (
          <button type="submit" className={styles.button} disabled={!input.trim()}>
            Envoyer
          </button>
        )}
      </form>
    </section>
  );
}
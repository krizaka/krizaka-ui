/** The showcase's own keyframes (the pulse, the typing dots, the caret), all stopped under reduced motion. */
export const CHAT_SHOWCASE_CSS = `
        @keyframes kzc-pulse {
          0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--kz-success) 55%, transparent); }
          70%, 100% { box-shadow: 0 0 0 6px color-mix(in srgb, var(--kz-success) 0%, transparent); }
        }
        @keyframes kzc-typing {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes kzc-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .kzc-dot { animation: kzc-pulse 2s ease-out infinite; }
        .kzc-typing { animation: kzc-typing 1.1s ease-in-out infinite; }
        .kzc-typing:nth-child(2) { animation-delay: 0.18s; } .kzc-typing:nth-child(3) { animation-delay: 0.36s; }
        .kzc-caret { animation: kzc-blink 1s steps(2) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .kzc-dot, .kzc-typing, .kzc-caret { animation: none; }
        }
      `;

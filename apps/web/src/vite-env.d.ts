/// <reference types="vite/client" />

// Ambient declaration for process.env used in @app/config
declare const process: { env: Record<string, string | undefined> };

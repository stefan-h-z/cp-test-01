// Ambient declaration for process.env
// This ensures TypeScript knows about process.env regardless of whether @types/node is available
// (needed when consumer projects like @app/web compile this package's source directly)
declare const process: { env: Record<string, string | undefined> };

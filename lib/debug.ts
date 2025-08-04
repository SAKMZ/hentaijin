// Debug utility to help diagnose server-side issues
export function serverDebug(context: string, data?: any) {
  if (typeof window === "undefined") {
    // Server-side logging
    console.log(`[SERVER DEBUG] ${context}:`, data || "No data");
  }
}

export function clientDebug(context: string, data?: any) {
  if (typeof window !== "undefined") {
    // Client-side logging
    console.log(`[CLIENT DEBUG] ${context}:`, data || "No data");
  }
}

// Safe error logging that works on both server and client
export function safeError(context: string, error: any) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error(
    `[${
      typeof window === "undefined" ? "SERVER" : "CLIENT"
    } ERROR] ${context}:`,
    errorMessage
  );
}

export async function sendChatStream(
  messages,
  onToken,
  onEnd,
) {
  const res = await fetch("/api/chat/stream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok || !res.body) {
    throw new Error("Error conectando al stream");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // SSE separa mensajes por doble salto de línea
    const parts = buffer.split("\n\n");
    buffer = parts.pop() || "";

    for (const part of parts) {
      // token normal
      if (part.startsWith("data: ")) {
        const tokenText = part.replace("data: ", "");
        onToken(tokenText);
      }

      // fin del stream
      if (part.includes("event: end")) {
        onEnd?.();
        return;
      }
    }
  }
}

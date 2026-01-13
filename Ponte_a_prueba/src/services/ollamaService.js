export async function sendChat(messages, token) {
  const res = await fetch("https://bakend-murex.vercel.app/api/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ messages })
  });

  let data;
  try {
    data = await res.json(); // intenta parsear JSON
  // eslint-disable-next-line no-unused-vars
  } catch (e) {
    data = { message: 'No hay respuesta JSON del backend' };
  }

  if (!res.ok) {
    throw new Error(data.message || "Error en el backend");
  }

  return data;
}

import { API_BASE_URL } from '@/config/api'

export async function sendChat(messages, token) {
  const res = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ messages })
  });

  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = { message: 'No hay respuesta JSON del backend' };
  }

  if (!res.ok) {
    throw new Error(data.message || "Error en el backend");
  }

  return data;
}

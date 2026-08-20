// api/groq.js

export async function enviar(mensagem) {
    const rawKey = import.meta.env.VITE_GROQ_API_KEY;

    if (!rawKey) {
        throw new Error("Chave VITE_GROQ_API_KEY não encontrada no arquivo .env");
    }

    const apiKey = rawKey.trim();

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'openai/gpt-oss-120b',
            messages: [
                {
                    role: 'system',
                    content: 'Você é um assistente especialista em programação e assets para jogos. Se o usuário pedir um código, estrutura de dados ou script, retorne APENAS o código/conteúdo puro, sem saudações ou explicações.'
                },
                {
                    role: 'user',
                    content: mensagem
                }
            ]
        })
    });

    const data = await response.json();

    if (!response.ok || data.error) {
        throw new Error(data.error?.message || `Erro HTTP ${response.status}`);
    }

    return data.choices[0]?.message?.content || "Sem resposta";
}
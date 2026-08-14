export async function enviar(mensagem) {
    const apiKey = import.meta.env.API_KEY;

    if (!apiKey) {
        throw new Error("Chave de ia não encontrada");
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [{
                role: 'system',
                content: 'Você é um assistente especialista em criação de assets para jogos e design.'
            },
            {
                role: 'user',
                content: mensagem
            }
            ]
        })
    });

    const data = await response.json();

    if (data.error) {
        throw new Error(data.error.message);
    }

    return data.choices[0]?.message?.content || "Sem resposta";

}
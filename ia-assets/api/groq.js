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
            
        })
    }
    )
}
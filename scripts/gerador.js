async function diagnostico() {
    console.log("Iniciando Raio-X da Chave de API...");
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
        console.error("ERRO: A chave da API não foi carregada pelo GitHub!");
        process.exit(1);
    }

    // Usando o fetch nativo do Node.js para perguntar os modelos direto na fonte
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        console.log("\n=== MODELOS AUTORIZADOS PARA A SUA CHAVE ===");
        if (data.models) {
            // Pega apenas os nomes dos modelos e imprime um em cada linha
            const nomes = data.models.map(m => m.name);
            console.log(nomes.join('\n'));
        } else {
            console.log("Resposta inesperada do Google:", data);
        }
        console.log("============================================\n");
        
        // Força a parada do robô para lermos o log
        console.error("RAIO-X CONCLUÍDO. Me envie a lista que apareceu acima!");
        process.exit(1); 
        
    } catch (error) {
        console.error("Falha no diagnóstico:", error);
        process.exit(1);
    }
}

diagnostico();

const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Configuração da API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function iniciarAutomacao() {
    const cronogramaPath = path.join(__dirname, '..', 'cronograma.json');
    const manualPath = path.join(__dirname, '..', 'site-context.md');
    const hostingerDir = path.join(__dirname, '..', 'hostinger');

    const cronograma = JSON.parse(fs.readFileSync(cronogramaPath, 'utf8'));
    const manualContexto = fs.readFileSync(manualPath, 'utf8');
    
    const hoje = new Date().toLocaleString("en-CA", {timeZone: "America/Sao_Paulo"}).split(',')[0];
    const tarefa = cronograma.agenda.find(t => t.data_criacao === hoje && t.status === "pendente");

    if (!tarefa) {
        console.log("Nada agendado para hoje. Data verificada: " + hoje);
        return;
    }

    const indexAtual = fs.readFileSync(path.join(hostingerDir, 'index.html'), 'utf8');
    const apiAtual = fs.readFileSync(path.join(hostingerDir, 'api.php'), 'utf8');

    console.log(`🚀 Iniciando Geração: ${tarefa.livro} (Modelo: gemini-2.5-flash)`);

    // MODELO ATUALIZADO PARA 2026 CONFORME SEU RAIO-X
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const promptMestre = `
        Aja como Arquiteto de Software e Erudito Bíblico. Gere o conteúdo em JSON.
        
        LIVRO ATUAL: ${tarefa.livro}
        CAPÍTULOS: ${tarefa.capitulos}
        PERÍODO: ${tarefa.periodo_leitura}
        DATA DO QUIZ: ${tarefa.data_quiz}
        
        REGRAS DO MANUAL:
        ${manualContexto}

        ARQUIVOS BASE PARA ATUALIZAR:
        INDEX: ${indexAtual}
        API: ${apiAtual}

        RESPONDA APENAS COM O JSON NESTE FORMATO:
        {
            "livro_html": "texto completo do novo arquivo .html",
            "quiz_html": "texto completo do novo arquivo quiz_.html",
            "index_html": "index atualizado com o novo livro",
            "api_php": "api.php com a nova rota de ranking"
        }
    `;

    try {
        const result = await model.generateContent(promptMestre);
        let text = result.response.text();
        
        // Limpeza de segurança para o JSON
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const resposta = JSON.parse(text);

        // Salvando os novos arquivos
        fs.writeFileSync(path.join(hostingerDir, `${tarefa.livro.toLowerCase()}.html`), resposta.livro_html);
        fs.writeFileSync(path.join(hostingerDir, `quiz_${tarefa.livro.toLowerCase()}.html`), resposta.quiz_html);
        fs.writeFileSync(path.join(hostingerDir, 'index.html'), resposta.index_html);
        fs.writeFileSync(path.join(hostingerDir, 'api.php'), resposta.api_php);

        // Atualizando o cronograma
        tarefa.status = "concluido";
        fs.writeFileSync(cronogramaPath, JSON.stringify(cronograma, null, 2));
        
        console.log("✅ Tudo pronto! Arquivos gerados e cronograma salvo.");
    } catch (error) {
        console.error("❌ Erro na geração:", error.message);
        throw error;
    }
}

iniciarAutomacao().catch(() => process.exit(1));

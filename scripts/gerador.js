const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

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
        console.log("Nada agendado para hoje.");
        return;
    }

    const indexAtual = fs.readFileSync(path.join(hostingerDir, 'index.html'), 'utf8');
    const apiAtual = fs.readFileSync(path.join(hostingerDir, 'api.php'), 'utf8');

    console.log(`Gerando conteúdo para: ${tarefa.livro}...`);

    // Usando o modelo FLASH para maior estabilidade e velocidade na API
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const promptMestre = `
        Aja como Arquiteto de Software e Erudito Bíblico. Responda APENAS com um objeto JSON válido.
        
        TAREFA: Gerar arquivos para o livro de ${tarefa.livro}.
        - Capítulos: ${tarefa.capitulos}
        - Período de Leitura: ${tarefa.periodo_leitura}
        - Data do Quiz: ${tarefa.data_quiz}
        
        MANUAL E REGRAS:
        ${manualContexto}

        CÓDIGO BASE (REESCRITA COMPLETA):
        --- INDEX.HTML ---
        ${indexAtual}
        --- API.PHP ---
        ${apiAtual}

        RESPONDA NESSE FORMATO JSON:
        {
            "livro_html": "código completo",
            "quiz_html": "código completo",
            "index_html": "código completo",
            "api_php": "código completo"
        }
    `;

    const result = await model.generateContent(promptMestre);
    let text = result.response.text();
    
    // Limpeza de Markdown caso a IA envie
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const resposta = JSON.parse(text);

    fs.writeFileSync(path.join(hostingerDir, `${tarefa.livro.toLowerCase()}.html`), resposta.livro_html);
    fs.writeFileSync(path.join(hostingerDir, `quiz_${tarefa.livro.toLowerCase()}.html`), resposta.quiz_html);
    fs.writeFileSync(path.join(hostingerDir, 'index.html'), resposta.index_html);
    fs.writeFileSync(path.join(hostingerDir, 'api.php'), resposta.api_php);

    tarefa.status = "concluido";
    fs.writeFileSync(cronogramaPath, JSON.stringify(cronograma, null, 2));
    
    console.log("Sucesso! Arquivos criados localmente.");
}

// O segredo está aqui: process.exit(1) faz o GitHub Actions entender o erro
iniciarAutomacao().catch(err => {
    console.error("ERRO FATAL:", err);
    process.exit(1); 
});

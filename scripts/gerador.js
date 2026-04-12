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
    
    // Pega a data de hoje (Fuso Brasília)
    const hoje = new Date().toLocaleString("en-CA", {timeZone: "America/Sao_Paulo"}).split(',')[0];
    const tarefa = cronograma.agenda.find(t => t.data_criacao === hoje && t.status === "pendente");

    if (!tarefa) {
        console.log("Nada agendado para hoje.");
        return;
    }

    // Lendo arquivos atuais para reescrita completa
    const indexAtual = fs.readFileSync(path.join(hostingerDir, 'index.html'), 'utf8');
    const apiAtual = fs.readFileSync(path.join(hostingerDir, 'api.php'), 'utf8');

    console.log(`Gerando conteúdo para: ${tarefa.livro}...`);

    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-pro",
        generationConfig: { responseMimeType: "application/json" } // Força a IA a responder em JSON
    });

    const promptMestre = `
        Aja como Arquiteto de Software e Erudito Bíblico. Com base no MANUAL DE IDENTIDADE anexo, gere os arquivos para o livro de ${tarefa.livro}.
        
        DADOS DA TAREFA:
        - Livro: ${tarefa.livro}
        - Capítulos: ${tarefa.capitulos}
        - Período de Leitura: ${tarefa.periodo_leitura}
        - Data do Quiz: ${tarefa.data_quiz}
        
        REGRAS CRICIAIS DO MANUAL:
        1. Use a COR e ÍCONE da Matriz para ${tarefa.livro}.
        2. EXEGESE: Use termos em Grego/Hebraico itálico. 3 tópicos (H3) por capítulo.
        3. REESCRITA: Atualize o index.html (mova o livro anterior para desafios e coloque ${tarefa.livro} como atual).
        4. API: Adicione rotas PDO para ranking_${tarefa.livro.toLowerCase()}.
        5. QUIZ: Gere o arquivo com 15 perguntas (mostrando 10 aleatórias).
        
        CONTEÚDO ATUAL PARA REFERÊNCIA (REESCRITA COMPLETA):
        --- INDEX.HTML ATUAL ---
        ${indexAtual}
        --- API.PHP ATUAL ---
        ${apiAtual}
        --- MANUAL ---
        ${manualContexto}

        RESPONDA EXCLUSIVAMENTE NO FORMATO JSON ABAIXO:
        {
            "livro_html": "conteúdo completo do arquivo ${tarefa.livro.toLowerCase()}.html",
            "quiz_html": "conteúdo completo do arquivo quiz_${tarefa.livro.toLowerCase()}.html",
            "index_html": "conteúdo completo do index.html atualizado",
            "api_php": "conteúdo completo do api.php atualizado"
        }
    `;

    const result = await model.generateContent(promptMestre);
    const resposta = JSON.parse(result.response.text());

    // Salvando os arquivos gerados
    fs.writeFileSync(path.join(hostingerDir, `${tarefa.livro.toLowerCase()}.html`), resposta.livro_html);
    fs.writeFileSync(path.join(hostingerDir, `quiz_${tarefa.livro.toLowerCase()}.html`), resposta.quiz_html);
    fs.writeFileSync(path.join(hostingerDir, 'index.html'), resposta.index_html);
    fs.writeFileSync(path.join(hostingerDir, 'api.php'), resposta.api_php);

    // Marcar como concluído
    tarefa.status = "concluido";
    fs.writeFileSync(cronogramaPath, JSON.stringify(cronograma, null, 2));
    
    console.log("Arquivos gerados e cronograma atualizado!");
}

iniciarAutomacao().catch(console.error);

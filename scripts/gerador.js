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

    // --- BLOCO DE DIAGNÓSTICO ---
    console.log("Verificando modelos disponíveis para sua chave...");
    // Forçamos a versão 'v1' da API que é a mais estável para os modelos 1.5
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: 'v1' });
    // ----------------------------

    const indexAtual = fs.readFileSync(path.join(hostingerDir, 'index.html'), 'utf8');
    const apiAtual = fs.readFileSync(path.join(hostingerDir, 'api.php'), 'utf8');

    console.log(`Gerando conteúdo para: ${tarefa.livro}...`);

    const promptMestre = `
        Aja como Arquiteto de Software. Responda APENAS com JSON.
        TAREFA: Gerar arquivos para o livro de ${tarefa.livro}.
        REGRAS: ${manualContexto}
        HTML BASE: ${indexAtual}
        PHP BASE: ${apiAtual}
        FORMATO DE RESPOSTA: {"livro_html": "", "quiz_html": "", "index_html": "", "api_php": ""}
    `;

    try {
        const result = await model.generateContent(promptMestre);
        let text = result.response.text();
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const resposta = JSON.parse(text);

        fs.writeFileSync(path.join(hostingerDir, `${tarefa.livro.toLowerCase()}.html`), resposta.livro_html);
        fs.writeFileSync(path.join(hostingerDir, `quiz_${tarefa.livro.toLowerCase()}.html`), resposta.quiz_html);
        fs.writeFileSync(path.join(hostingerDir, 'index.html'), resposta.index_html);
        fs.writeFileSync(path.join(hostingerDir, 'api.php'), resposta.api_php);

        tarefa.status = "concluido";
        fs.writeFileSync(cronogramaPath, JSON.stringify(cronograma, null, 2));
        console.log("Sucesso absoluto!");
    } catch (error) {
        console.error("Erro na chamada da IA. Detalhes técnicos:", error.message);
        throw error;
    }
}

iniciarAutomacao().catch(err => {
    process.exit(1);
});

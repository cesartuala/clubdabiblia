const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// ============================================================================
// CONFIGURAÇÃO DE SEGURANÇA
// ============================================================================
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("❌ ERRO: GEMINI_API_KEY não configurada.");
    process.exit(1);
}
const genAI = new GoogleGenerativeAI(apiKey);

async function iniciarAutomacao() {
    console.log("==================================================");
    console.log("🚀 INICIANDO GERADOR CLUBE DA BÍBLIA (V. FINAL)");
    console.log("==================================================");

    const cronogramaPath = path.join(__dirname, '..', 'cronograma.json');
    const manualPath = path.join(__dirname, '..', 'site-context.md');
    const hostingerDir = path.join(__dirname, '..', 'hostinger');

    const cronograma = JSON.parse(fs.readFileSync(cronogramaPath, 'utf8'));
    const hoje = new Date().toLocaleString("en-CA", {timeZone: "America/Sao_Paulo"}).split(',')[0];
    const tarefa = cronograma.agenda.find(t => t.data_criacao === hoje && t.status === "pendente");

    if (!tarefa) {
        console.log(`☕ Nada agendado para hoje (${hoje}).`);
        return;
    }

    // Leitura dos arquivos base (Removido api.php do contexto por segurança)
    const manualContexto = fs.readFileSync(manualPath, 'utf8');
    const indexAtual = fs.readFileSync(path.join(hostingerDir, 'index.html'), 'utf8');
    const moldeDesign = fs.readFileSync(path.join(hostingerDir, 'efesios.html'), 'utf8');

    console.log(`📖 Processando: ${tarefa.livro}...`);

    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        systemInstruction: "Você é um Engenheiro de Software Sênior. Sua saída deve ser EXCLUSIVAMENTE JSON. Proibido resumir código ou usar placeholders."
    });

    const promptMestre = `
        Aja como Arquiteto de Software e Erudito Bíblico Sênior.
        Gere os arquivos completos para o livro: ${tarefa.livro}.
        
        REGRAS DE OURO:
        1. REESCRITA INTEGRAL: Nunca use "// ... resto do código" ou placeholders. 
        2. BIBLE DATA: A constante 'const bibleData' dentro do <script> deve ser TOTALMENTE preenchida com o conteúdo real de ${tarefa.livro} (Introdução, Autor e capítulos 1 a ${tarefa.capitulos}).
        3. EXEGESE PROFUNDA: Cada capítulo deve ter Contexto, Análise Teológica e Aplicação, com pelo menos 2 termos em Grego/Hebraico originais.
        4. SINCRONIA: O 'chapterSelect' deve ter opções que correspondam exatamente às chaves do seu 'bibleData'.

        --- ARQUIVOS BASE PARA MANTER O PADRÃO ---
        MOLDE DESIGN: ${moldeDesign}
        INDEX ATUAL: ${indexAtual}

        RESPONDA EXCLUSIVAMENTE COM O JSON:
        {
            "livro_html": "código completo do arquivo .html com bibleData preenchido",
            "quiz_html": "código completo do quiz",
            "index_html": "index atualizado",
            "api_php": "api.php completo"
        }
    `;

    try {
        const result = await model.generateContent(promptMestre);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        
        if (!jsonMatch) throw new Error("IA não devolveu JSON.");
        const resposta = JSON.parse(jsonMatch[0]);

        // Escrita dos arquivos (api.php não é mais sobrescrito aqui)
        fs.writeFileSync(path.join(hostingerDir, `${tarefa.livro.toLowerCase()}.html`), resposta.livro_html);
        fs.writeFileSync(path.join(hostingerDir, `quiz_${tarefa.livro.toLowerCase()}.html`), resposta.quiz_html);
        fs.writeFileSync(path.join(hostingerDir, 'index.html'), resposta.index_html);

        // Update Cronograma
        tarefa.status = "concluido";
        fs.writeFileSync(cronogramaPath, JSON.stringify(cronograma, null, 2));
        
        console.log(`✅ Sucesso! Conteúdo de ${tarefa.livro} gerado. O api.php permanece intacto.`);
    } catch (err) {
        console.error("❌ Erro:", err.message);
        process.exit(1);
    }
}

iniciarAutomacao();

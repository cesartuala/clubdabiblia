const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// ============================================================================
// CONFIGURAÇÃO DE SEGURANÇA E API
// ============================================================================
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("❌ ERRO: GEMINI_API_KEY não configurada.");
    process.exit(1);
}
const genAI = new GoogleGenerativeAI(apiKey);

async function iniciarAutomacao() {
    console.log("==================================================");
    console.log("🚀 INICIANDO GERADOR CLUBE DA BÍBLIA (V. ANTI-FALHA)");
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

    const manualContexto = fs.readFileSync(manualPath, 'utf8');
    const indexAtual = fs.readFileSync(path.join(hostingerDir, 'index.html'), 'utf8');
    const moldeDesign = fs.readFileSync(path.join(hostingerDir, 'efesios.html'), 'utf8');

    console.log(`📖 Processando: ${tarefa.livro}... Isso pode levar até 3 minutos.`);

    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        systemInstruction: "Você é um Arquiteto de Software e Erudito Sênior. É expressamente PROIBIDO o uso de placeholders. Gere arquivos com código robusto e resiliente a erros de banco de dados."
    });

    const promptMestre = `
        MANUAL DE REGRAS: 
        ${manualContexto}

        --- TAREFA ---
        Gerar arquivos completos para o livro: ${tarefa.livro}. Capítulos: ${tarefa.capitulos}.
        
        --- REGRAS DE CÓDIGO (CRÍTICO) ---
        1. JAVASCRIPT SEGURO: Na função carregarComentarios, SEMPRE verifique se os dados recebidos são um Array antes de usar .forEach() (Ex: if(!Array.isArray(data)) return). Isso evita que o site trave se o banco falhar.
        2. VISIBILIDADE: No HTML gerado para as seções de conteúdo, certifique-se de que a classe 'active' seja adicionada ou que o script de 'IntersectionObserver' seja resiliente para que o texto não fique invisível (opacity-0).
        3. ESCAPE DE CARACTERES: Não utilize crases (backticks \`) dentro das strings de exegese no objeto 'bibleData', pois isso quebra o JavaScript. Use aspas simples ou duplas.
        4. BIBLE DATA: Preencha o objeto 'const bibleData' integralmente com conteúdo teológico profundo.

        --- LÓGICA DO INDEX.HTML ---
        Atualize os 3 status (Leitura Atual, Desafio Aberto e Arquivo) conforme o manual.

        --- REFERÊNCIAS ---
        MOLDE DESIGN: ${moldeDesign}
        INDEX ATUAL: ${indexAtual}

        --- FORMATO EXATO DE RESPOSTA ---
        NÃO UTILIZE JSON! Use os separadores:

        [INICIO_LIVRO]
        (código HTML do livro)
        [FIM_LIVRO]

        [INICIO_QUIZ]
        (código HTML do quiz)
        [FIM_QUIZ]

        [INICIO_INDEX]
        (index.html atualizado)
        [FIM_INDEX]
    `;

    try {
        const result = await model.generateContent(promptMestre);
        const text = result.response.text();
        
        const livroMatch = text.match(/\[INICIO_LIVRO\]([\s\S]*?)\[FIM_LIVRO\]/);
        const quizMatch = text.match(/\[INICIO_QUIZ\]([\s\S]*?)\[FIM_QUIZ\]/);
        const indexMatch = text.match(/\[INICIO_INDEX\]([\s\S]*?)\[FIM_INDEX\]/);

        if (!livroMatch || !quizMatch || !indexMatch) {
            console.error("❌ ERRO: A IA falhou nos separadores.");
            process.exit(1);
        }

        const livroHtml = livroMatch[1].replace(/^```html/i, '').replace(/```$/, '').trim();
        const quizHtml = quizMatch[1].replace(/^```html/i, '').replace(/```$/, '').trim();
        const indexHtml = indexMatch[1].replace(/^```html/i, '').replace(/```$/, '').trim();

        fs.writeFileSync(path.join(hostingerDir, `${tarefa.livro.toLowerCase()}.html`), livroHtml);
        fs.writeFileSync(path.join(hostingerDir, `quiz_${tarefa.livro.toLowerCase()}.html`), quizHtml);
        fs.writeFileSync(path.join(hostingerDir, 'index.html'), indexHtml);

        tarefa.status = "concluido";
        fs.writeFileSync(cronogramaPath, JSON.stringify(cronograma, null, 2));
        
        console.log(`🎉 Sucesso! Código de ${tarefa.livro} gerado com travas de segurança.`);
    } catch (err) {
        console.error("❌ Erro Crítico:", err.message);
        process.exit(1);
    }
}

iniciarAutomacao();

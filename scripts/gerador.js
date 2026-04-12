const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("❌ ERRO: GEMINI_API_KEY não configurada.");
    process.exit(1);
}
const genAI = new GoogleGenerativeAI(apiKey);

async function iniciarAutomacao() {
    console.log("==================================================");
    console.log("🚀 INICIANDO GERADOR CLUBE DA BÍBLIA (V. AGENDADOR)");
    console.log("==================================================");

    const cronogramaPath = path.join(__dirname, '..', 'cronograma.json');
    const manualPath = path.join(__dirname, '..', 'site-context.md');
    const hostingerDir = path.join(__dirname, '..', 'hostinger');

    const cronograma = JSON.parse(fs.readFileSync(cronogramaPath, 'utf8'));
    
    // Datas para comparação
    const hojeOriginal = new Date().toLocaleString("en-CA", {timeZone: "America/Sao_Paulo"}).split(',')[0]; 
    const hojeFormatado = new Date().toLocaleDateString("pt-BR", {timeZone: "America/Sao_Paulo"}).substring(0, 5); 

    // 1. TAREFA DE CRIAÇÃO (Novo Livro)
    const tarefaCriacao = cronograma.agenda.find(t => t.data_criacao === hojeOriginal && t.status === "pendente");

    // 2. TAREFA DE DESBLOQUEIO (Ativar Quiz que já existe)
    // Procuramos um livro que já foi concluído, cuja data de quiz seja hoje e que ainda não tenha tido o quiz ativado no index
    const tarefaQuiz = cronograma.agenda.find(t => t.data_quiz === hojeFormatado && t.status === "concluido" && t.quiz_ativo !== true);

    if (!tarefaCriacao && !tarefaQuiz) {
        console.log(`☕ Nada para criar ou desbloquear hoje (${hojeOriginal}).`);
        return;
    }

    const manualContexto = fs.readFileSync(manualPath, 'utf8');
    const indexAtual = fs.readFileSync(path.join(hostingerDir, 'index.html'), 'utf8');
    const moldeDesign = fs.readFileSync(path.join(hostingerDir, 'efesios.html'), 'utf8');

    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        systemInstruction: "Você é um Arquiteto de Software e Erudito Sênior. Responda apenas com os blocos marcados pelos separadores."
    });

    let promptMestre = `
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
    let tarefaAtual = tarefaCriacao || tarefaQuiz;

    if (tarefaCriacao) {
        console.log(`📖 Criando novo livro: ${tarefaCriacao.livro}...`);
        promptMestre = `
            ${manualContexto}
            TAREFA: Gerar arquivos para o novo livro ${tarefaCriacao.livro}.
            1. Crie o card no topo do index.html como 'Leitura Atual' e QUIZ BLOQUEADO (opacity-50).
            2. Mova o livro anterior para 'Desafios Abertos' e ATIVE o quiz dele.
            3. Gere o arquivo ${tarefaCriacao.livro.toLowerCase()}.html e quiz_${tarefaCriacao.livro.toLowerCase()}.html.
            
            REFERÊNCIAS: Molde: ${moldeDesign} | Index: ${indexAtual}
            USE OS SEPARADORES: [INICIO_LIVRO], [FIM_LIVRO], [INICIO_QUIZ], [FIM_QUIZ], [INICIO_INDEX], [FIM_INDEX].
        `;
    } else if (tarefaQuiz) {
        console.log(`🔓 Desbloqueando Quiz de: ${tarefaQuiz.livro}...`);
        promptMestre = `
            ${manualContexto}
            TAREFA: Apenas desbloquear o quiz do livro ${tarefaQuiz.livro} no index.html.
            1. Localize o card de ${tarefaQuiz.livro}.
            2. Remova 'opacity-50' e 'pointer-events-none' do botão de Quiz.
            3. Mude o selo de 'Leitura Atual' para 'Desafio Aberto'.
            4. Garanta que no JavaScript o fetch para 'ranking_${tarefaQuiz.livro.toLowerCase()}' esteja funcionando.
            
            REFERÊNCIA: Index Atual: ${indexAtual}
            RETORNE APENAS O INDEX: [INICIO_INDEX] ... [FIM_INDEX].
        `;
    }

    try {
        const result = await model.generateContent(promptMestre);
        const text = result.response.text();
        
        // Extração do Index (sempre presente)
        const indexMatch = text.match(/\[INICIO_INDEX\]([\s\S]*?)\[FIM_INDEX\]/);
        if (indexMatch) {
            fs.writeFileSync(path.join(hostingerDir, 'index.html'), indexMatch[1].trim());
        }

        // Extração de Livro e Quiz (apenas se for criação)
        if (tarefaCriacao) {
            const livroMatch = text.match(/\[INICIO_LIVRO\]([\s\S]*?)\[FIM_LIVRO\]/);
            const quizMatch = text.match(/\[INICIO_QUIZ\]([\s\S]*?)\[FIM_QUIZ\]/);
            if (livroMatch) fs.writeFileSync(path.join(hostingerDir, `${tarefaCriacao.livro.toLowerCase()}.html`), livroMatch[1].trim());
            if (quizMatch) fs.writeFileSync(path.join(hostingerDir, `quiz_${tarefaCriacao.livro.toLowerCase()}.html`), quizMatch[1].trim());
            
            tarefaCriacao.status = "concluido";
        }

        if (tarefaQuiz) {
            tarefaQuiz.quiz_ativo = true; // Marca como ativo para não repetir amanhã
        }

        // Salva o novo estado do cronograma
        fs.writeFileSync(cronogramaPath, JSON.stringify(cronograma, null, 2));
        console.log(`✅ Operação concluída com sucesso para ${tarefaAtual.livro}.`);

    } catch (err) {
        console.error("❌ Erro:", err.message);
        process.exit(1);
    }
}

iniciarAutomacao();

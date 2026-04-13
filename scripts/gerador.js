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
    console.log("🚀 INICIANDO GERADOR CLUBE DA BÍBLIA (V. MÁXIMA)");
    console.log("==================================================");

    const cronogramaPath = path.join(__dirname, '..', 'cronograma.json');
    const manualPath = path.join(__dirname, '..', 'site-context.md');
    const hostingerDir = path.join(__dirname, '..', 'hostinger');

    const cronograma = JSON.parse(fs.readFileSync(cronogramaPath, 'utf8'));
    
    // Configuração de datas para o Brasil
    const dataAtual = new Date().toLocaleString("en-CA", {timeZone: "America/Sao_Paulo"});
    const hojeOriginal = dataAtual.split(',')[0]; // Ex: 2026-04-12
    const hojeFormatado = new Date().toLocaleDateString("pt-BR", {timeZone: "America/Sao_Paulo"}).substring(0, 5); // Ex: 12/04

    // 1. TAREFA DE CRIAÇÃO (Gera Livro, Quiz e atualiza Index)
    const tarefaCriacao = cronograma.agenda.find(t => t.data_criacao === hojeOriginal && t.status === "pendente");

    // 2. TAREFA DE DESBLOQUEIO (Apenas ativa o botão de Quiz de um livro já concluído)
    const tarefaQuiz = cronograma.agenda.find(t => t.data_quiz === hojeFormatado && t.status === "concluido" && t.quiz_ativo !== true);

    if (!tarefaCriacao && !tarefaQuiz) {
        console.log(`☕ Nada agendado para criar ou desbloquear hoje (${hojeOriginal} - ${hojeFormatado}).`);
        return;
    }

    const manualContexto = fs.readFileSync(manualPath, 'utf8');
    const indexAtual = fs.readFileSync(path.join(hostingerDir, 'index.html'), 'utf8');
    const moldeDesign = fs.readFileSync(path.join(hostingerDir, 'efesios.html'), 'utf8');

    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        systemInstruction: "Você é um Arquiteto de Software e Erudito Sênior. É expressamente PROIBIDO o uso de placeholders (ex: // resto do código). Gere arquivos com código robusto e resiliente a erros de banco de dados. Responda apenas com os blocos marcados pelos separadores."
    });

    let promptMestre = "";
    let tarefaAtual = tarefaCriacao || tarefaQuiz;

    // --- LÓGICA 1: CRIAÇÃO COMPLETA DE NOVO LIVRO ---
    if (tarefaCriacao) {
        console.log(`📖 Processando criação do livro: ${tarefaCriacao.livro}... Isso pode levar até 3 minutos.`);
        promptMestre = `
            MANUAL DE REGRAS: 
            ${manualContexto}

            --- TAREFA ---
            Gerar arquivos completos para o livro: ${tarefaCriacao.livro}. Capítulos: ${tarefaCriacao.capitulos}.
            
            --- REGRAS DE CÓDIGO (CRÍTICO) ---
            1. JAVASCRIPT SEGURO: Na função carregarComentarios, SEMPRE verifique se os dados recebidos são um Array antes de usar .forEach() (Ex: if(!Array.isArray(data)) return). Isso evita que o site trave se o banco falhar.
            2. VISIBILIDADE: No HTML gerado para as seções de conteúdo, certifique-se de que a classe 'active' seja adicionada ou que o script de 'IntersectionObserver' seja resiliente para que o texto não fique invisível (opacity-0).
            3. ESCAPE DE CARACTERES: Não utilize crases (backticks \`) dentro das strings de exegese no objeto 'bibleData', pois isso quebra o JavaScript. Use aspas simples ou duplas.
            4. BIBLE DATA: Preencha o objeto 'const bibleData' integralmente com conteúdo teológico profundo, do primeiro ao último capítulo especificado.

            --- LÓGICA DO INDEX.HTML ---
            1. Crie o card de ${tarefaCriacao.livro} no topo com selo "Leitura Atual". Botão de Quiz desativado (opacity-50).
            2. Mova o livro anterior para "Desafios Abertos" e ATIVE o quiz dele.
            3. Remova selos de destaque dos livros mais antigos.
            4. Atualize o fetch de rankings no final do index.html.

            --- REFERÊNCIAS ---
            MOLDE DESIGN: ${moldeDesign}
            INDEX ATUAL: ${indexAtual}

            --- FORMATO EXATO DE RESPOSTA ---
            NÃO UTILIZE JSON! Use os separadores estritamente:

            [INICIO_LIVRO]
            (código HTML completo do novo livro)
            [FIM_LIVRO]

            [INICIO_QUIZ]
            (código HTML completo do quiz)
            [FIM_QUIZ]

            [INICIO_INDEX]
            (código HTML do index.html atualizado)
            [FIM_INDEX]
        `;
    } 
    // --- LÓGICA 2: APENAS DESBLOQUEIO DO QUIZ ---
    else if (tarefaQuiz) {
        console.log(`🔓 Desbloqueando Quiz agendado para: ${tarefaQuiz.livro}...`);
        promptMestre = `
            MANUAL DE REGRAS: 
            ${manualContexto}

            --- TAREFA DE ATUALIZAÇÃO ---
            O livro ${tarefaQuiz.livro} já concluiu seu período de leitura. Sua missão é apenas atualizar o index.html para liberar o Quiz.
            
            1. Localize o card de ${tarefaQuiz.livro} no index.html.
            2. Remova as classes 'opacity-50' e 'pointer-events-none' do botão de Quiz desse card.
            3. Mude o selo visual de 'Leitura Atual' para 'Desafio Aberto'.
            4. Garanta que a função fetch('api.php?acao=ranking_${tarefaQuiz.livro.toLowerCase()}') esteja presente e ativa no JavaScript no final do arquivo.
            
            --- REFERÊNCIA ---
            INDEX ATUAL: ${indexAtual}

            --- FORMATO EXATO DE RESPOSTA ---
            NÃO UTILIZE JSON! Retorne apenas o código do index atualizado usando os separadores:

            [INICIO_INDEX]
            (código HTML do index.html atualizado)
            [FIM_INDEX]
        `;
    }

    try {
        const result = await model.generateContent(promptMestre);
        const text = result.response.text();
        
        console.log("✅ Resposta recebida da IA. Iniciando extração e limpeza...");

        // Extração do Index.html (Presente em ambas as lógicas)
        const indexMatch = text.match(/\[INICIO_INDEX\]([\s\S]*?)\[FIM_INDEX\]/);
        if (!indexMatch) {
            console.error("❌ ERRO: A IA falhou ao retornar o bloco [INICIO_INDEX].");
            process.exit(1);
        }
        const indexHtml = indexMatch[1].replace(/^```html/i, '').replace(/```$/, '').trim();
        fs.writeFileSync(path.join(hostingerDir, 'index.html'), indexHtml);

        // Extração de Livro e Quiz (Apenas na Lógica de Criação)
        if (tarefaCriacao) {
            const livroMatch = text.match(/\[INICIO_LIVRO\]([\s\S]*?)\[FIM_LIVRO\]/);
            const quizMatch = text.match(/\[INICIO_QUIZ\]([\s\S]*?)\[FIM_QUIZ\]/);
            
            if (!livroMatch || !quizMatch) {
                console.error("❌ ERRO: A IA falhou ao retornar os blocos de Livro ou Quiz.");
                process.exit(1);
            }

            const livroHtml = livroMatch[1].replace(/^```html/i, '').replace(/```$/, '').trim();
            const quizHtml = quizMatch[1].replace(/^```html/i, '').replace(/```$/, '').trim();
            
            fs.writeFileSync(path.join(hostingerDir, `${tarefaCriacao.livro.toLowerCase()}.html`), livroHtml);
            fs.writeFileSync(path.join(hostingerDir, `quiz_${tarefaCriacao.livro.toLowerCase()}.html`), quizHtml);
            
            // Marca a criação como concluída
            tarefaCriacao.status = "concluido";
        }

        // Marca o desbloqueio do quiz como concluído
        if (tarefaQuiz) {
            tarefaQuiz.quiz_ativo = true;
        }

        // Salva o novo estado no cronograma
        fs.writeFileSync(cronogramaPath, JSON.stringify(cronograma, null, 2));
        
        console.log(`🎉 Sucesso! Operação concluída com segurança para o livro ${tarefaAtual.livro}.`);
    } catch (err) {
        console.error("❌ Erro Crítico na geração:", err.message);
        process.exit(1);
    }
}

iniciarAutomacao();

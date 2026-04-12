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

    // Leitura dos arquivos base
    const manualContexto = fs.readFileSync(manualPath, 'utf8');
    const indexAtual = fs.readFileSync(path.join(hostingerDir, 'index.html'), 'utf8');
    const moldeDesign = fs.readFileSync(path.join(hostingerDir, 'efesios.html'), 'utf8');

    console.log(`📖 Processando: ${tarefa.livro}... Isso pode levar até 3 minutos.`);

    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        systemInstruction: "Você é um Arquiteto de Software e Erudito Sênior. É expressamente PROIBIDO o uso de placeholders (ex: // resto do código). Gere os arquivos por completo."
    });

    const promptMestre = `
        MANUAL DE REGRAS: 
        ${manualContexto}

        --- TAREFA ---
        Gerar arquivos completos para o livro: ${tarefa.livro}. Capítulos: ${tarefa.capitulos}.
        O objeto 'const bibleData' DEVE ser totalmente preenchido com a exegese teológica.
        
        --- LÓGICA DE MANIPULAÇÃO DO INDEX.HTML (3 STATUS) ---
        1. NOVO CARD: Crie o card de ${tarefa.livro} no topo com selo "Leitura Atual". Quiz desativado (opacity-50).
        2. MOVER ANTERIOR: O card no topo desce para "Desafios Abertos". Mude selo para "Desafio Aberto" e ATIVE o quiz/ranking.
        3. ARQUIVAR ANTIGOS: Remova selos de destaque dos demais.
        4. JAVASCRIPT: Atualize o fetch de rankings no final do index.html.

        --- REFERÊNCIAS ---
        MOLDE DESIGN: ${moldeDesign}
        INDEX ATUAL: ${indexAtual}

        --- FORMATO EXATO DE RESPOSTA ---
        NÃO UTILIZE JSON! Envie a sua resposta usando estritamente os separadores abaixo. Não adicione blocos de código markdown (\`\`\`) antes ou depois dos separadores.

        [INICIO_LIVRO]
        (insira aqui o código HTML completo do livro com o bibleData preenchido)
        [FIM_LIVRO]

        [INICIO_QUIZ]
        (insira aqui o código HTML completo do quiz)
        [FIM_QUIZ]

        [INICIO_INDEX]
        (insira aqui o código HTML completo do index.html atualizado)
        [FIM_INDEX]
    `;

    try {
        const result = await model.generateContent(promptMestre);
        const text = result.response.text();
        
        console.log("✅ Resposta recebida da IA. Extraindo arquivos...");

        // Usando Regex para capturar o conteúdo entre os separadores
        const livroMatch = text.match(/\[INICIO_LIVRO\]([\s\S]*?)\[FIM_LIVRO\]/);
        const quizMatch = text.match(/\[INICIO_QUIZ\]([\s\S]*?)\[FIM_QUIZ\]/);
        const indexMatch = text.match(/\[INICIO_INDEX\]([\s\S]*?)\[FIM_INDEX\]/);

        if (!livroMatch || !quizMatch || !indexMatch) {
            console.error("❌ ERRO: A IA não utilizou os separadores corretamente.");
            console.error("Início do retorno gerado:", text.substring(0, 500));
            process.exit(1);
        }

        // Limpeza de possíveis formatações markdown (```html) que a IA teima em colocar
        const livroHtml = livroMatch[1].replace(/^```html/i, '').replace(/```$/, '').trim();
        const quizHtml = quizMatch[1].replace(/^```html/i, '').replace(/```$/, '').trim();
        const indexHtml = indexMatch[1].replace(/^```html/i, '').replace(/```$/, '').trim();

        // Escrita dos arquivos
        fs.writeFileSync(path.join(hostingerDir, `${tarefa.livro.toLowerCase()}.html`), livroHtml);
        fs.writeFileSync(path.join(hostingerDir, `quiz_${tarefa.livro.toLowerCase()}.html`), quizHtml);
        fs.writeFileSync(path.join(hostingerDir, 'index.html'), indexHtml);

        // Update Cronograma
        tarefa.status = "concluido";
        fs.writeFileSync(cronogramaPath, JSON.stringify(cronograma, null, 2));
        
        console.log(`🎉 Sucesso! Conteúdo de ${tarefa.livro} gerado perfeitamente.`);
    } catch (err) {
        console.error("❌ Erro Crítico:", err.message);
        process.exit(1);
    }
}

iniciarAutomacao();

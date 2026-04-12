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

    // Leitura dos arquivos base
    const manualContexto = fs.readFileSync(manualPath, 'utf8');
    const indexAtual = fs.readFileSync(path.join(hostingerDir, 'index.html'), 'utf8');
    const apiAtual = fs.readFileSync(path.join(hostingerDir, 'api.php'), 'utf8');
    const moldeDesign = fs.readFileSync(path.join(hostingerDir, 'efesios.html'), 'utf8');

    console.log(`📖 Processando: ${tarefa.livro}...`);

    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        systemInstruction: "Você é um Engenheiro de Software Sênior. Sua saída deve ser EXCLUSIVAMENTE JSON. Proibido resumir código ou usar placeholders."
    });

    const promptMestre = `
        MANUAL DE REGRAS: ${manualContexto}

        --- TAREFA ---
        Gerar arquivos para ${tarefa.livro}. Capítulos: ${tarefa.capitulos}.
        
        --- LÓGICA DE MANIPULAÇÃO DO INDEX.HTML (3 STATUS) ---
        1. NOVO CARD: Crie o card de ${tarefa.livro} no topo com selo "Leitura Atual". Quiz desativado (opacity-50).
        2. MOVER ANTERIOR: O card que estava no topo agora desce para "Desafios Abertos". Mude selo para "Desafio Aberto" e ATIVE o quiz/ranking.
        3. ARQUIVAR ANTIGOS: Remova selos de destaque de qualquer outro livro que já esteja na seção de desafios.
        4. JAVASCRIPT: Atualize a função de fetch de rankings para incluir o novo livro.

        --- LÓGICA DO API.PHP ---
        1. NÃO CRIE TABELAS (A tabela ranking_${tarefa.livro.toLowerCase()} já existe).
        2. Apenas adicione os 'case' no switch para salvar e listar o ranking do novo livro.
        3. MANTENHA as credenciais de conexão do banco exatamente como estão.

        --- REFERÊNCIAS ---
        MOLDE: ${moldeDesign}
        INDEX ATUAL: ${indexAtual}
        API ATUAL: ${apiAtual}

        RESPONDA APENAS JSON:
        {
            "livro_html": "...",
            "quiz_html": "...",
            "index_html": "...",
            "api_php": "..."
        }
    `;

    try {
        const result = await model.generateContent(promptMestre);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        
        if (!jsonMatch) throw new Error("IA não devolveu JSON.");
        const resposta = JSON.parse(jsonMatch[0]);

        // Escrita dos arquivos
        fs.writeFileSync(path.join(hostingerDir, `${tarefa.livro.toLowerCase()}.html`), resposta.livro_html);
        fs.writeFileSync(path.join(hostingerDir, `quiz_${tarefa.livro.toLowerCase()}.html`), resposta.quiz_html);
        fs.writeFileSync(path.join(hostingerDir, 'index.html'), resposta.index_html);
        fs.writeFileSync(path.join(hostingerDir, 'api.php'), resposta.api_php);

        // Update Cronograma
        tarefa.status = "concluido";
        fs.writeFileSync(cronogramaPath, JSON.stringify(cronograma, null, 2));
        
        console.log(`✅ Sucesso! Arquivos de ${tarefa.livro} gerados e deploy pronto.`);
    } catch (err) {
        console.error("❌ Erro:", err.message);
        process.exit(1);
    }
}

iniciarAutomacao();

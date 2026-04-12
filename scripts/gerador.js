const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Configuração da API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function iniciarAutomacao() {
    const cronogramaPath = path.join(__dirname, '..', 'cronograma.json');
    const manualPath = path.join(__dirname, '..', 'site-context.md');
    const hostingerDir = path.join(__dirname, '..', 'hostinger');

    // Lendo arquivos de configuração
    const cronograma = JSON.parse(fs.readFileSync(cronogramaPath, 'utf8'));
    const manualContexto = fs.readFileSync(manualPath, 'utf8');
    
    // Verificando data (Fuso Brasília)
    const hoje = new Date().toLocaleString("en-CA", {timeZone: "America/Sao_Paulo"}).split(',')[0];
    const tarefa = cronograma.agenda.find(t => t.data_criacao === hoje && t.status === "pendente");

    if (!tarefa) {
        console.log("☕ Nada para hoje. Data verificada: " + hoje);
        return;
    }

    // Lendo arquivos base (O que está no site agora)
    const indexAtual = fs.readFileSync(path.join(hostingerDir, 'index.html'), 'utf8');
    const apiAtual = fs.readFileSync(path.join(hostingerDir, 'api.php'), 'utf8');
    
    // Usamos Efésios como o "molde dourado" de design
    const moldeDesign = fs.readFileSync(path.join(hostingerDir, 'efesios.html'), 'utf8');

    console.log(`🚀 Iniciando Geração: ${tarefa.livro} (Modelo: gemini-2.5-flash)`);

    // Configuração do Modelo com Instruções de Sistema rígidas
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        systemInstruction: "Você é um Arquiteto de Software e Erudito Bíblico. Sua missão é realizar REESCRITA INTEGRAL de arquivos. Nunca use placeholders ou resumos. Mantenha 100% da estrutura funcional original, especialmente conexões de banco de dados no PHP."
    });

    const promptMestre = `
        Aja conforme o MANUAL DE IDENTIDADE:
        ${manualContexto}

        --- TAREFA DE HOJE ---
        Livro: ${tarefa.livro}
        Capítulos: ${tarefa.capitulos}
        Data do Quiz: ${tarefa.data_quiz}

        --- REFERÊNCIA TÉCNICA (COPIE ESTA ESTRUTURA PARA O NOVO LIVRO) ---
        Use este arquivo como molde para o design, partículas e comentários:
        ${moldeDesign}

        --- ARQUIVOS PARA ATUALIZAR (MANTENHA O CÓDIGO EXISTENTE E APENAS ADICIONE O NOVO) ---
        No api.php, NÃO ALTERE as variáveis $host, $dbname, $username e $password.
        
        ARQUIVO INDEX: ${indexAtual}
        ARQUIVO API: ${apiAtual}

        RESPONDA EXCLUSIVAMENTE COM UM JSON NESTE FORMATO:
        {
            "livro_html": "código html completo do novo livro",
            "quiz_html": "código html completo do novo quiz",
            "index_html": "index.html atualizado (novo livro no topo, antigo em desafios)",
            "api_php": "api.php completo com as novas rotas inseridas"
        }
    `;

    try {
        const result = await model.generateContent(promptMestre);
        let text = result.response.text();
        
        // Limpeza profunda para extrair apenas o JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("A IA não devolveu um JSON válido.");
        
        const resposta = JSON.parse(jsonMatch[0]);

        // 1. Salvar o novo livro e o novo quiz
        fs.writeFileSync(path.join(hostingerDir, `${tarefa.livro.toLowerCase()}.html`), resposta.livro_html);
        fs.writeFileSync(path.join(hostingerDir, `quiz_${tarefa.livro.toLowerCase()}.html`), resposta.quiz_html);
        
        // 2. Sobrescrever index e api com as versões atualizadas
        fs.writeFileSync(path.join(hostingerDir, 'index.html'), resposta.index_html);
        fs.writeFileSync(path.join(hostingerDir, 'api.php'), resposta.api_php);

        // 3. Atualizar cronograma
        tarefa.status = "concluido";
        fs.writeFileSync(cronogramaPath, JSON.stringify(cronograma, null, 2));
        
        console.log(`✅ Sucesso! ${tarefa.livro} foi gerado e os arquivos base foram atualizados.`);
    } catch (error) {
        console.error("❌ Erro Crítico na Automação:", error.message);
        process.exit(1);
    }
}

iniciarAutomacao();

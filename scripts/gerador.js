const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// ============================================================================
// CONFIGURAÇÃO INICIAL E CREDENCIAIS
// ============================================================================
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("❌ ERRO FATAL: Chave da API (GEMINI_API_KEY) não encontrada no ambiente.");
    process.exit(1);
}
const genAI = new GoogleGenerativeAI(apiKey);

async function iniciarAutomacao() {
    console.log("==================================================");
    console.log("🤖 INICIANDO AUTOMAÇÃO: CLUBE DA BÍBLIA");
    console.log("==================================================");

    // 1. Definição de Caminhos
    const cronogramaPath = path.join(__dirname, '..', 'cronograma.json');
    const manualPath = path.join(__dirname, '..', 'site-context.md');
    const hostingerDir = path.join(__dirname, '..', 'hostinger');

    // 2. Leitura do Cronograma e Verificação de Data
    const cronograma = JSON.parse(fs.readFileSync(cronogramaPath, 'utf8'));
    const hoje = new Date().toLocaleString("en-CA", {timeZone: "America/Sao_Paulo"}).split(',')[0];
    const tarefa = cronograma.agenda.find(t => t.data_criacao === hoje && t.status === "pendente");

    if (!tarefa) {
        console.log(`☕ Nenhuma tarefa pendente para hoje (${hoje}). O robô voltará a dormir.`);
        return;
    }

    console.log(`📖 Tarefa Encontrada: Gerar conteúdo para ${tarefa.livro}...`);

    // 3. Carregando o Contexto e os Arquivos Base
    const manualContexto = fs.readFileSync(manualPath, 'utf8');
    const indexAtual = fs.readFileSync(path.join(hostingerDir, 'index.html'), 'utf8');
    const apiAtual = fs.readFileSync(path.join(hostingerDir, 'api.php'), 'utf8');
    
    // Usamos Efésios como o "molde dourado" de design e funcionalidades
    const moldeDesign = fs.readFileSync(path.join(hostingerDir, 'efesios.html'), 'utf8');

    // 4. Configuração do Modelo de Inteligência Artificial
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        systemInstruction: "Você é um Arquiteto Full-Stack Sênior. Sua saída deve ser EXCLUSIVAMENTE um objeto JSON válido. É TERMINANTEMENTE PROIBIDO resumir código, omitir variáveis ou usar placeholders como '// resto do código'."
    });

    // 5. O Prompt Mestre (Com a lógica dos 3 Status)
    const promptMestre = `
        MANUAL DE REGRAS MESTRE: 
        ${manualContexto}

        --- DADOS DA TAREFA ATUAL ---
        Livro: ${tarefa.livro}
        Capítulos: ${tarefa.capitulos}
        Data do Quiz: ${tarefa.data_quiz}

        --- 🛠️ REGRAS DE MANIPULAÇÃO DO INDEX.HTML (OS 3 STATUS) ---
        Você deve reescrever o index.html organizando os cards de livros em 3 categorias exatas:
        1. STATUS "LEITURA ATUAL": 
           - Crie o card do livro de ${tarefa.livro} e coloque-o no TOPO (primeiro da lista).
           - O selo (badge) deve dizer "Leitura Atual".
           - O botão de Quiz DEVE estar desativado (adicione classes como opacity-50, cursor-not-allowed, pointer-events-none).
        
        2. STATUS "DESAFIO ABERTO":
           - Pegue o livro que estava como "Leitura Atual" no código base e mova-o para a seção de Desafios.
           - Altere o selo (badge) dele para "Desafio Aberto".
           - O botão de Quiz DEVE estar 100% ativo e o Ranking visível.
        
        3. STATUS "ARQUIVO/CONCLUÍDO":
           - Qualquer outro livro mais antigo que já estava nos Desafios deve perder o selo de destaque.
           - O botão de Quiz continua ativo, mas ele não é mais o foco principal.

        Lembre-se de adicionar a chamada "fetchRanking" do novo livro no script no final do index.html.

        --- 🛠️ REGRAS DE MANIPULAÇÃO DO API.PHP ---
        1. MANTENHA INTACTAS as variáveis $host, $dbname, $username e $password originais. Nunca as apague.
        2. Adicione os novos cases no final do switch($action): 'ranking_${tarefa.livro.toLowerCase()}' e 'salvar_quiz_${tarefa.livro.toLowerCase()}'.
        3. Dentro do case do ranking, INCLUA OBRIGATORIAMENTE O SQL DE CRIAÇÃO: "CREATE TABLE IF NOT EXISTS ranking_${tarefa.livro.toLowerCase()} (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255), pontos INT, acertos INT, data_jogo TIMESTAMP DEFAULT CURRENT_TIMESTAMP)".

        --- ARQUIVOS PARA PROCESSAMENTO ---
        [MOLDE DESIGN EFÉSIOS]: ${moldeDesign}
        [INDEX.HTML ATUAL]: ${indexAtual}
        [API.PHP ATUAL]: ${apiAtual}

        --- FORMATO DA RESPOSTA ---
        Responda APENAS com o JSON abaixo. Nenhuma palavra fora das chaves.
        {
            "livro_html": "código completo do novo html do livro",
            "quiz_html": "código completo do novo quiz",
            "index_html": "código completo do index.html atualizado",
            "api_php": "código completo do api.php atualizado"
        }
    `;

    try {
        console.log("🧠 Conectando à IA e processando (Isso pode levar alguns segundos)...");
        const result = await model.generateContent(promptMestre);
        let text = result.response.text();
        
        // 6. Limpeza Extrema: Garante que vamos pegar apenas o JSON, mesmo se a IA falar algo antes
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("A resposta da IA não continha um JSON válido.");
        }
        
        const resposta = JSON.parse(jsonMatch[0]);
        console.log("✅ Código gerado com sucesso pela IA! Salvando arquivos...");

        // 7. Salvando arquivos gerados
        fs.writeFileSync(path.join(hostingerDir, `${tarefa.livro.toLowerCase()}.html`), resposta.livro_html);
        fs.writeFileSync(path.join(hostingerDir, `quiz_${tarefa.livro.toLowerCase()}.html`), resposta.quiz_html);
        fs.writeFileSync(path.join(hostingerDir, 'index.html'), resposta.index_html);
        fs.writeFileSync(path.join(hostingerDir, 'api.php'), resposta.api_php);

        // 8. Atualizando o cronograma
        tarefa.status = "concluido";
        fs.writeFileSync(cronogramaPath, JSON.stringify(cronograma, null, 2));
        
        console.log(`🎉 Automação concluída! Arquivos de ${tarefa.livro} prontos para o deploy.`);
        console.log("==================================================");

    } catch (error) {
        console.error("\n❌ ERRO DURANTE A GERAÇÃO:");
        console.error(error.message);
        console.log("Verifique se o manual e os arquivos base estão formatados corretamente.");
        process.exit(1);
    }
}

// Inicia o processo e garante que qualquer erro não tratado derrube a action
iniciarAutomacao().catch((err) => {
    console.error("❌ Erro Global não tratado:", err);
    process.exit(1);
});

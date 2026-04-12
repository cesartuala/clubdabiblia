const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');

async function executarDeploy() {
    const cliente = new ftp.Client();
    cliente.ftp.timeout = 120000;

    try {
        console.log("🔗 Conectando ao FTP...");
        await cliente.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASS,
            secure: false
        });

        // 📍 LOCALIZAÇÃO E ALVO
        // O comando cd("/") garante que estamos na raiz real do servidor antes de começar
        await cliente.cd("/"); 
        
        const remoteTarget = 'public_html'; 
        console.log(`📂 Entrando na pasta principal: ${remoteTarget}`);
        await cliente.ensureDir(remoteTarget);
        
        // Caminho local onde os arquivos gerados pelo robô estão (pasta /hostinger)
        const localDir = path.join(__dirname, '..', 'hostinger');
        const itens = fs.readdirSync(localDir);

        console.log(`🚀 Iniciando upload de ${itens.length} itens diretamente em ${await cliente.pwd()}...`);

        for (const item of itens) {
            const fullPath = path.join(localDir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                // Se for uma pasta (como /uploads), cria ela dentro da public_html
                console.log(`  📁 Subindo pasta: ${item}/`);
                await cliente.uploadFromDir(fullPath, item);
            } else {
                // Se for um arquivo, sobe diretamente na pasta atual
                console.log(`  📄 Subindo arquivo: ${item}`);
                // Ao passar apenas o nome 'item', ele salva na pasta onde o cliente está (public_html)
                await cliente.uploadFrom(fullPath, item);
            }
        }

        console.log("\n✅ DEPLOY FINALIZADO COM SUCESSO!");
        console.log(`🔗 Verifique em: http://clubdabiblia.com.br/filipenses.html`);
        cliente.close();

    } catch (err) {
        console.error("❌ Erro no Deploy:", err.message);
        cliente.close();
        process.exit(1);
    }
}

executarDeploy();

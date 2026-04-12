const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');

async function executarDeploy() {
    const localDir = path.join(__dirname, '..', 'hostinger');
    const remoteDir = 'public_html';
    const maxRetries = 5;

    // Lista de arquivos para ignorar (opcional)
    const IGNORAR = ['.git', 'node_modules'];

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        const cliente = new ftp.Client();
        cliente.ftp.timeout = 120000; // 2 minutos de timeout

        try {
            console.log(`[Tentativa ${attempt}/${maxRetries}] 🔗 Conectando ao FTP da Hostinger...`);
            
            await cliente.access({
                host: process.env.FTP_HOST,
                user: process.env.FTP_USER,
                password: process.env.FTP_PASS,
                secure: false // Altere para true se o seu host exigir FTPS
            });

            console.log(`📂 Acessando diretório remoto: ${remoteDir}`);
            await cliente.ensureDir(remoteDir);

            // Lógica de Upload Individual (Mais rápido e estável que o sync)
            const itens = fs.readdirSync(localDir);
            console.log(`🚀 Iniciando upload de ${itens.length} itens...`);

            for (const item of itens) {
                if (IGNORAR.includes(item)) continue;

                const fullPath = path.join(localDir, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    console.log(`  📁 Subindo pasta: ${item}/`);
                    await cliente.uploadFromDir(fullPath, item);
                } else {
                    console.log(`  📄 Subindo arquivo: ${item}`);
                    await cliente.uploadFrom(fullPath, item);
                }
            }

            console.log("✅ DEPLOY CONCLUÍDO COM SUCESSO!");
            cliente.close();
            return; // Sai do loop de tentativas em caso de sucesso

        } catch (err) {
            console.error(`❌ Erro na tentativa ${attempt}:`, err.message);
            cliente.close();

            if (attempt < maxRetries) {
                console.log("⏳ Aguardando 5 segundos para redefinir conexão...");
                await new Promise(r => setTimeout(r, 5000));
            } else {
                console.error("💀 Falha crítica: Todas as tentativas de deploy falharam.");
                process.exit(1);
            }
        }
    }
}

executarDeploy();

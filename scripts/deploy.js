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

        // --- DIAGNÓSTICO INICIAL ---
        console.log("📍 Localização inicial no servidor: " + await cliente.pwd());
        
        // Se o seu site estiver na pasta 'public', mude a linha abaixo para 'public_html/public'
        const remoteDir = 'public_html'; 
        
        await cliente.ensureDir(remoteDir);
        console.log("📂 Pasta de destino confirmada: " + await cliente.pwd());

        const localDir = path.join(__dirname, '..', 'hostinger');
        const itens = fs.readdirSync(localDir);

        console.log(`🚀 Fazendo upload de ${itens.length} itens...`);

        for (const item of itens) {
            const fullPath = path.join(localDir, item);
            if (fs.statSync(fullPath).isDirectory()) {
                await cliente.uploadFromDir(fullPath, item);
            } else {
                console.log(`  📄 Subindo: ${item}`);
                await cliente.uploadFrom(fullPath, item);
            }
        }

        // --- DIAGNÓSTICO FINAL ---
        console.log("\n👀 Verificação Pós-Upload:");
        const listaRemota = await cliente.list();
        console.log("Arquivos que o servidor enxerga agora:");
        console.table(listaRemota.map(f => ({ arquivo: f.name, tamanho: f.size })));

        console.log("✅ DEPLOY CONCLUÍDO!");
        cliente.close();

    } catch (err) {
        console.error("❌ Erro:", err.message);
        cliente.close();
        process.exit(1);
    }
}

executarDeploy();

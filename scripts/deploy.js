const ftp = require("basic-ftp");
const fs = require("fs");
const path = require("path");

async function executarDeploy() {
    const cliente = new ftp.Client();
    // Aumentamos o tempo limite para conexões mais lentas
    cliente.ftp.timeout = 120000; 

    try {
        console.log("🔗 Conectando ao FTP da Hostinger...");
        await cliente.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASS,
            secure: false 
        });

        const localDir = "hostinger";
        const remoteDir = "public_html";

        // LOG 1: Verificar o que o robô está vendo na pasta local
        if (!fs.existsSync(localDir)) {
            throw new Error(`A pasta local '${localDir}' não foi encontrada!`);
        }
        const arquivosLocais = fs.readdirSync(localDir);
        console.log(`📂 Arquivos detectados na pasta local: [${arquivosLocais.join(", ")}]`);

        console.log(`🚚 Iniciando sincronização para ${remoteDir}...`);

        // LOG 2: Rastrear o progresso de cada arquivo individualmente
        cliente.trackProgress(info => {
            if (info.type === "upload") {
                // Este log aparecerá para cada arquivo enviado
                console.log(`📤 [UPLOAD] Enviando: ${info.name} | Tamanho: ${info.bytesOverall} bytes`);
            }
        });

        // O comando uploadFromDir sincroniza a pasta. 
        // Se arquivos novos não subirem, ele forçará a verificação.
        await cliente.uploadFromDir(localDir, remoteDir);

        console.log("✅ Deploy finalizado! Verifique o site agora.");
    } catch (err) {
        console.error("❌ Erro Crítico no Deploy:", err.message);
        process.exit(1);
    } finally {
        cliente.close();
    }
}

executarDeploy();

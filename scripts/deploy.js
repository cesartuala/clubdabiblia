const ftp = require("basic-ftp");
const path = require("path");

async function executarDeploy() {
    const cliente = new ftp.Client();
    // Aumentamos o tempo limite para 2 minutos (120000ms)
    cliente.ftp.timeout = 120000; 

    try {
        console.log("🔗 Conectando ao FTP da Hostinger...");
        await cliente.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASS,
            secure: false // Mantenha false se não tiver SSL no FTP
        });

        console.log("🚚 Enviando arquivos da pasta /hostinger para /public_html...");
        
        // O comando 'uploadFromDir' garante que arquivos novos e editados subam
        await cliente.uploadFromDir("hostinger", "public_html");

        console.log("✅ Deploy finalizado com sucesso!");
    } catch (err) {
        console.error("❌ Erro no upload:", err.message);
        process.exit(1); // Força o erro para o GitHub nos avisar
    } finally {
        cliente.close();
    }
}

executarDeploy();

const ftp = require("basic-ftp");

async function upload() {
    const client = new ftp.Client();
    // Aumentamos o timeout para 60 segundos (60000ms)
    client.ftp.timeout = 60000; 

    try {
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASS,
            secure: false // Tente mudar para true se seu servidor suportar FTPS
        });

        console.log("🚚 Enviando arquivos para a Hostinger...");
        // Garanta que está enviando a pasta correta
        await client.uploadFromDir("hostinger", "public_html"); 
        
    } catch (err) {
        console.error("❌ Erro no deploy:", err.message);
        throw err;
    } finally {
        client.close();
    }
}

upload();

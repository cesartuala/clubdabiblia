const ftp = require('basic-ftp');
const path = require('path');

async function upload() {
  const client = new ftp.Client();
  client.ftp.verbose = true; // Mantive true para podermos ver os logs de sucesso no GitHub
  
  try {
    console.log("Conectando ao FTP da Hostinger...");
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASS,
      secure: true,
      secureOptions: { rejectUnauthorized: false }
    });
    
    // Aponta para a pasta hostinger na raiz do projeto
    const localDir = path.join(__dirname, '..', 'hostinger'); 
    
    await client.ensureDir('/public_html');
    
    console.log("Iniciando o upload dos arquivos...");
    await client.uploadFromDir(localDir);
    
    console.log('Upload concluído com sucesso! Site atualizado.');
  } catch (err) {
    console.error('Erro no upload:', err.message);
    process.exit(1);
  }
  client.close();
}

upload();

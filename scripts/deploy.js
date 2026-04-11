const ftp = require('basic-ftp');
const path = require('path');

async function upload() {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  
  try {
    console.log("Conectando ao FTP da Hostinger...");
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASS,
      secure: true,
      secureOptions: { rejectUnauthorized: false }
    });
    
    const localDir = path.join(__dirname, '..', 'hostinger'); 
    
    // Garantimos que estamos na pasta correta
    await client.ensureDir('/public_html');
    
    console.log("Iniciando upload seletivo (ignorando pasta uploads)...");
    
    // O comando uploadFromDir por padrão não deleta arquivos no destino 
    // que não existem na origem, a menos que explicitamente configurado.
    // Como a pasta 'uploads' não existe no GitHub, ela será ignorada e preservada no servidor.
    await client.uploadFromDir(localDir);
    
    console.log('Upload concluído! Arquivos do site atualizados e pasta uploads preservada.');
  } catch (err) {
    console.error('Erro no upload:', err.message);
    process.exit(1);
  }
  client.close();
}

upload();

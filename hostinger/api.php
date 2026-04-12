<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Configurações do Banco de Dados - ORIGINAIS
$host = "localhost";
$db_name = "u243693196_clubdabiblia";
$username = "u243693196_clubdabiblia";
$password = "C1ubdabibli@";

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die(json_encode(["erro" => "Falha na conexão: " . $e->getMessage()]));
}

$acao = $_POST['acao'] ?? $_GET['acao'] ?? '';

// --- SISTEMA DE COMENTÁRIOS ---
if ($acao == 'listar') {
    $capitulo = $_GET['capitulo'];
    $stmt = $conn->prepare("SELECT * FROM comentarios WHERE capitulo = :cap ORDER BY data_envio DESC");
    $stmt->bindParam(':cap', $capitulo);
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

if ($acao == 'salvar') {
    $nome = $_POST['nome'];
    $mensagem = $_POST['mensagem'];
    $capitulo = $_POST['capitulo'];
    $fotoPath = null;
    $audioPath = null;

    if (isset($_FILES['foto']) && $_FILES['foto']['error'] === 0) {
        $ext = pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION);
        $novoNome = uniqid() . "_img." . $ext;
        move_uploaded_file($_FILES['foto']['tmp_name'], "uploads/" . $novoNome);
        $fotoPath = "uploads/" . $novoNome;
    }
    if (isset($_FILES['audio']) && $_FILES['audio']['error'] === 0) {
        $novoNome = uniqid() . "_audio.wav";
        move_uploaded_file($_FILES['audio']['tmp_name'], "uploads/" . $novoNome);
        $audioPath = "uploads/" . $novoNome;
    }

    $sql = "INSERT INTO comentarios (capitulo, nome, mensagem, foto, audio) VALUES (:cap, :nom, :msg, :ft, :aud)";
    $stmt = $conn->prepare($sql);
    $stmt->execute([':cap' => $capitulo, ':nom' => $nome, ':msg' => $mensagem, ':ft' => $fotoPath, ':aud' => $audioPath]);
    echo json_encode(["sucesso" => true]);
    exit;
}

if ($acao == 'reagir') {
    $id = $_POST['id'];
    $tipo = $_POST['tipo'];
    $permitidos = ['likes', 'amem', 'gloria'];
    if (in_array($tipo, $permitidos)) {
        $sql = "UPDATE comentarios SET $tipo = $tipo + 1 WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->execute([':id' => $id]);
        echo json_encode(["sucesso" => true]);
    }
    exit;
}

// --- FUNÇÕES DE QUIZ E RANKING ---
function salvarQuiz($conn, $tabela) {
    $nome = $_POST['nome'];
    $pontos = $_POST['pontos'];
    $acertos = $_POST['acertos'];
    $sql = "INSERT INTO $tabela (nome, pontos, acertos) VALUES (:nom, :pts, :acrt)";
    $stmt = $conn->prepare($sql);
    $stmt->execute([':nom' => $nome, ':pts' => $pontos, ':acrt' => $acertos]);
    echo json_encode(["sucesso" => true]);
    exit;
}

function listarRanking($conn, $tabela) {
    $stmt = $conn->prepare("SELECT nome, pontos FROM $tabela ORDER BY pontos DESC, data_jogo DESC LIMIT 10");
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

// --- ROTAS DOS QUIZZES ---

// Antigo Testamento
if ($acao == 'salvar_quiz_genesis') { salvarQuiz($conn, 'ranking_genesis'); }
if ($acao == 'ranking_genesis') { listarRanking($conn, 'ranking_genesis'); }
if ($acao == 'salvar_quiz_exodo') { salvarQuiz($conn, 'ranking_exodo'); }
if ($acao == 'ranking_exodo') { listarRanking($conn, 'ranking_exodo'); }
if ($acao == 'salvar_quiz_levitico') { salvarQuiz($conn, 'ranking_levitico'); }
if ($acao == 'ranking_levitico') { listarRanking($conn, 'ranking_levitico'); }
if ($acao == 'salvar_quiz_numeros') { salvarQuiz($conn, 'ranking_numeros'); }
if ($acao == 'ranking_numeros') { listarRanking($conn, 'ranking_numeros'); }
if ($acao == 'salvar_quiz_deuteronomio') { salvarQuiz($conn, 'ranking_deuteronomio'); }
if ($acao == 'ranking_deuteronomio') { listarRanking($conn, 'ranking_deuteronomio'); }
if ($acao == 'salvar_quiz_josue') { salvarQuiz($conn, 'ranking_josue'); }
if ($acao == 'ranking_josue') { listarRanking($conn, 'ranking_josue'); }
if ($acao == 'salvar_quiz_juizes') { salvarQuiz($conn, 'ranking_juizes'); }
if ($acao == 'ranking_juizes') { listarRanking($conn, 'ranking_juizes'); }
if ($acao == 'salvar_quiz_rute') { salvarQuiz($conn, 'ranking_rute'); }
if ($acao == 'ranking_rute') { listarRanking($conn, 'ranking_rute'); }
if ($acao == 'salvar_quiz_1samuel') { salvarQuiz($conn, 'ranking_1samuel'); }
if ($acao == 'ranking_1samuel') { listarRanking($conn, 'ranking_1samuel'); }
if ($acao == 'salvar_quiz_2samuel') { salvarQuiz($conn, 'ranking_2samuel'); }
if ($acao == 'ranking_2samuel') { listarRanking($conn, 'ranking_2samuel'); }
if ($acao == 'salvar_quiz_1reis') { salvarQuiz($conn, 'ranking_1reis'); }
if ($acao == 'ranking_1reis') { listarRanking($conn, 'ranking_1reis'); }
if ($acao == 'salvar_quiz_2reis') { salvarQuiz($conn, 'ranking_2reis'); }
if ($acao == 'ranking_2reis') { listarRanking($conn, 'ranking_2reis'); }
if ($acao == 'salvar_quiz_1cronicas') { salvarQuiz($conn, 'ranking_1cronicas'); }
if ($acao == 'ranking_1cronicas') { listarRanking($conn, 'ranking_1cronicas'); }
if ($acao == 'salvar_quiz_2cronicas') { salvarQuiz($conn, 'ranking_2cronicas'); }
if ($acao == 'ranking_2cronicas') { listarRanking($conn, 'ranking_2cronicas'); }
if ($acao == 'salvar_quiz_esdras') { salvarQuiz($conn, 'ranking_esdras'); }
if ($acao == 'ranking_esdras') { listarRanking($conn, 'ranking_esdras'); }
if ($acao == 'salvar_quiz_neemias') { salvarQuiz($conn, 'ranking_neemias'); }
if ($acao == 'ranking_neemias') { listarRanking($conn, 'ranking_neemias'); }
if ($acao == 'salvar_quiz_ester') { salvarQuiz($conn, 'ranking_ester'); }
if ($acao == 'ranking_ester') { listarRanking($conn, 'ranking_ester'); }
if ($acao == 'salvar_quiz_jo') { salvarQuiz($conn, 'ranking_jo'); }
if ($acao == 'ranking_jo') { listarRanking($conn, 'ranking_jo'); }
if ($acao == 'salvar_quiz_salmos') { salvarQuiz($conn, 'ranking_salmos'); }
if ($acao == 'ranking_salmos') { listarRanking($conn, 'ranking_salmos'); }
if ($acao == 'salvar_quiz_proverbios') { salvarQuiz($conn, 'ranking_proverbios'); }
if ($acao == 'ranking_proverbios') { listarRanking($conn, 'ranking_proverbios'); }
if ($acao == 'salvar_quiz_eclesiastes') { salvarQuiz($conn, 'ranking_eclesiastes'); }
if ($acao == 'ranking_eclesiastes') { listarRanking($conn, 'ranking_eclesiastes'); }
if ($acao == 'salvar_quiz_cantares') { salvarQuiz($conn, 'ranking_cantares'); }
if ($acao == 'ranking_cantares') { listarRanking($conn, 'ranking_cantares'); }
if ($acao == 'salvar_quiz_isaias') { salvarQuiz($conn, 'ranking_isaias'); }
if ($acao == 'ranking_isaias') { listarRanking($conn, 'ranking_isaias'); }
if ($acao == 'salvar_quiz_jeremias') { salvarQuiz($conn, 'ranking_jeremias'); }
if ($acao == 'ranking_jeremias') { listarRanking($conn, 'ranking_jeremias'); }
if ($acao == 'salvar_quiz_lamentacoes') { salvarQuiz($conn, 'ranking_lamentacoes'); }
if ($acao == 'ranking_lamentacoes') { listarRanking($conn, 'ranking_lamentacoes'); }
if ($acao == 'salvar_quiz_ezequiel') { salvarQuiz($conn, 'ranking_ezequiel'); }
if ($acao == 'ranking_ezequiel') { listarRanking($conn, 'ranking_ezequiel'); }
if ($acao == 'salvar_quiz_daniel') { salvarQuiz($conn, 'ranking_daniel'); }
if ($acao == 'ranking_daniel') { listarRanking($conn, 'ranking_daniel'); }
if ($acao == 'salvar_quiz_oseias') { salvarQuiz($conn, 'ranking_oseias'); }
if ($acao == 'ranking_oseias') { listarRanking($conn, 'ranking_oseias'); }
if ($acao == 'salvar_quiz_joel') { salvarQuiz($conn, 'ranking_joel'); }
if ($acao == 'ranking_joel') { listarRanking($conn, 'ranking_joel'); }
if ($acao == 'salvar_quiz_amos') { salvarQuiz($conn, 'ranking_amos'); }
if ($acao == 'ranking_amos') { listarRanking($conn, 'ranking_amos'); }
if ($acao == 'salvar_quiz_obadias') { salvarQuiz($conn, 'ranking_obadias'); }
if ($acao == 'ranking_obadias') { listarRanking($conn, 'ranking_obadias'); }
if ($acao == 'salvar_quiz_jonas') { salvarQuiz($conn, 'ranking_jonas'); }
if ($acao == 'ranking_jonas') { listarRanking($conn, 'ranking_jonas'); }
if ($acao == 'salvar_quiz_miqueias') { salvarQuiz($conn, 'ranking_miqueias'); }
if ($acao == 'ranking_miqueias') { listarRanking($conn, 'ranking_miqueias'); }
if ($acao == 'salvar_quiz_naum') { salvarQuiz($conn, 'ranking_naum'); }
if ($acao == 'ranking_naum') { listarRanking($conn, 'ranking_naum'); }
if ($acao == 'salvar_quiz_habacuque') { salvarQuiz($conn, 'ranking_habacuque'); }
if ($acao == 'ranking_habacuque') { listarRanking($conn, 'ranking_habacuque'); }
if ($acao == 'salvar_quiz_sofonias') { salvarQuiz($conn, 'ranking_sofonias'); }
if ($acao == 'ranking_sofonias') { listarRanking($conn, 'ranking_sofonias'); }
if ($acao == 'salvar_quiz_ageu') { salvarQuiz($conn, 'ranking_ageu'); }
if ($acao == 'ranking_ageu') { listarRanking($conn, 'ranking_ageu'); }
if ($acao == 'salvar_quiz_zacarias') { salvarQuiz($conn, 'ranking_zacarias'); }
if ($acao == 'ranking_zacarias') { listarRanking($conn, 'ranking_zacarias'); }
if ($acao == 'salvar_quiz_malaquias') { salvarQuiz($conn, 'ranking_malaquias'); }
if ($acao == 'ranking_malaquias') { listarRanking($conn, 'ranking_malaquias'); }

// Novo Testamento
if ($acao == 'salvar_quiz_mateus') { salvarQuiz($conn, 'ranking_mateus'); }
if ($acao == 'ranking_mateus') { listarRanking($conn, 'ranking_mateus'); }
if ($acao == 'salvar_quiz_marcos') { salvarQuiz($conn, 'ranking_marcos'); }
if ($acao == 'ranking_marcos') { listarRanking($conn, 'ranking_marcos'); }
if ($acao == 'salvar_quiz_lucas') { salvarQuiz($conn, 'ranking_lucas'); }
if ($acao == 'ranking_lucas') { listarRanking($conn, 'ranking_lucas'); }
if ($acao == 'salvar_quiz_joao') { salvarQuiz($conn, 'ranking_joao'); }
if ($acao == 'ranking_joao') { listarRanking($conn, 'ranking_joao'); }
if ($acao == 'salvar_quiz_atos') { salvarQuiz($conn, 'ranking_atos'); }
if ($acao == 'ranking_atos') { listarRanking($conn, 'ranking_atos'); }
if ($acao == 'salvar_quiz_romanos') { salvarQuiz($conn, 'ranking_romanos'); }
if ($acao == 'ranking_romanos') { listarRanking($conn, 'ranking_romanos'); }
if ($acao == 'salvar_quiz_1corintios') { salvarQuiz($conn, 'ranking_corintios'); }
if ($acao == 'ranking_corintios') { listarRanking($conn, 'ranking_corintios'); }
if ($acao == 'salvar_quiz_2corintios') { salvarQuiz($conn, 'ranking_2corintios'); }
if ($acao == 'ranking_2corintios') { listarRanking($conn, 'ranking_2corintios'); }
if ($acao == 'salvar_quiz_galatas') { salvarQuiz($conn, 'ranking_galatas'); }
if ($acao == 'ranking_galatas') { listarRanking($conn, 'ranking_galatas'); }
if ($acao == 'salvar_quiz_efesios') { salvarQuiz($conn, 'ranking_efesios'); }
if ($acao == 'ranking_efesios') { listarRanking($conn, 'ranking_efesios'); }
if ($acao == 'salvar_quiz_filipenses') { salvarQuiz($conn, 'ranking_filipenses'); }
if ($acao == 'ranking_filipenses') { listarRanking($conn, 'ranking_filipenses'); }
if ($acao == 'salvar_quiz_colossenses') { salvarQuiz($conn, 'ranking_colossenses'); }
if ($acao == 'ranking_colossenses') { listarRanking($conn, 'ranking_colossenses'); }
if ($acao == 'salvar_quiz_1tessalonicenses') { salvarQuiz($conn, 'ranking_1tessalonicenses'); }
if ($acao == 'ranking_1tessalonicenses') { listarRanking($conn, 'ranking_1tessalonicenses'); }
if ($acao == 'salvar_quiz_2tessalonicenses') { salvarQuiz($conn, 'ranking_2tessalonicenses'); }
if ($acao == 'ranking_2tessalonicenses') { listarRanking($conn, 'ranking_2tessalonicenses'); }
if ($acao == 'salvar_quiz_1timoteo') { salvarQuiz($conn, 'ranking_1timoteo'); }
if ($acao == 'ranking_1timoteo') { listarRanking($conn, 'ranking_1timoteo'); }
if ($acao == 'salvar_quiz_2timoteo') { salvarQuiz($conn, 'ranking_2timoteo'); }
if ($acao == 'ranking_2timoteo') { listarRanking($conn, 'ranking_2timoteo'); }
if ($acao == 'salvar_quiz_tito') { salvarQuiz($conn, 'ranking_tito'); }
if ($acao == 'ranking_tito') { listarRanking($conn, 'ranking_tito'); }
if ($acao == 'salvar_quiz_filemom') { salvarQuiz($conn, 'ranking_filemom'); }
if ($acao == 'ranking_filemom') { listarRanking($conn, 'ranking_filemom'); }
if ($acao == 'salvar_quiz_hebreus') { salvarQuiz($conn, 'ranking_hebreus'); }
if ($acao == 'ranking_hebreus') { listarRanking($conn, 'ranking_hebreus'); }
if ($acao == 'salvar_quiz_tiago') { salvarQuiz($conn, 'ranking_tiago'); }
if ($acao == 'ranking_tiago') { listarRanking($conn, 'ranking_tiago'); }
if ($acao == 'salvar_quiz_1pedro') { salvarQuiz($conn, 'ranking_1pedro'); }
if ($acao == 'ranking_1pedro') { listarRanking($conn, 'ranking_1pedro'); }
if ($acao == 'salvar_quiz_2pedro') { salvarQuiz($conn, 'ranking_2pedro'); }
if ($acao == 'ranking_2pedro') { listarRanking($conn, 'ranking_2pedro'); }
if ($acao == 'salvar_quiz_1joao') { salvarQuiz($conn, 'ranking_1joao'); }
if ($acao == 'ranking_1joao') { listarRanking($conn, 'ranking_1joao'); }
if ($acao == 'salvar_quiz_2joao') { salvarQuiz($conn, 'ranking_2joao'); }
if ($acao == 'ranking_2joao') { listarRanking($conn, 'ranking_2joao'); }
if ($acao == 'salvar_quiz_3joao') { salvarQuiz($conn, 'ranking_3joao'); }
if ($acao == 'ranking_3joao') { listarRanking($conn, 'ranking_3joao'); }
if ($acao == 'salvar_quiz_judas') { salvarQuiz($conn, 'ranking_judas'); }
if ($acao == 'ranking_judas') { listarRanking($conn, 'ranking_judas'); }
if ($acao == 'salvar_quiz_apocalipse') { salvarQuiz($conn, 'ranking_apocalipse'); }
if ($acao == 'ranking_apocalipse') { listarRanking($conn, 'ranking_apocalipse'); }

// Rota padrão original
if ($acao == 'salvar_quiz') { salvarQuiz($conn, 'ranking'); }
if ($acao == 'ranking') { listarRanking($conn, 'ranking'); }
?>

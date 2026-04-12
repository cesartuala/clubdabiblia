<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Configurações do Banco de Dados
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
    $stmt = $conn->prepare("SELECT nome, pontos FROM $tabela ORDER BY pontos DESC, data_jogo DESC");
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

// ROTAS DOS QUIZZES
if ($acao == 'salvar_quiz') { salvarQuiz($conn, 'ranking'); }
if ($acao == 'ranking') { listarRanking($conn, 'ranking'); }

if ($acao == 'salvar_quiz_atos') { salvarQuiz($conn, 'ranking_atos'); }
if ($acao == 'ranking_atos') { listarRanking($conn, 'ranking_atos'); }

if ($acao == 'salvar_quiz_romanos') { salvarQuiz($conn, 'ranking_romanos'); }
if ($acao == 'ranking_romanos') { listarRanking($conn, 'ranking_romanos'); }

if ($acao == 'salvar_quiz_corintios') { salvarQuiz($conn, 'ranking_corintios'); }
if ($acao == 'ranking_corintios') { listarRanking($conn, 'ranking_corintios'); }

if ($acao == 'salvar_quiz_2corintios') { salvarQuiz($conn, 'ranking_2corintios'); }
if ($acao == 'ranking_2corintios') { listarRanking($conn, 'ranking_2corintios'); }

if ($acao == 'salvar_quiz_galatas') { salvarQuiz($conn, 'ranking_galatas'); }
if ($acao == 'ranking_galatas') { listarRanking($conn, 'ranking_galatas'); }

if ($acao == 'salvar_quiz_efesios') { salvarQuiz($conn, 'ranking_efesios'); }
if ($acao == 'ranking_efesios') { listarRanking($conn, 'ranking_efesios'); }
?>

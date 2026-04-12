<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$host = 'localhost';
$db   = 'u243693196_clube_biblia';
$user = 'u243693196_cesartuala';
$pass = 'Cesartuala@10';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(['error' => 'Falha na conexão: ' . $e->getMessage()]));
}

$action = $_GET['action'] ?? $_POST['action'] ?? '';

switch ($action) {

    // === ANTIGO TESTAMENTO ===
    case 'ranking_genesis': $stmt = $pdo->query("SELECT * FROM ranking_genesis ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_genesis': $stmt = $pdo->prepare("INSERT INTO ranking_genesis (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_exodo': $stmt = $pdo->query("SELECT * FROM ranking_exodo ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_exodo': $stmt = $pdo->prepare("INSERT INTO ranking_exodo (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_levitico': $stmt = $pdo->query("SELECT * FROM ranking_levitico ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_levitico': $stmt = $pdo->prepare("INSERT INTO ranking_levitico (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_numeros': $stmt = $pdo->query("SELECT * FROM ranking_numeros ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_numeros': $stmt = $pdo->prepare("INSERT INTO ranking_numeros (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_deuteronomio': $stmt = $pdo->query("SELECT * FROM ranking_deuteronomio ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_deuteronomio': $stmt = $pdo->prepare("INSERT INTO ranking_deuteronomio (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_josue': $stmt = $pdo->query("SELECT * FROM ranking_josue ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_josue': $stmt = $pdo->prepare("INSERT INTO ranking_josue (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_juizes': $stmt = $pdo->query("SELECT * FROM ranking_juizes ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_juizes': $stmt = $pdo->prepare("INSERT INTO ranking_juizes (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_rute': $stmt = $pdo->query("SELECT * FROM ranking_rute ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_rute': $stmt = $pdo->prepare("INSERT INTO ranking_rute (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_1samuel': $stmt = $pdo->query("SELECT * FROM ranking_1samuel ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_1samuel': $stmt = $pdo->prepare("INSERT INTO ranking_1samuel (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_2samuel': $stmt = $pdo->query("SELECT * FROM ranking_2samuel ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_2samuel': $stmt = $pdo->prepare("INSERT INTO ranking_2samuel (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_1reis': $stmt = $pdo->query("SELECT * FROM ranking_1reis ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_1reis': $stmt = $pdo->prepare("INSERT INTO ranking_1reis (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_2reis': $stmt = $pdo->query("SELECT * FROM ranking_2reis ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_2reis': $stmt = $pdo->prepare("INSERT INTO ranking_2reis (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_1cronicas': $stmt = $pdo->query("SELECT * FROM ranking_1cronicas ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_1cronicas': $stmt = $pdo->prepare("INSERT INTO ranking_1cronicas (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_2cronicas': $stmt = $pdo->query("SELECT * FROM ranking_2cronicas ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_2cronicas': $stmt = $pdo->prepare("INSERT INTO ranking_2cronicas (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_esdras': $stmt = $pdo->query("SELECT * FROM ranking_esdras ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_esdras': $stmt = $pdo->prepare("INSERT INTO ranking_esdras (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_neemias': $stmt = $pdo->query("SELECT * FROM ranking_neemias ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_neemias': $stmt = $pdo->prepare("INSERT INTO ranking_neemias (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_ester': $stmt = $pdo->query("SELECT * FROM ranking_ester ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_ester': $stmt = $pdo->prepare("INSERT INTO ranking_ester (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_jo': $stmt = $pdo->query("SELECT * FROM ranking_jo ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_jo': $stmt = $pdo->prepare("INSERT INTO ranking_jo (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_salmos': $stmt = $pdo->query("SELECT * FROM ranking_salmos ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_salmos': $stmt = $pdo->prepare("INSERT INTO ranking_salmos (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_proverbios': $stmt = $pdo->query("SELECT * FROM ranking_proverbios ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_proverbios': $stmt = $pdo->prepare("INSERT INTO ranking_proverbios (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_eclesiastes': $stmt = $pdo->query("SELECT * FROM ranking_eclesiastes ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_eclesiastes': $stmt = $pdo->prepare("INSERT INTO ranking_eclesiastes (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_cantares': $stmt = $pdo->query("SELECT * FROM ranking_cantares ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_cantares': $stmt = $pdo->prepare("INSERT INTO ranking_cantares (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_isaias': $stmt = $pdo->query("SELECT * FROM ranking_isaias ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_isaias': $stmt = $pdo->prepare("INSERT INTO ranking_isaias (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_jeremias': $stmt = $pdo->query("SELECT * FROM ranking_jeremias ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_jeremias': $stmt = $pdo->prepare("INSERT INTO ranking_jeremias (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_lamentacoes': $stmt = $pdo->query("SELECT * FROM ranking_lamentacoes ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_lamentacoes': $stmt = $pdo->prepare("INSERT INTO ranking_lamentacoes (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_ezequiel': $stmt = $pdo->query("SELECT * FROM ranking_ezequiel ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_ezequiel': $stmt = $pdo->prepare("INSERT INTO ranking_ezequiel (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_daniel': $stmt = $pdo->query("SELECT * FROM ranking_daniel ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_daniel': $stmt = $pdo->prepare("INSERT INTO ranking_daniel (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_oseias': $stmt = $pdo->query("SELECT * FROM ranking_oseias ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_oseias': $stmt = $pdo->prepare("INSERT INTO ranking_oseias (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_joel': $stmt = $pdo->query("SELECT * FROM ranking_joel ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_joel': $stmt = $pdo->prepare("INSERT INTO ranking_joel (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_amos': $stmt = $pdo->query("SELECT * FROM ranking_amos ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_amos': $stmt = $pdo->prepare("INSERT INTO ranking_amos (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_obadias': $stmt = $pdo->query("SELECT * FROM ranking_obadias ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_obadias': $stmt = $pdo->prepare("INSERT INTO ranking_obadias (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_jonas': $stmt = $pdo->query("SELECT * FROM ranking_jonas ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_jonas': $stmt = $pdo->prepare("INSERT INTO ranking_jonas (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_miqueias': $stmt = $pdo->query("SELECT * FROM ranking_miqueias ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_miqueias': $stmt = $pdo->prepare("INSERT INTO ranking_miqueias (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_naum': $stmt = $pdo->query("SELECT * FROM ranking_naum ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_naum': $stmt = $pdo->prepare("INSERT INTO ranking_naum (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_habacuque': $stmt = $pdo->query("SELECT * FROM ranking_habacuque ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_habacuque': $stmt = $pdo->prepare("INSERT INTO ranking_habacuque (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_sofonias': $stmt = $pdo->query("SELECT * FROM ranking_sofonias ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_sofonias': $stmt = $pdo->prepare("INSERT INTO ranking_sofonias (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_ageu': $stmt = $pdo->query("SELECT * FROM ranking_ageu ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_ageu': $stmt = $pdo->prepare("INSERT INTO ranking_ageu (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_zacarias': $stmt = $pdo->query("SELECT * FROM ranking_zacarias ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_zacarias': $stmt = $pdo->prepare("INSERT INTO ranking_zacarias (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_malaquias': $stmt = $pdo->query("SELECT * FROM ranking_malaquias ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_malaquias': $stmt = $pdo->prepare("INSERT INTO ranking_malaquias (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    // === NOVO TESTAMENTO ===
    case 'ranking_mateus': $stmt = $pdo->query("SELECT * FROM ranking_mateus ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_mateus': $stmt = $pdo->prepare("INSERT INTO ranking_mateus (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_marcos': $stmt = $pdo->query("SELECT * FROM ranking_marcos ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_marcos': $stmt = $pdo->prepare("INSERT INTO ranking_marcos (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_lucas': $stmt = $pdo->query("SELECT * FROM ranking_lucas ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_lucas': $stmt = $pdo->prepare("INSERT INTO ranking_lucas (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_joao': $stmt = $pdo->query("SELECT * FROM ranking_joao ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_joao': $stmt = $pdo->prepare("INSERT INTO ranking_joao (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_atos': $stmt = $pdo->query("SELECT * FROM ranking_atos ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_atos': $stmt = $pdo->prepare("INSERT INTO ranking_atos (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_romanos': $stmt = $pdo->query("SELECT * FROM ranking_romanos ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_romanos': $stmt = $pdo->prepare("INSERT INTO ranking_romanos (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_1corintios': $stmt = $pdo->query("SELECT * FROM ranking_1corintios ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_1corintios': $stmt = $pdo->prepare("INSERT INTO ranking_1corintios (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_2corintios': $stmt = $pdo->query("SELECT * FROM ranking_2corintios ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_2corintios': $stmt = $pdo->prepare("INSERT INTO ranking_2corintios (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_galatas': $stmt = $pdo->query("SELECT * FROM ranking_galatas ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_galatas': $stmt = $pdo->prepare("INSERT INTO ranking_galatas (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_efesios': $stmt = $pdo->query("SELECT * FROM ranking_efesios ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_efesios': $stmt = $pdo->prepare("INSERT INTO ranking_efesios (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_filipenses': $stmt = $pdo->query("SELECT * FROM ranking_filipenses ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_filipenses': $stmt = $pdo->prepare("INSERT INTO ranking_filipenses (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_colossenses': $stmt = $pdo->query("SELECT * FROM ranking_colossenses ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_colossenses': $stmt = $pdo->prepare("INSERT INTO ranking_colossenses (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_1tessalonicenses': $stmt = $pdo->query("SELECT * FROM ranking_1tessalonicenses ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_1tessalonicenses': $stmt = $pdo->prepare("INSERT INTO ranking_1tessalonicenses (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_2tessalonicenses': $stmt = $pdo->query("SELECT * FROM ranking_2tessalonicenses ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_2tessalonicenses': $stmt = $pdo->prepare("INSERT INTO ranking_2tessalonicenses (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_1timoteo': $stmt = $pdo->query("SELECT * FROM ranking_1timoteo ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_1timoteo': $stmt = $pdo->prepare("INSERT INTO ranking_1timoteo (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_2timoteo': $stmt = $pdo->query("SELECT * FROM ranking_2timoteo ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_2timoteo': $stmt = $pdo->prepare("INSERT INTO ranking_2timoteo (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_tito': $stmt = $pdo->query("SELECT * FROM ranking_tito ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_tito': $stmt = $pdo->prepare("INSERT INTO ranking_tito (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_filemom': $stmt = $pdo->query("SELECT * FROM ranking_filemom ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_filemom': $stmt = $pdo->prepare("INSERT INTO ranking_filemom (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_hebreus': $stmt = $pdo->query("SELECT * FROM ranking_hebreus ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_hebreus': $stmt = $pdo->prepare("INSERT INTO ranking_hebreus (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_tiago': $stmt = $pdo->query("SELECT * FROM ranking_tiago ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_tiago': $stmt = $pdo->prepare("INSERT INTO ranking_tiago (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_1pedro': $stmt = $pdo->query("SELECT * FROM ranking_1pedro ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_1pedro': $stmt = $pdo->prepare("INSERT INTO ranking_1pedro (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_2pedro': $stmt = $pdo->query("SELECT * FROM ranking_2pedro ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_2pedro': $stmt = $pdo->prepare("INSERT INTO ranking_2pedro (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_1joao': $stmt = $pdo->query("SELECT * FROM ranking_1joao ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_1joao': $stmt = $pdo->prepare("INSERT INTO ranking_1joao (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_2joao': $stmt = $pdo->query("SELECT * FROM ranking_2joao ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_2joao': $stmt = $pdo->prepare("INSERT INTO ranking_2joao (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_3joao': $stmt = $pdo->query("SELECT * FROM ranking_3joao ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_3joao': $stmt = $pdo->prepare("INSERT INTO ranking_3joao (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_judas': $stmt = $pdo->query("SELECT * FROM ranking_judas ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_judas': $stmt = $pdo->prepare("INSERT INTO ranking_judas (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    case 'ranking_apocalipse': $stmt = $pdo->query("SELECT * FROM ranking_apocalipse ORDER BY pontos DESC, acertos DESC LIMIT 10"); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); break;
    case 'salvar_quiz_apocalipse': $stmt = $pdo->prepare("INSERT INTO ranking_apocalipse (nome, pontos, acertos) VALUES (?, ?, ?)"); $stmt->execute([$_POST['nome'], $_POST['pontos'], $_POST['acertos']]); echo json_encode(['success' => true]); break;

    // === COMENTÁRIOS E MÍDIAS ===
    case 'comentarios':
        $livro = $_GET['livro'] ?? '';
        $stmt = $pdo->prepare("SELECT * FROM comentarios WHERE livro = ? ORDER BY data_comentario DESC");
        $stmt->execute([$livro]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'salvar_comentario':
        $livro = $_POST['livro'] ?? '';
        $nome = $_POST['nome'] ?? '';
        $comentario = $_POST['comentario'] ?? '';
        $imagem_url = '';
        $audio_url = '';

        if (isset($_FILES['imagem']) && $_FILES['imagem']['error'] === UPLOAD_ERR_OK) {
            $ext = pathinfo($_FILES['imagem']['name'], PATHINFO_EXTENSION);
            $nome_arq = uniqid() . '.' . $ext;
            if (move_uploaded_file($_FILES['imagem']['tmp_name'], 'uploads/' . $nome_arq)) {
                $imagem_url = 'uploads/' . $nome_arq;
            }
        }

        if (isset($_FILES['audio']) && $_FILES['audio']['error'] === UPLOAD_ERR_OK) {
            $nome_arq = uniqid() . '.wav';
            if (move_uploaded_file($_FILES['audio']['tmp_name'], 'uploads/' . $nome_arq)) {
                $audio_url = 'uploads/' . $nome_arq;
            }
        }

        $stmt = $pdo->prepare("INSERT INTO comentarios (livro, nome, comentario, imagem_url, audio_url) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$livro, $nome, $comentario, $imagem_url, $audio_url]);
        echo json_encode(['success' => true]);
        break;

    default:
        if ($action !== '') {
            echo json_encode(['error' => 'Ação não reconhecida: ' . $action]);
        }
        break;
}

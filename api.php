<?php
// Simple PHP API for storing and retrieving website content

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$method = $_SERVER['REQUEST_METHOD'];

// Define data file path
$dataFile = 'site-content.json';

// Handle preflight OPTIONS request
if ($method == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Load existing data or initialize
if (file_exists($dataFile)) {
    $data = json_decode(file_get_contents($dataFile), true);
    if ($data === null) {
        $data = [];
    }
} else {
    $data = [];
}

if ($method == 'GET') {
    // Return all content
    echo json_encode($data);
    exit();
} elseif ($method == 'POST') {
    // Get input JSON
    $input = json_decode(file_get_contents('php://input'), true);
    if ($input === null) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON']);
        exit();
    }

    // Validate required fields
    if (!isset($input['section']) || !isset($input['content'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing section or content']);
        exit();
    }

    $section = $input['section'];
    $content = $input['content'];

    // Update data
    $data[$section] = $content;

    // Save to file
    if (file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT))) {
        echo json_encode(['success' => true, 'section' => $section]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save data']);
    }
    exit();
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}
?>

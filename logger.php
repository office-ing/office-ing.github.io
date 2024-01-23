<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header("Content-type: application/json; charset=UTF-8");

// URL情報の取得
$host = $_POST['host'];
$href = $_POST['href'];
$pathname = $_POST['pathname'];
$port = $_POST['port'];
$protocol = $_POST['protocol'];

// TODO:アクセスログの書き込み

// TODO:設置可否の判定

// 結果の返却
$result = false;
echo json_encode($result);

<?php
$mysqli = new mysqli("localhost", "root", "", "knot_editor");

if(!isset($_POST['action']))
    die("Invalid request");

switch($_POST['action']) {
    case "add":
        $result = add($_POST);
        break;

    case "delete":
        $result = remove($_POST['id']);
        break;

    case "list":
        $result = getList();
        break;

    case "get":
        $result = getItem($_POST['id']);
        break;
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($result);
$mysqli->close();

function remove($id) {
    global $mysqli;

    $query = "DELETE FROM knots where id = " . $id;
    $mysqli->query($query);

    return (object) [
        'status' => 'success'
    ];
}

function add($data) {
    global $mysqli;

    $name = $data['name'];
    $json = $data['json'];

    $list = getList();
    $list_item = null;

    foreach($list as $index => $item) {
        if($index == $name) {
            $list_item = $item;
            break;
        }
    }
    
    if(!$list_item) { //update
        $query = "INSERT INTO knots (`name`, `json`) VALUES ('{$name}', '{$json}')";
    }
    else { //insert
        $query = "UPDATE knots SET `json` = '{$json}' WHERE id = '{$list_item['id']}'";
    }
    
    $mysqli->query($query);

    return (object) [
        'status' => 'success'
    ];
}

function getList() {
    global $mysqli;
    $list = [];

    $query = "SELECT * from knots";
    $result = $mysqli->query($query);

    while($row = $result->fetch_assoc()) {
        $list[$row['name']] = $row;
    }

    
    $result->free_result();

    return $list;
}

function getItem($id) {
    global $mysqli;

    $query = "SELECT * from knots where id = " . $id;
    $result = $mysqli->query($query);

    $row = $result->fetch_assoc();

    $result->free_result();

    return $row;
}
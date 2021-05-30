<?php
    // ini_set('display_errors', '1');
    // ini_set('display_startup_errors', '1');
    // error_reporting(E_ALL);

    function curlRequest($url){
        $ch = curl_init($url);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        $result = json_decode(curl_exec($ch), true);

        return $result;

        curl_close($ch);
    }

    $result = curlRequest("https://randomuser.me/api/?results=4");

    foreach($result["results"] as $val){
        $output[] = [
            "name" => "{$val["name"]["title"]} {$val["name"]["first"]} {$val["name"]["last"]}" ,
            "picture" => $val["picture"]["thumbnail"],
            "contact" => "{$val["email"]} | {$val["phone"]}"
        ];
    }

    header("Content-Type: application/json; charset=UTF-8");

    echo json_encode($output); 
?>
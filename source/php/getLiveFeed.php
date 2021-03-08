<?php
    ini_set('display_errors', '1');
    ini_set('display_startup_errors', '1');
    error_reporting(E_ALL);

    $key = "RowCFQ4Bha61Zap9UTVXNQaWSA3QgSVG";

    $ch = curl_init("https://api.windy.com/api/webcams/v2/list/country={$_REQUEST["isoCode"]}?show=webcams:url,location&key={$key}");
    
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $result = json_decode(curl_exec($ch), true);

    curl_close($ch);

    $output["status"] = $result["status"];
    foreach($result["result"]["webcams"] as $var){
        $output["webcams"][] = [
            "name" => $var["location"]["city"],
            "id" => $var["id"],
            "coords" => [$var["location"]["latitude"], $var["location"]["longitude"]]
        ];
    }


    header("Content-Type: application/json; charset=UTF-8");

    echo json_encode($output); 
?>
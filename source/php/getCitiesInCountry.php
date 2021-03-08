<?php
    ini_set('display_errors', '1');
    ini_set('display_startup_errors', '1');
    error_reporting(E_ALL);

    $key = "mikisupor96";

    $ch = curl_init("api.geonames.org/search?country={$_REQUEST["isoCode"]}&username={$key}&type=JSON");
    $executionStartTime = microtime(true) / 1000;

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $result = json_decode(curl_exec($ch), true);

    if(curl_exec($ch) === false){
        $output['status']['code'] = "400";
        $output["error"] = curl_error($ch);
    }else{
        $output['status']['code'] = "200";
        $output['status']['returnedIn'] = (microtime(true) / 1000) - $executionStartTime . " ms";    
    }

    curl_close($ch);

    foreach($result["geonames"] as $value){
        $output["Cities"][] = [
            "name" => $value["name"],
            "coords" => [$value["lat"], $value["lng"]]
        ];
    }

    header("Content-Type: application/json; charset=UTF-8");

    echo json_encode($output); 
?>
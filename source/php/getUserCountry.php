<?php
    ini_set('display_errors', '1');
    ini_set('display_startup_errors', '1');
    error_reporting(E_ALL);

    $key = "mikisupor96";

    $ch = curl_init("http://api.geonames.org/countryCode?lat={$_REQUEST["lat"]}&lng={$_REQUEST["lon"]}&username={$key}&type=JSON");
    
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $result = json_decode(curl_exec($ch), true);

    curl_close($ch);

    $output["data"] = $result;
    $output["isoCode"] = $result["countryCode"];
    $output["name"] = $result["countryName"];

    header("Content-Type: application/json; charset=UTF-8");

    echo json_encode($output); 
?>
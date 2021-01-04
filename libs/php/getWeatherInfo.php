<?php
    //display errors
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);
    //count exec time
	$executionStartTime = microtime(true) / 1000;
    // call url
    $iAmPrivate = "48123a985b20a1619df8819a6d550170";
	$url= "api.openweathermap.org/data/2.5/weather?q=". $_REQUEST["country"] . "&appid=" . $iAmPrivate  .  "&units=metric";
	// make request
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

    $result=curl_exec($ch);
    if (curl_exec($ch) === false) {
        echo "error";
    }
	curl_close($ch);

    // get data and convert
	$decode = json_decode($result,true);

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = microtime(true) / 1000 - $executionStartTime . " ms";
	$output['data'] = $decode;
	$output['name'] = $decode["name"];
    $output['temperature'] = $decode["main"]["temp"];
    $output["description"] = $decode["weather"][0]["description"];
    $output['sunrise'] = $decode["sys"]["sunrise"];

    header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 
?>

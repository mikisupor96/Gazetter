<?php
	$executionStartTime = microtime(true) / 1000;
	$url = file_get_contents('http://localhost/source/json/countryBorders.geo.json');
	$countryCode = $_REQUEST["countryCode"];
	$decode = json_decode($url, true);

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = (microtime(true) / 1000 - $executionStartTime) / 1000 . " sec";
	foreach ($decode["features"] as $value) {
		if($value["properties"]["iso_a2"] === $countryCode){
			$output['data'] = $value;
		}
	}

	header('Content-Type: application/json; charset=UTF-8');
	echo json_encode($output);  
?>

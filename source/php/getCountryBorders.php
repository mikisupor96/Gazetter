<?php
	$url = file_get_contents('http://localhost/source/json/countryBorders.geo.json');
	$countryCode = $_REQUEST["countryCode"];
	$decode = json_decode($url, true);

	foreach ($decode["features"] as $value) {
		if($value["properties"]["iso_a2"] === $countryCode){
			$output['data'] = $value;
		}
	}

	header('Content-Type: application/json; charset=UTF-8');
	echo json_encode($output);  
?>


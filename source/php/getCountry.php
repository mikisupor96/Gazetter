<?php
	$url = file_get_contents('http://localhost/source/json/countryBorders.geo.json');
	$decode = json_decode($url, true);

	$output['data'] = [];

	foreach ($decode["features"] as $value) {
		array_push($output['data'], $value["properties"]);
	}

	sort($output['data']);

	header('Content-Type: application/json; charset=UTF-8');
	echo json_encode($output);  
?>



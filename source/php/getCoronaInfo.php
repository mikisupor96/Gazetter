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

    function getSlug(){
        $result = curlRequest("https://api.covid19api.com/countries");

        foreach($result as $val){
            if($val["ISO2"] === strtoupper($_REQUEST["isoCode"])) {
                return $val["Slug"];
            };
        }
    }

    function getData($slug){
        $result = curlRequest("https://api.covid19api.com/live/country/${$slug}/status/confirmed");

        foreach($result as $val){
            if($val["Date"] === "2021-03-16T00:00:00Z"){
                // recent data
                $data = [
                    "Date" => $val["Date"],
                    "Confirmed" => $val["Confirmed"],
                    "Deaths" => $val["Deaths"],
                    "Recovered" => $val["Recovered"],
                    "Active" => $val["Active"],
                ];
            }
        }

        return $data;

        curl_close($ch);
    }

    $output = getData(getSlug());

    header("Content-Type: application/json; charset=UTF-8");

    echo json_encode($output); 
?>
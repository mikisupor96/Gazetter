<?php
    // error reporting
    // ini_set('display_errors', '1');
    // ini_set('display_startup_errors', '1');
    // error_reporting(E_ALL);
    
    $weatherKey = "48123a985b20a1619df8819a6d550170";
    $newsKey = "1817bf312cb141f8a2d3d282b3c737c2";
    $username = "mikisupor96";

    $country = str_replace(' ', '%20', $_REQUEST["country"]);
    $isoCode = $_REQUEST["countryCode"];

    $countryInfo = getCountryInfo($isoCode);
    $countryCapital = $countryInfo["capital"];


    function getCountryInfo($iso){
        $ch = curl_init("https://restcountries.eu/rest/v2/alpha/{$iso}?fields=region;capital;population;currencies;languages;flag");
    
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
        $result = json_decode(curl_exec($ch), true);
    
        curl_close($ch);

        return $result;
    }

    
    function getResponseByUrlsMulti($urls){
        // counts execution time from this point
        $executionStartTime = microtime(true) / 1000;

        //================================================================CURL OPTIONS================================================================//
        $curlOptions = [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false,
        ];
        //================================================================INIT MULTICURL================================================================//
        $mh = curl_multi_init();
        $chArray = [];
    
        $urls = !is_array($urls) ? [$urls] : $urls;
        foreach ($urls as $key => $url) {
            //================================================================INIT REQUESTS================================================================//
            $ch = curl_init($url);
            curl_setopt_array($ch, $curlOptions);
    
            $chArray[$key] = $ch;
    
            //================================================================ADD HANDLES================================================================//
            curl_multi_add_handle($mh, $ch);
        }
    
        //================================================================EXECUTE REQUESTS================================================================//
        $active = null;
        do {
            $mrc = curl_multi_exec($mh, $active);
        } while ($mrc == CURLM_CALL_MULTI_PERFORM);
    
        while ($active && $mrc == CURLM_OK) {
            //================================================================WAIT FALLBACK================================================================//
            if (curl_multi_select($mh) === -1) {
                usleep(100);
            }
    
            while (curl_multi_exec($mh, $active) == CURLM_CALL_MULTI_PERFORM);
        }

        // error handling
        if($mrc != CURLM_OK){
            $output['status']['code'] = "400";
            $output["error"] = curl_multi_strerror($status);
        }else{
            $output['status']['code'] = "200";
            $output['status']['returnedIn'] = (microtime(true) / 1000) - $executionStartTime . " ms";    
        }
    
        //================================================================CLOSE================================================================//
        foreach ($chArray as $ch) {
            curl_multi_remove_handle($mh, $ch);
        }
        curl_multi_close($mh);
    
        //================================================================GET RESULTS================================================================//
        $result = [];
        foreach ($chArray as $key => $ch) {
            $result[$key] = json_decode(curl_multi_getcontent($ch), true);
        }

        global $isoCode, $countryInfo, $countryCapital;

        // country info
        $output["countryInfo"] = [
            "capital" => $countryCapital,
            "region" => $countryInfo["region"],
            "population" => $countryInfo["population"],
            "currency" => [
                "name" => $countryInfo["currencies"][0]["name"], 
                "symbol" => isset($countryInfo["currencies"][0]["symbol"]) ? $countryInfo["currencies"][0]["symbol"] : ""
            ],
            "language" => $countryInfo["languages"][0]["name"], 
            "flag" => $countryInfo["flag"]
        ];

        // weather info
        $output["weather"] = [
            "pressure" => $result[1]["list"][0]["main"]["pressure"],
            "humidity" => $result[1]["list"][0]["main"]["humidity"],
            "wind" => $result[1]["list"][0]["wind"]["speed"],
            "temperature" => $result[1]["list"][0]["main"]["temp"],
            "desc" => [
                "description" => $result[1]["list"][0]["weather"][0]["description"], 
                "icon" => $result[1]["list"][0]["weather"][0]["icon"]
            ]
        ];

        // news articles
        if($result[2]["totalResults"] > 0){
            for ($x = 0; $x < 3; $x++) {
                $output["news"][] = [
                    "title" => $result[2]["articles"][$x]["title"],
                    "description" => $result[2]["articles"][$x]["description"],
                    "image" => $result[2]["articles"][$x]["urlToImage"],
                    "url" => $result[2]["articles"][$x]["url"]
                ];
            }
        }
        
        // wiki extract info
        foreach($result[0]["query"]["pages"] as $val){
            $output["wikiExtract"] = $val["extract"];
        }

        return $output;
    }

    $output = getResponseByUrlsMulti([
        
    ]);

    $output = getResponseByUrlsMulti([
        "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles={$country}",
        "api.openweathermap.org/data/2.5/find?q={$countryCapital}&units=metric&appid={$weatherKey}",
        "https://newsapi.org/v2/top-headlines?country={$isoCode}&apiKey={$newsKey}",
    ]);

    header("Content-Type: application/json; charset=UTF-8");

    echo json_encode($output);
?>


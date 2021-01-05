<?php
    ini_set('display_errors', '1');
    ini_set('display_startup_errors', '1');
    error_reporting(E_ALL);

    $weatherKey = "";
    $newsKey = "";
    
    function getResponseByUrlsMulti($urls){
        $executionStartTime = microtime(true) / 1000;
        //================================================================CURL OPTIONS================================================================//
        $curlOptions = [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false
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
    
        //================================================================CLOSE================================================================//
        foreach ($chArray as $ch) {
            curl_multi_remove_handle($mh, $ch);
        }
        curl_multi_close($mh);
    
        //================================================================GET RESULTS================================================================//
        $result = [];
        foreach ($chArray as $key => $ch) {
            $result[$key] = json_decode(curl_multi_getcontent($ch), true);
            $result["status"]["code"] = "200";
            $result["status"]["name"] = "ok";
            $result["status"]["description"] = "success";
            $result["status"]["executedIn"] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
        }

        $output["weather"]["temp"] = $result[1]["list"][0]["main"]["temp"];
        $output["weather"]["humidity"] = $result[1]["list"][0]["main"]["humidity"];
        $output["weather"]["wind"]["speed"] = $result[1]["list"][0]["wind"]["speed"];
        $output["weather"]["rain"] = $result[1]["list"][0]["rain"];
        $output["weather"]["description"] = $result[1]["list"][0]["weather"][0]["description"];

        $output["news"]["article_1"]["title"] = $result[2]["articles"][0]["title"];
        $output["news"]["article_1"]["content"] = $result[2]["articles"][0]["content"];
        $output["news"]["article_2"]["title"] = $result[2]["articles"][2]["title"];
        $output["news"]["article_2"]["content"] = $result[2]["articles"][2]["content"];

        foreach($result[0]["query"]["pages"] as $val){
            $output["wikiExtract"] = $val["extract"];
        }

        // $output["data"] = $result;

        return $output;
    }

    $output = getResponseByUrlsMulti([
        "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=" . $_REQUEST["country"],
        "api.openweathermap.org/data/2.5/find?q=London&units=metric&appid=" . $weatherKey,
        "https://newsapi.org/v2/top-headlines?country=" . $_REQUEST["countryCode"] . "&apiKey=" . $newsKey,
    ]);
    

    header("Content-Type: application/json; charset=UTF-8");

    echo json_encode($output);
?>





<?php
    $weatherKey = "48123a985b20a1619df8819a6d550170";
    $newsKey = "1817bf312cb141f8a2d3d282b3c737c2";
    
    function getResponseByUrlsMulti($urls){
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
            $result[$key] = json_decode(curl_multi_getcontent($ch));
            $result["status"]["code"] = "200";
            $result["status"]["name"] = "ok";
            $result["status"]["description"] = "success";
            $result["status"]["executedIn"] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

            // $result["weatherInfo"] = $result[1]["list"][1]["temp"];
        }

        return $result;
    }

    $output = getResponseByUrlsMulti([
        "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=" . $_REQUEST["country"],
        "api.openweathermap.org/data/2.5/find?q=London&units=metric&appid=" . $weatherKey,
        "https://newsapi.org/v2/top-headlines?country=" . $_REQUEST["countryCode"] . "&apiKey=" . $newsKey
    ]);

    header("Content-Type: application/json; charset=UTF-8");

    try {
        echo json_encode($output);
    } catch (Throwable $e) {
        echo "Captured Throwable: " . $e->getMessage() . PHP_EOL;
    }
?>





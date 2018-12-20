<?php
/**
 * compare.php
 *
 * @package
 * @author: Samuel Levy <sam@samuellevy.com>
 */

use JJG\Ping;

require_once __DIR__ . '/vendor/autoload.php';

$request_body = file_get_contents('php://input');

if (empty($request_body)) {
    die('Nothing to compare');
}

$data = json_decode($request_body, true);

// really basic - I don't care too much if it's junk.
$userIP = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'];

if (! empty($userIP)) {
    try {
        $ping = new Ping($userIP);

        $all = [];
        // ping them 5 times
        for($i = 0; $i < 7; $i++) {
            $all[] = $ping->ping();
        }

        // sort the array
        sort($all);

        // drop the highest and the lowest
        array_shift($all);
        array_pop($all);

        // get an average ping
        $avg = 0;
        foreach ($all as $p) {
            $avg += $p;
        }
        $avg = ceil($avg / 5);

        $comp = abs($avg - ceil($data['avg']));

        if ($comp > 150) {
            die('Proxy or VPN very likely (variance > 150ms)');
        } elseif ($comp > 100) {
            die('Proxy or VPN likely (variance > 100ms)');
        } elseif ($comp > 30) {
            die('Proxy or VPN possible (variance > 30ms)');
        } elseif ($comp > 10) {
            die('Proxy or VPN unlikely (variance > 10ms)');
        } else {
            die('No VPN or Proxy (<=10ms variance)');
        }
    } catch (Exception $e) {
        die('Could not check connection to you from the server');
    }
}

die('I cannot even find your IP');
<?php

/**
 * Invalidate HTTP caches.
 *
 * This implementation uses HTTP PURGE method.
 */
class CacheInvalidator {

  /** server protocol and hostname or ip. */
  private $servers;
  /** hostnames servers may have cached content under. */
  private $hostnames;

  /**
   * @param $servers {Array<String>}
   *        array of caching servers, including protocol,
   *        for example 'http://my.cache.server'.
   * @param $hostnames {Array<String>}
   *        array of host names.
   */
  public function __construct($servers, $hostnames) {
    $this->servers = $servers;
    $this->hostnames = $hostnames;
  }


  /**
   * Invalidate one cached url.
   *
   * @param $path {String}
   *        site-relative path to invalidate.
   * @return {Array<server => hostname => statuscode>}
   *         statuscode '200' indicates cache cleared.
   *         statuscode '404' indicates not cached.
   */
  public function invalidateUrl($path) {
    // squid invalidation
    $results = array();
    foreach ($this->servers as $server) {
      foreach ($this->hostnames as $hostname) {
        $url = $server . $path;
        $ch = curl_init($url);
        curl_setopt_array($ch, array(
          CURLOPT_CUSTOMREQUEST => 'PURGE',
          CURLOPT_HTTPHEADER => array(
            'Host: ' . $hostname
          )
        ));
        curl_exec($ch);
        $results[$server][$hostname] = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
      }
    }
    return $results;
  }

}

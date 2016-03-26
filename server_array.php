<?php 

    // The search terms are passed in the q parameter
// search_server.php?q=[search terms]
if (!empty($_GET['q'])) {
	
	// Remove any hack attempts from input data
	$search_terms = htmlspecialchars($_GET['q']);
	
	// Get the application OAuth tokens
	require 'app_tokens.php';
	
	// Create an OAuth connection
	require 'tmhOAuth.php';
	$connection = new tmhOAuth(array(
	  'consumer_key'    => $consumer_key,
	  'consumer_secret' => $consumer_secret,
	  'user_token'      => $user_token,
	  'user_secret'     => $user_secret
	));
	
	// Request the most recent 100 matching tweets
	$http_code = $connection->request('GET',$connection->url('1.1/search/tweets'), 
		    	array('q' => $search_terms,
		    	'count' => 100,
		    	'lang' => 'en',
				'type' => 'recent'));

	// Search was successful
	if ($http_code == 200) {
			
		// Extract the tweets from the API response
		$response = json_decode($connection->response['response'],true);
		$tweet_data = $response['statuses']; 
        
        // Accumulate tweets from results
		$tweet_stream = array();
		// Checks tweet object for urls, and if one exists, 
		// returns it.  Else, it checks for media urls, and 
		// if one exists, it returns it.  Else null.  Specifies 
		// whether URL is an image or not via boolean.  Else, null.
		function getURL($theTweet) {
			$url_location = $theTweet['entities']['urls'][0];
			$media_location = $theTweet['entities']['media'][0];
			if (!(empty($url_location))) {
				return array(
					'theURL' => $url_location['expanded_url'], 
					'isImage' => false);
			} else if (!(empty($media_location))) {
				// return $media_location['media_url'];
				return array(
					'theURL' => $media_location['media_url'], 
					'isImage' => true
					);
			} else {
				return array(
					'theURL' => null, 
					'isImage' => null);
			}
		}
		// Take tweet data, loop through tweets and create an associative array 
		// containing 'text', 'date', and 'url' keys
		foreach ($tweet_data as $tweet) {
			
			$url = getURL($tweet);
			array_push($tweet_stream, array(
				'text' => $tweet['text'],
				'date' => $tweet['created_at'],
				'url' => $url['theURL'],
				'isImage' => $url['isImage'],
				'tweet_id' => $tweet['id_str'],
				'screen_name' => $tweet['user']['screen_name']
				));
		}
        
		json_encode($tweet_stream);
        
        
        
        
        
        
	// Handle errors from API request
	} else {
		if ($http_code == 429) {
			print 'Error: Twitter API rate limit reached.';
		} else {
			print 'Error: Twitter was not able to process that request.';
		}
	}
}




?>
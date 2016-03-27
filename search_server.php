<?php 

// The search terms are passed in the q parameter
// search_server.php?q=[search terms]
if (!empty($_GET['q'])) {
	
	// Remove any hack attempts from input data
	$search_terms = htmlspecialchars($_GET['q']);
	
	// Get the application OAuth tokens
	require 'app_tokens.php';
    
    //get the datumbox api key
    require 'config.php';
    require 'lib/TwitterSentimentAnalysis.php';
    
    $TwitterSentimentAnalysis = new TwitterSentimentAnalysis(DATUMBOX_API_KEY,
    TWITTER_CONSUMER_KEY,TWITTER_CONSUMER_SECRET,
    TWITTER_ACCESS_KEY,TWITTER_ACCESS_SECRET);
	
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
		$twitterSearchParams=array('q' => $search_terms,
		    	'count' => 100,
		    	'lang' => 'en',
				'type' => 'recent'));

	// Search was successful
	if ($http_code == 200) {

		// Extract the tweets from the API response
		$response = json_decode($connection->response['response'],true);        
     
		$tweet_data = $response['statuses']; 
        
         //Response to be sent to Sentiment API 
        $response= $TwitterSentimentAnalysis->sentimentAnalysis($twitterSearchParams);  
     
        //Sending the Twitter API response(JSONP) direct to a local file
        $file = 'data.json';
        file_put_contents( 'data.json', json_encode($response)); 

		// Load the template for tweet display
		$tweet_template= file_get_contents('tweet_template.html');
		
		// Load the library of tweet display functions
		require 'display_lib.php';	

		// Create a stream of formatted tweets as HTML
		$tweet_stream = '';
        
        
		foreach($tweet_data as $tweet) {
                
			// Ignore any retweets
			if (isset($tweet['retweeted_status'])) {
				continue;
			}
			
			// Get a fresh copy of the tweet template
			$tweet_html = $tweet_template;
			
			// Insert this tweet into the html
			$tweet_html = str_replace('[screen_name]',
				$tweet['user']['screen_name'],$tweet_html);
			$tweet_html = str_replace('[name]',
				$tweet['user']['name'],$tweet_html);		
			$tweet_html = str_replace('[profile_image_url]',
				$tweet['user']['profile_image_url'],$tweet_html);
			$tweet_html = str_replace('[tweet_id]',
				$tweet['id'],$tweet_html);
			$tweet_html = str_replace('[tweet_text]',
				linkify($tweet['text']),$tweet_html);
			$tweet_html = str_replace('[created_at]',
				twitter_time($tweet['created_at']),$tweet_html);
			$tweet_html = str_replace('[retweet_count]',
				$tweet['retweet_count'],$tweet_html);			
                
                
                   //if loop to change text color    
          /*  $color=NULL;
            if($tweet['sentiment']=='positive'){            
                $color='#00FF00';
            }
            else if($tweet['sentiment']=='negative'){
                $color='#FF0000';
            }
            else if($tweet['sentiment']=='neutral'){
                $color='#FFFFFF';
            }
			*/	
			
			// Add the HTML for this tweet to the stream
 
			$tweet_stream .= $tweet_html;
   
		}
	
		// Pass the tweets HTML back to the Ajax request
		print $tweet_stream;

	// Handle errors from API request
	} else {
		if ($http_code == 429) {
			print 'Error: Twitter API rate limit reached';
		} else {
			print 'Error: Twitter was not able to process that search';
		}
	}

} else {
	print 'No search terms found';
}	
?>
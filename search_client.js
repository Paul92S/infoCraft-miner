// jQuery script for search request with server
jQuery(document).ready(function($) {
	
	var first = getUrlVars()["searchTerms"];
	//alert(first);
	
	$('#searcher').val($('#searcher').val() + first);
	
	function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
	vars[key] = value;
	});
	return vars;
	}

	setTimeout(function() {triggerClick();}, 1000);
	function triggerClick(){
		document.getElementById("search_button").click();
	}

	// Run when Search button is clicked
	$('#search_button').click(function(){
		
		// Display a progress indicator
        $('.overlay').html('<i class="fa fa-refresh fa-spin"></i>');
		$('#search_results').html('<img id="loading" src="ajax_loader.gif"> Searching Twitter... this may take a few moments');
        
		
		// Get the value of the input field
		// Encode it for use in a URL
		var search_value = encodeURIComponent($('input[name=search_terms]').val());
		
		// Send the search terms to the server in an Ajax request
		// This URL is for illustration only
		// You MUST change it to your server
		$.ajax({
			url: 'search_server.php?q=' + search_value,
			success: function(data){

				// Display the results
				$('#search_results').html(data);
                $('.overlay').remove();
                $('#titleB').remove();
                $('#titleA').html('<h3 id="titleB" class="box-title"> Here are the latest Tweets</h3>');
			}//End of Ajax
	
		})
	})

	/*Parsing JSON And Applying to Charts
	DOM subtree event listener to read the new JSON data 
	*/

	setTimeout(function() {count();}, 15000);
	function count(){
		
	}

	var request;
	if(window.XMLHttpRequest){
		request = new XMLHttpRequest();

	}else {
		request = new ActiveXObject("Microsoft.XMLHTTP");
	}
	request.open('GET', 'data.json');
	request.onreadystatechange = function(){
		if((request.readyState===4) && (request.status===200)){
			var items = JSON.parse(request.responseText);
			console.log(items);

			//local count variables
			var positive=0,negative=0,neutral =0;
			var iPhoneCount=0, androidCount=0, webClient=0; other=0;
			var verifiedCount=0, nonVerCount=0;
			var plaintext=0, retweet=0, userMention=0;

			$.each(items, function(index, element){
               if (element.sentiment.includes('positive')){
                   positive++;   
                   }else if(element.sentiment.includes('negative')){
                       negative++;  
                        }else if(element.sentiment.includes('neutral')){
                        neutral++;
                    }
				})
			 
                $.each(items, function(i, v){
                    if(v.source.includes('iPhone')){
                        iPhoneCount++;
                    }
					else if(v.source.includes('android')){
						androidCount++;
					}
					else if(v.source.includes('Web Client')){
						webClient++;
					}else {
						other++;
					}
                })

				//Being count for Verified Tweets
            
            $.each(items, function(index, element){
               if (element.verified.valueOf('true')){
                   verifiedCount++;
                   }else{
                       nonVerCount++; 
                   }
                })//End of Verified tweet count

				$.each(items, function(index, element) {
					if(element.text.includes('RT')){
						retweet++;
					}else if(element.text.includes('@')){
						userMention++;
					}else {
						plaintext++;
					}
				})
				
				var totalReturn = nonVerCount+verifiedCount; 
				var mentionPercentage = (userMention/totalReturn)*100; console.log("Mention % :"+mentionPercentage);
				var plainPercentage = (plaintext/totalReturn)*100; console.log("Plaintext % :"+plainPercentage);
				var retweetPercentage = (retweet/totalReturn)*100; console.log("Retweet % :"+retweetPercentage);
				var verifiedPercentage = (verifiedCount/totalReturn)*100; console.log("verified % :"+verifiedPercentage);

				document.getElementById('plainProgress').style.width = plainPercentage +'%' ;
				document.getElementById('retweetProgress').style.width = retweetPercentage +'%';
				document.getElementById('verifiedProgress').style.width = verifiedPercentage +'%';
				document.getElementById('mentionProgress').style.width = mentionPercentage +'%';

				$('#mentionNo').html(userMention);
				$('#retweetNo').html(retweet);
				$('#pTextNo').html(plaintext);
				$('#verifiedNo').html(verifiedCount);

				//console values to count the number returned in the search
				console.log("Positive Tweets :" + positive);
				console.log("Neutral Tweets :" + neutral);
				console.log("Negative Tweets :" + negative);
				console.log("Sent from iPhone :" +iPhoneCount);
				console.log("Sent from Android Devices :"+androidCount);
				console.log("Sent from Web Application :"+webClient);
				console.log("Sent from other source :" +other);
				console.log("Verified users :" +verifiedCount);
				console.log("Regular user posts :"+nonVerCount);
				console.log("Plain text tweets :"+plaintext);
				console.log("Retweeted tweets :"+retweet);
				console.log("Contained user mention :"+userMention);
				console.log("Total Number of Tweets Returned :"+totalReturn);
		}
	}
	request.send();
 
});
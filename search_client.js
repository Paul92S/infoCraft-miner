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

	//Parsing JSON And Applying to Charts
	
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

			$.each(items, function(index, element){
               if (element.sentiment.includes('positive')){
                   positive++;
                   
                   }else if(element.sentiment.includes('negative')){
                       negative++;
                       
                        }else if(element.sentiment.includes('neutral')){
                        neutral++;
                        
                    }
			})
		
			
			
			/*for (var key in items){

				
				if(items[key].sentiment == "positive"){
					positive++;
				}else if(items[key].sentiment == "negative"){
					negative++;
				}else if(items[key].sentiment == "neutral"){
					neutral++;
				}
				
			} */
		
				//console values outside of loop
				console.log("Positive Tweets :" + positive);
				console.log("Neutral Tweets :" + neutral);
				console.log("Negative Tweets :" + negative);
				
		}
	}
	request.send();



   
});
 (function (window) {
    var last = +new Date();
    var delay = 100; // default delay

    // Manage event queue
    var stack = [];

    function callback() {
        var now = +new Date();
        if (now - last > delay) {
            for (var i = 0; i < stack.length; i++) {
                stack[i]();
            }
            last = now;
        }
    }

    // Public interface
    var onDomChange = function (fn, newdelay) {
        if (newdelay) delay = newdelay;
        stack.push(fn);
    };

    // Naive approach for compatibility
    function naive() {

        var last = document.getElementsByTagName('*');
        var lastlen = last.length;
        var timer = setTimeout(function check() {

            // get current state of the document
            var current = document.getElementsByTagName('*');
            var len = current.length;

            // if the length is different
            // it's fairly obvious
            if (len != lastlen) {
                // just make sure the loop finishes early
                last = [];
            }

            // go check every element in order
            for (var i = 0; i < len; i++) {
                if (current[i] !== last[i]) {
                    callback();
                    last = current;
                    lastlen = len;
                    break;
                }
            }

            // over, and over, and over again
            setTimeout(check, delay);

        }, delay);
    }

    //
    //  Check for mutation events support
    //

    var support = {};

    var el = document.documentElement;
    var remain = 3;

    // callback for the tests
    function decide() {
        if (support.DOMNodeInserted) {
            window.addEventListener("DOMContentLoaded", function () {
                if (support.DOMSubtreeModified) { // for FF 3+, Chrome
                    el.addEventListener('DOMSubtreeModified', callback, false);
                } else { // for FF 2, Safari, Opera 9.6+
                    el.addEventListener('DOMNodeInserted', callback, false);
                    el.addEventListener('DOMNodeRemoved', callback, false);
                }
            }, false);
        } else if (document.onpropertychange) { // for IE 5.5+
            document.onpropertychange = callback;
        } else { // fallback
            naive();
        }
    }

    // checks a particular event
    function test(event) {
        el.addEventListener(event, function fn() {
            support[event] = true;
            el.removeEventListener(event, fn, false);
            if (--remain === 0) decide();
        }, false);
    }

    // attach test events
    if (window.addEventListener) {
        test('DOMSubtreeModified');
        test('DOMNodeInserted');
        test('DOMNodeRemoved');
    } else {
        decide();
    }

    // do the dummy test
    var dummy = document.createElement("div");
    el.appendChild(dummy);
    el.removeChild(dummy);

    // expose
    window.onDomChange = onDomChange;
})(window)   
  

$.ajax({
        type: 'GET',
        dataType: 'json',
        cache: false,
        url: 'data.json',
        success: function(data){
            
                var iPhoneCount=0,androidCount=0, webCount=0, dlvrCount=0,
                mobileWebCount=0, posCount=0, negCount=0, verifiedCount=0, 
                nonVerCount=0, neuCount=0, hashCount=0, plaintext=0, mentionCount=0; 
                
                // New Counter lad 
                $.each(data.source, function(i, v){
                    if(v.source.search(new RegExp(/iPhone/)) != null){
                        iPhoneCount++;
                    }
                    
                    console.log(iPhoneCount);
                    
                })

                //Count fot the sources
            $.each(data, function(index, element){
               if (element.source.includes('iPhone')){
                   iPhoneCount++;
                   
                   }else if(element.source.includes('Android')){
                       androidCount++;
                       
                        }else if(element.source.includes('Web')){
                        webCount++;
                        
                    }else if(element.souce.includes('dlvr')){
                        dlvrCount++;
                    
                }else if(element.source.inclues('Mobile')){
                    mobileWebCount++;
                    
                }            
            })//End of the Source Count   
                 
            console.log(iPhoneCount);
            console.log(iPhoneCount);
            console.log(iPhoneCount);
            console.log(iPhoneCount);
            
            //Begin count for Sentiment
            
            $.each(data, function(index, element){
               if (element.sentiment.includes('positive')){
                   posCount++;
                   
                   }else if(element.sentiment.includes('negative')){
                       negCount++;
                       
                        }else if(element.sentiment.includes('neutral')){
                        neuCount++;
                        
                    }
                    
            })//End of Sentiment
            
            //Being count for Verified Tweets
            
            $.each(data, function(index, element){
               if (element.verified.valueOf(true)){
                   verifiedCount++;
                   
                   }else if(element.verified.valueOf(false)){
                       nonVerCount++;
                       
                   }
            
                   })//End of Verified tweet count
                   
                   //Count for user_mentions
                    $.each(data, function(index, element){
               if (element.user_mentions != null){
                   mentionCount++; 
                   
                    }
            
                   })//End of user_mentions Count
                   
                   //Count for the if the tweet contains a hastag else it is plain text
                   
                   $.each(data, function(index, element){
                       if(element.entities.hashtags != null){
                           hashCount++;
                       } else{
                           plaintext++;
                       }
                       
                       
                       
                   })

          $(document).on('DOMNodeInserted', function(e) {
                if (e.target.id == 'titleA') {
                //element with #someID was inserted.
                }//end if target id
            })//end of DOMNodeInserted
            
            
        },      
    })
    
    
    

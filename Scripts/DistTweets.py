import twitter
import json

ckey = 'Xw58AcfLS388NW2bGqLioOeo3'
csecret = 'xdeoe5rNRFaySGQogn1htMzZkX3eydeTeU366bTp3TlHyce7Gz'
atoken = '4286932653-o2yet6Xul4b0EpX4NrHmxqL1gvnHUEiTQOFgERA'
asecret = 'w9EggQItc00VShNTMprWfRkMAOcUKqe2VwtN31jrUkrRg'

auth = twitter.oauth.OAuth(atoken, asecret, ckey, csecret)

twitter_api = twitter.Twitter(auth=auth)

#insert the button listener form to search 
q = '#UFC'
count = 100

search_results = twitter_api.search.tweets(q=q, count=count) 

statuses = search_results[' statuses ']

#number of interations // 5

for _ in range(5):
    print "Length of Statuses", len(statuses)
    try: 
        next_results = search_results['search_metadata']['next_results']
    except KeyError, e: #No more Results when next_results doesnt exist
        break
        
    kwargs = dict([kv.split('=') for kv in next_results[1:].split("&")])
    
    search_results = twitter_api.search.tweets(**kwargs)
    statuses += search_results['statuses']

#show one example of the search results dumping the JSON File from index 0

print json.dumps(statuses[0], indent=1)  

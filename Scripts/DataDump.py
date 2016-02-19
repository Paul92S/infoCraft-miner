import twitter
import csv
import json

CONSUMER_KEY = ''
CONSUMER_SECRET = ''
OAUTH_TOKEN = ''
OAUTH_TOKEN_SECRET = ''

auth= twitter.oauth.OAuth(OAUTH_TOKEN, OAUTH_TOKEN_SECRET,
                           CONSUMER_KEY, CONSUMER_SECRET)
                           
twitter_api = twitter.Twitter(auth=auth)
q = '#ufc'
count = 100

search_results = twitter_api.search_tweets(q=q, count=count)

statuses = search_results['statuses']

#iterate through 5 more batches of results following the cursor 

for _ in range(5)
    print "Length of statuses", len(statuses)
    try:
        next_results = search_results['search_metadata']['next_results']
    except KeyError, e: #No more results when next_results doesnt exist 
        break
        
    kwargs = dict()                          
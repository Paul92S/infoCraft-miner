from tweepy import Stream
from tweepy import OAuthHandler
from tweepy.streaming import StreamHandler
import twitter

ckey = 'Xw58AcfLS388NW2bGqLioOeo3'
csecret = 'xdeoe5rNRFaySGQogn1htMzZkX3eydeTeU366bTp3TlHyce7Gz'
atoken = '4286932653-o2yet6Xul4b0EpX4NrHmxqL1gvnHUEiTQOFgERA'
asecret = 'w9EggQItc00VShNTMprWfRkMAOcUKqe2VwtN31jrUkrRg'

class listener(StreamListener):
    
    def on_data(self, data):
        try:
            print data
            #tweet = data.split(', "text": "') [1].split('","source')[0]
            #print tweet
            #saveFile = str(time.time())+'::'+tweet
            saveFile = open('twitDBfull.csv', 'a')
            saveFile.write(data)
            saveFile.write('/n')
            saveFile.close()
            return True
        except BaseException, e:
            print 'failed ondata, ' ,str(e)
            time.sleep(5)
           
    def on_error(self, status):
        print status
        
auth = OAuthHandler(ckey, csecret)
auth.set_access_token(atoken, asecret)        
twitterStream = Stream(auth, listener())
twitterStream.filter(track=["Conor McGregor"])          
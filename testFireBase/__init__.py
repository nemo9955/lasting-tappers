"""
Created on Nov 25, 2015

@author: Mogoi Adrian
"""
import logging
import webapp2
from google.appengine.api import urlfetch
import json
import random
from firebaseWraper import Firebase


def createTiles():
    brd = []
    for i in range( 100 ):
        columns = 4 + i - i  # Math.round(Math.random() * 2) + 5
        tap = random.randrange( columns )

        mp = {}
        mp["size"] = columns
        mp["chosen"] = -1
        mp["column"] = tap
        brd.append( mp )
    return brd


class FirebaseTest( webapp2.RequestHandler ):
    def get( self ):
#         urlfetch.fetch( "https://crackling-fire-8175.firebaseio.com/board.json" )
#         logging.error(r.content)
#         test()
#         fb = firebase.FirebaseApplication( 'https://crackling-fire-8175.firebaseio.com', None )
#         logging.info( fb.get("/board", None ))
#         url1 = "https://crackling-fire-8175.firebaseio.com/ceva.json"
#         url2 = "https://crackling-fire-8175.firebaseio.com/altceva.json"
# #         r = urlfetch.fetch( url=url , payload={"name":"ceva","value":"13247"} , method=urlfetch.POST  ,headers={'Content-Type': 'application/json'} )
#         urlfetch.fetch( url=url1 , payload="15646" , method=urlfetch.POST       ,headers={'Content-Type': 'application/json'} )
#         urlfetch.fetch( url=url2 , payload="15646" , method=urlfetch.PUT       ,headers={'Content-Type': 'application/json'} )
#         urlfetch.fetch( url=url1 , payload="156461dd" , method=urlfetch.POST       ,headers={'Content-Type': 'application/json'} )
#         urlfetch.fetch( url=url2 , payload="156461sdd" , method=urlfetch.PUT       ,headers={'Content-Type': 'application/json'} )
#
#         r = urlfetch.fetch( url=url , payload="qwerty" , method=urlfetch.PUT )
#         r = urlfetch.fetch( url=url , payload="aaaaaaaaaa" , method=urlfetch.PATCH )

#         fb.request( "PUT", "ceva/4n.json", "a4315355" )

#         fb.request( "POST", "ceva", json.dumps( {"user_id" : "jack", "text" : "Ahoy!"} ) )

        logging.info( "\n\n\n***********************" )
        fb = Firebase( "crackling-fire-8175.firebaseio.com" ) 
#         fb.delete("board")
        fb.set( "board", createTiles() )


app = webapp2.WSGIApplication( [
    ( '/testFB', FirebaseTest ),
], debug=True )

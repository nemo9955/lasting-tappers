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
#         logging.info( "\n\n\n***********************" )
        fb = Firebase( "crackling-fire-8175.firebaseio.com" )
#         fb.delete("board")
        fb.set( "board", createTiles() )


app = webapp2.WSGIApplication( [
    ( '/testFB', FirebaseTest ),
], debug=True )

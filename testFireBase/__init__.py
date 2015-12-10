"""
Created on Nov 25, 2015

@author: Mogoi Adrian
"""
import logging
import webapp2
from google.appengine.api import urlfetch
import json
import random
from utils.firebaseWraper import Firebase
from utils import createTiles


class FirebaseTest( webapp2.RequestHandler ):
    def get( self , nr ):
        brdLen = int( nr, 10 )
#         logging.info( "\n\n\n***********************  "+nr  )
        fb = Firebase( "crackling-fire-8175.firebaseio.com" )
#         fb.delete("board")
        fb.set( "board", createTiles( brdLen ) )
        self.redirect( "/" )


app = webapp2.WSGIApplication( [
    ( '/testFB/([^/]+)', FirebaseTest )
], debug=True )

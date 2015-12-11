'''
Created on Dec 10, 2015

@author: Mogoi Adrian
'''

import webapp2
import string, random
from google.appengine.api import users
from utils import getJTemplate
from utils.firebaseWraper import Firebase
from utils import createTiles

URL_LENGTH = 7

class RoomPage( webapp2.RequestHandler ):
    def get( self ):
        user = users.get_current_user()
        print "------------    ROOOMM : ", user.nickname()
        templ = getJTemplate( "RoomPage.html" )
        self.response.write( templ.render() )

    def post( self ):
        mp = {}
        mp["name"] = self.request.get( "name" )
        mp["length"] = int( self.request.get( "length" ), 10 )

        fb = Firebase( "crackling-fire-8175.firebaseio.com" )

        while 1 :
            rID = ''.join( random.SystemRandom().choice( string.ascii_uppercase + string.digits ) for _ in range( URL_LENGTH ) )
            tst = fb.get( "/" + rID )
            if tst != None :
                print "Improbability drive !!!!"
            else :
                break
        #
        #
        #
        #
        #
        #
        # R E M O V E   T H I S
        #!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
        rID = "5M29YJ6"  #!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
        #!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1

        game = "/" + rID + "/game"
        fb.set( game, mp )
        board = "/" + rID + "/board"
        fb.set( board, createTiles( mp["length"] ) )


        templ = getJTemplate( "RoomPage.html" )
        self.response.write( templ.render( id=rID ) )


app = webapp2.WSGIApplication( [
    ( '/', RoomPage ),
], debug=True )

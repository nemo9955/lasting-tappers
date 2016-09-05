'''
Created on Dec 10, 2015

@author: Mogoi Adrian
'''


import webapp2
import string, random, datetime
from google.appengine.api import users
from utils import getJTemplate
from utils.firebaseWraper import Firebase
from utils import createTiles
from google.appengine.ext import ndb


URL_LENGTH = 7


class Test(ndb.Model):
    content = ndb.StringProperty()
    date = ndb.DateTimeProperty(auto_now_add=True)



class RoomPage( webapp2.RequestHandler ):
    def printPage( self , rID=None ):
        templ = getJTemplate( "RoomPage.html" )
        temp_vals = {
               "loggout":users.create_logout_url( '/' ),
                   }
        if rID is not None :
            temp_vals["id"] = rID
        self.response.write( templ.render( temp_vals ) )


    def get( self ):
        # tst = Test()
        # tst.content = "jksdlfhnsdj fhsdj"
        # tstKey = tst.put()
        # print tstKey , "-----------"

        # if users.get_current_user() is None :
        #     self.response.write( users.create_login_url() )
        #     return
        self.printPage()

    def post( self ):
        mp = {}
        mp["name"] = self.request.get( "name" )
        mp["length"] = int( self.request.get( "length" ), 10 )

        mthnr = datetime.datetime.now().month
        fb = Firebase( "crackling-fire-8175.firebaseio.com/" + str( mthnr ) )

        while 1 :
            rid = ''.join( random.SystemRandom().choice( string.ascii_uppercase + string.digits ) for _ in range( URL_LENGTH ) )
            tst = fb.get( "/" + rid )
            if tst == None :
                print "Improbability drive !!!!"
            else :
                break

        #
        # R E M O V E   T H I S
        #!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
#         rid = "4M29YJ2"  #!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
        #!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1


        mp["room"] = rid
        dataa = {"game":mp , "board":createTiles( mp["length"] )}

        fb.set( rid, dataa )

        self.redirect( "/" + rid )
#         self.printPage( rID=rid  )


app = webapp2.WSGIApplication( [
    ( '/', RoomPage ),
], debug=True )

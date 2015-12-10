'''
Created on Dec 10, 2015

@author: Mogoi Adrian
'''

import webapp2
from google.appengine.api import users
from utils import getJTemplate

class RoomPage( webapp2.RequestHandler ):
    def get( self ):
        user = users.get_current_user()
        print "------------    ROOOMM : ",user.nickname()
        templ = getJTemplate("RoomPage.html")
        self.response.write(templ.render())



app = webapp2.WSGIApplication( [
    ( '/', RoomPage ),
], debug=True )

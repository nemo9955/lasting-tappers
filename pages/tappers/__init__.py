'''
Created on Nov 19, 2015

@author: Mogoi Adrian
'''
import os
import webapp2
import logging
from google.appengine.api import users
from utils import  getJTemplate


class TapServer( webapp2.RequestHandler ):
    def get( self , room ):
        user = users.get_current_user()

        temp_vals = {
               "user": "" + user.nickname() ,
               "room": room,
               "loggout":users.create_logout_url( '/' ),
               }
        template = getJTemplate( "GameCanvas.html" )
        self.response.write( template.render( temp_vals ) )



app = webapp2.WSGIApplication( [
    ( '/([^/]+)', TapServer ),
], debug=True )

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
        temp_vals = {
               "loggout":users.create_logout_url( '/' ),
               }
        template = getJTemplate( "GameCanvas.html" )
        
        
        mp={}
        mp["room"] = room
        mp["user"] = users.get_current_user().nickname()
        for i, j in mp.items() :
            self.response.set_cookie( i, str( j ), path=("/" + room) ,max_age=360)
        
        
        
        self.response.write( template.render( temp_vals ) )



app = webapp2.WSGIApplication( [
    ( '/([^/]+)', TapServer ),
], debug=True )

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

        if not user:
            self.redirect( users.create_login_url( self.request.uri ) )
        else :
            url = users.create_logout_url( self.request.uri )
            url_linktext = 'Logout'

            temp_vals = {
                   "user": "" + user.nickname() ,
                   "logg":{"url":url, "text":url_linktext}
                   }
            template = getJTemplate( "GameCanvas.html" )
            self.response.write( template.render( temp_vals ) )



app = webapp2.WSGIApplication( [
    ( '/([^/]+)', TapServer ),
], debug=True )

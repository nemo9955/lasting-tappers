'''
Created on Nov 19, 2015

@author: Mogoi Adrian
'''
import os
import jinja2
import webapp2
from google.appengine.api import users
import logging

JINJA_ENVIRONMENT = jinja2.Environment( 
    loader=jinja2.FileSystemLoader( os.path.join( os.path.dirname( __file__ ), os.pardir ) ),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True )

class TapServer( webapp2.RequestHandler ):
    def get( self ):
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
            template = JINJA_ENVIRONMENT.get_template( "templates/GameCanvas.html" )
            self.response.write( template.render( temp_vals ) )
#             print "-----------"
#             print self.request
#             print "-----------"
    def post( self ):
        logging.debug( 'POST' )

    def put( self ):
        logging.debug( 'PUT' )

    def delete( self ):
        logging.debug( 'DELEE' )


app = webapp2.WSGIApplication( [
    ( '/', TapServer ),
], debug=True )

'''
Created on Dec 18, 2015

@author: Mogoi Adrian
'''

import webapp2, datetime
from utils.firebaseWraper import Firebase


class delete( webapp2.RequestHandler ):
    def get( self ):
        mthnr = datetime.datetime.now().month - 1
        
        if mthnr == 0 :
            gon = 11
        else:
            gon = mthnr 
        
        fb = Firebase( "crackling-fire-8175.firebaseio.com/" )
        fb.delete( str( gon ) )

        self.response.write( "Deleting month: " + str(gon) )





app = webapp2.WSGIApplication( [
    ( '/tasks/deleteMonthly', delete ),
], debug=True )

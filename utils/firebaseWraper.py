'''
Created on Dec 2, 2015

@author: Mogoi Adrian
'''

#!/usr/bin/env python

import json

from google.appengine.api import urlfetch

class Firebase( object ):
    def __init__( self, url , auth=None ):
        super( Firebase, self ).__init__()
        self.url = url
        self.auth = auth

    def request( self, method, node, payload ):
        payload = json.dumps( payload )
        return urlfetch.fetch( ( 'https://%s/%s.json?auth=%s' % ( self.url, node, self.auth ) ) if self.auth else ( 'https://%s/%s.json' % ( self.url, node ) ),
                                payload=payload, method=method )

    def push( self, node, payload ):
        self.request( "POST", node, payload )

    def set( self, node, payload ):
        self.request( "PUT", node, payload )

    def get( self, node ):
        return self.request( "GET", node, None ).content

    def getAll( self, node ):
        return self.request( "GET", node, None )

    def delete( self, node ):
        self.request( "DELETE", node, None )

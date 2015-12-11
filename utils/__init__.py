'''
Created on Dec 10, 2015

@author: Mogoi Adrian
'''
import os
import random
import jinja2

_templates = "/templates/"

Jinja = jinja2.Environment( 
    loader=jinja2.FileSystemLoader( os.path.join( os.path.dirname( __file__ ), os.pardir ) ),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True )

def getJTemplate( page ):

    return Jinja.get_template( _templates + page )


def createTiles( ln ):
    brd = []
    if ln == "" : ln = 50
    for i in range( int( ln ) ):
        columns = 4 + i - i  # Math.round(Math.random() * 2) + 5
        tap = random.randrange( columns )

        mp = {}
        mp["size"] = columns
        mp["chosen"] = -1
        mp["column"] = tap
        brd.append( mp )
    return brd

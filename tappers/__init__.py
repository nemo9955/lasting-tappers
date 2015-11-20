'''
Created on Nov 19, 2015

@author: Mogoi Adrian
'''
import os
import jinja2
import webapp2


JINJA_ENVIRONMENT = jinja2.Environment( 
    loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), os.pardir)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True )



class TapServer(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template("templates/Index.html")
        self.response.write(template.render())
        
        
app = webapp2.WSGIApplication([
    ('/', TapServer),
], debug=True)
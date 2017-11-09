#!/usr/bin/python

from fs import app
import logging, sys
#import site
#site.addsitedir("/homed/smishra8/.local/lib/python2.7/site-packages")

from wsgiref.handlers import CGIHandler
logging.basicConfig(stream=sys.stderr)
#logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)
import config
app.config.from_object("config")
CGIHandler().run(app)

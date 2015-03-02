from fs import app
from flask import render_template
from flask import request

PLACE_URLS = {\
"URBANA-CHAMPAIGN": "yelp_business_urbana_champaign_il.json",\
"PITTSBURG": "yelp_business_pittsburgh_pa.json",\
"LAS-VEGAS": "yelp_business_lasvegas_nv.json" }

@app.route('/')
@app.route('/<place>')
def index(place="URBANA-CHAMPAIGN"):
    place_url = PLACE_URLS[place]
    return render_template('index.html',\
    place_url=place_url, place=place)
@app.route('/test')
@app.route('/test/<place>')
def test(place="URBANA-CHAMPAIGN"):
    place_url = PLACE_URLS[place]
    return render_template('test.html',\
    place_url=place_url)
@app.route('/share')
def share():
    return render_template('share.html')
@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/about')
def about():
   return render_template('about.html')

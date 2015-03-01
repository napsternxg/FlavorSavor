from fs import app
from flask import render_template

@app.route('/')
def index():
	return render_template('index.html')
@app.route('/share')
def share():
	return render_template('share.html')
@app.route('/login')
def login():
	return render_template('login.html')

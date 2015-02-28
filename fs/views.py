from fs import app

@app.route('/')
def index():
	return 'Hello World!'

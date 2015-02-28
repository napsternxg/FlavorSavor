#!/home/azureuser/Code/HackIllinois/bin/python
from fs import app
import config
app.run(host=config.HOSTNAME,port=config.PORT,debug=True)

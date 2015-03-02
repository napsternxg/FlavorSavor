#!/home/azureuser/Code/HackIllinois/bin/python
from fs import app
import config
app.config["PORC_API_KEY"] = config.PORC_API_KEY
app.run(host=config.HOSTNAME,port=config.PORT,debug=True)

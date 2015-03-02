from porc import Client
from fs import app

client = Client(app.config["PORC_API_KEY"])

def add_review(bid="aba",name,city,review=""):
    if review == "":
        return "EMPTY"
    response = client.get("reviews", bid)
    print response
    return response

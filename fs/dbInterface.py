from porc import Client
from porc import Patch
from fs import app

def add_review(API_KEY,bid="aba",name="",city="",state="",review=""):
    client = Client(API_KEY)
    if review == "":
        return "EMPTY"
    response = client.get("reviews", bid)
    print response.json
    try:
        response.raise_for_status()
    except:
        print "Key not available. Creating new entry"
        response = client.put("reviews",bid,\
                {"name": name, "city": city, "state": state, "reviews": []})
    patch = Patch()
    patch.add("/reviews/-", review)
    response = client.patch("reviews",bid, patch)
    return response.json

__author__ = 'Xiaodan'
# Date created: 11/15/2014

import json

class Business(object):

    def __init__(self):

        self.business = {}

    def add_business(self, business_id, business_name,
                        full_address, categories, stars):

        if business_id in self.business:
            print "business_id EXISTED"
            return False

        self.business[business_id] = {
                                        'business_id': business_id,
                                        'business_name': business_name,
                                        'full_address': full_address,
                                        'business_stars': stars,
                                        'categories': categories,
                                        'reviews': {},
                                        'tips': {},
                                    }
        return True

    def add_reviews(self, business_id, user_id, review_id, text,
                    stars, date):

        ## We only care about reviews that associate with restaurants
        ## existed in the dataset
        if business_id in self.business:
            reviews = self.business[business_id]['reviews']
            reviews[review_id] = {
                                    'review_id': review_id,
                                    'user_id': user_id,
                                    'review_text': text,
                                    'review_stars': stars,
                                    'review_date': date,
                                 }

    def add_tips(self, business_id, user_id, text, date):

        ## We only care about reviews that associate with restaurants
        ## existed in the dataset
        if business_id in self.business:
            tips = self.business[business_id]['tips']
            tips[user_id] = {
                                'user_id': user_id,
                                'tip_text': text,
                                'tip_date': date,
                            }





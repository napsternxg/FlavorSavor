#!/usr/bin/python

__author__ = 'Xiaodan'
# Date created: 11/15/2014

import json
import logging

from business import Business

LOG_LEVEL = logging.INFO
logging.basicConfig( level=LOG_LEVEL, format='%(levelname)s %(message)s' )

gLogger = logging.getLogger('yelpbusiness')

INPUT_FILE_NAME1 = "yelp_academic_dataset_business.json"
INPUT_FILE_NAME2 = "yelp_academic_dataset_review.json"
INPUT_FILE_NAME3 = "yelp_academic_dataset_tip.json"

## Testing data
# INPUT_FILE_NAME1 = "business_sample.json"
# INPUT_FILE_NAME2 = "review_sample.json"
# INPUT_FILE_NAME3 = "tip_sample.json"

class BusinessReviews(Business):

    def __init__(self, business_file_name=INPUT_FILE_NAME1,
                        review_file_name=INPUT_FILE_NAME2,
                        tip_file_name=INPUT_FILE_NAME3):

        super(BusinessReviews, self).__init__()
        self.business_file_name = business_file_name
        self.review_file_name = review_file_name
        self.tip_file_name = tip_file_name

    def load_data(self):
        self.read_business()
        self.read_reviews()
        self.read_tips()

    '''
    This method reads businesses data.
    [u'city', u'review_count', u'name', u'neighborhoods', u'type', 
    u'business_id', u'full_address', u'hours', u'state', u'longitude', 
    u'stars', u'latitude', u'attributes', u'open', u'categories']
    '''
    def read_business(self):

        gLogger.info( "Reading business items ..." )
        with open(self.business_file_name, 'r') as in_file:
            for line in in_file:
                line_contents = json.loads(line)
                business_id = line_contents['business_id']
                business_name = line_contents['name'] 
                full_address = line_contents['full_address']
                categories = line_contents['categories']
                stars = line_contents['stars']

                ## We only need businesses that have "Restaurants" category.
                # if "Chinese" in categories:
                if "Dry Cleaning & Laundry" in categories or \
                    "Automotive" in categories:
                    self.add_business(business_id, business_name, 
                                full_address, categories, stars)
                #if "Japanese" in categories:
                
                #if "Dry Cleaning & Laundry" in categories or \
                #    "Automotive" in categories or "Beauty & Spas" in categories or \
                #    "Pets" in categories:
                    
                
    '''
    This method reads reviews data for each business.
    [u'votes', u'user_id', u'review_id', u'text', u'business_id', 
    u'stars', u'date', u'type']
    '''
    def read_reviews(self):
        gLogger.info( "Reading review items ..." )
        with open(self.review_file_name, 'r') as in_file:
            for line in in_file:
                line_contents = json.loads(line)
                business_id = line_contents['business_id']
                user_id = line_contents['user_id']
                review_id = line_contents['review_id']
                text = line_contents['text']
                stars = line_contents['stars']
                date = line_contents['date']

                self.add_reviews(business_id, user_id, review_id,
                                text, stars, date)

    '''
    This method reads tips data for each business.
    [u'user_id', u'text', u'business_id', u'likes', u'date', u'type']
    '''
    def read_tips(self):
        gLogger.info( "Reading tip items ..." )
        with open(self.tip_file_name, 'r') as in_file:
            for line in in_file:
                line_contents = json.loads(line)
                business_id = line_contents['business_id']
                user_id = line_contents['user_id']
                text = line_contents['text']
                date = line_contents['date']

                self.add_tips(business_id, user_id, text, date)

    '''
    This method writes out a file in JSON format.
    '''
    def writeAsJSONFormat(self, json_outfile_name):
        result = []
        for business_id, business_data in self.business.iteritems():
            if len(business_data['reviews']) > 0:
                result.append(business_data)
            else:
                print "NO reviews EXISTED"

        print len(result) # 14257

        # Write out the JSON data to a .json file.
        gLogger.info( "Writing '%s'..." % json_outfile_name )
        
        with open(json_outfile_name, 'w') as outfile:
            json.dump( result, outfile, indent=2 )
            
        return

if __name__ == '__main__':
    bs = BusinessReviews()
    bs.load_data()
    """
    grep "\"Restaurants\"" yelp_academic_dataset_business.json | wc -l => 14303
    """
    print len(bs.business) # 14303
    bs.writeAsJSONFormat('data/yelp_ref_business_reviews.json')
    # bs.writeAsJSONFormat('yelp_Chinese_business_reviews.json')



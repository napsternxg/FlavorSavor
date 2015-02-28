#!/usr/bin/python

__author__ = 'Xiaodan'
# Date created: 2/28/2015

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
        #self.read_tips()

    '''
    This method reads businesses data.
    [u'city', u'review_count', u'name', u'neighborhoods', u'type',
    u'business_id', u'full_address', u'hours', u'state', u'longitude',
    u'stars', u'latitude', u'attributes', u'open', u'categories']
    '''
    def read_business(self):

        gLogger.info( "Reading business items ..." )
        with open(self.business_file_name, 'r') as in_file:
            count  = 0
            for line in in_file:
                line_contents = json.loads(line)
                business_id = line_contents['business_id']
                state = line_contents['state']
                city = line_contents['city']
                categories = line_contents['categories']
                restaurant_bool = ("Restaurants" in categories)
                state_bool = (state == "IL")
                city_bool = (city in ["Urbana", "Champaign"])

                ## We only need businesses that have "Restaurants" category.
                if restaurant_bool and state_bool and city_bool:
                    # line_contents is business_info
                    self.add_business(business_id, line_contents)

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
                text = line_contents['text']
                stars = line_contents['stars']
                useful_votes = line_contents['votes']['useful']

                self.add_reviews(business_id, text, stars, useful_votes)

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
                text = line_contents['text']
                likes = line_contents['likes']

                self.add_tips(business_id, text, likes)

    '''
    This method writes out a file in JSON format.
    '''
    def writeAsJSONFormat(self, json_outfile_name, middle_file = False):
        result = []
        for business_id, business_info in self.business.iteritems():
            if middle_file or len(business_info['reviews']) > 0:
                result.append(business_info)
            else:
                print "NO reviews EXISTED"

        print len(result)

        # Write out the JSON data to a .json file.
        gLogger.info( "Writing '%s'..." % json_outfile_name )

        with open(json_outfile_name, 'w') as outfile:
            json.dump( result, outfile, indent=2 )

        return




if __name__ == '__main__':
    bs = BusinessReviews()

    bs.load_data()
    """
    grep "\"Restaurants\"" yelp_academic_dataset_business.json | wc -l => 21892
    """
    # print len(bs.business) # 21892 total number of restaurants

    bs.writeAsJSONFormat('yelp_business_urbana_champaign_il.json', True)



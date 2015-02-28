__author__ = 'Xiaodan'
# Date created: 2/28/2015

import json
import string
import re
from nltk.corpus import stopwords
from nltk.stem.porter import *
from collections import Counter

class Business(object):

    def __init__(self):

        self.business = {}

    def add_business(self, business_id, business_info):

        if business_id in self.business:
            print "business_id EXISTED"
            return False

        if 'flavor_sharer' not in business_info:
            business_info['flavor_sharer'] = {}
            fs = business_info['flavor_sharer']
            fs['aggregate'] = {'reviews': 0, 'useful_votes': 0, \
                                'tips': 0, 'likes': 0, 'stars': 0, \
                                'count': 0}
            fs['flavors'] = { 'sour': {}, 'sweet': {}, 'bitter': {}, \
                            'salty': {}, 'spicy': {} }
            flavors = fs['flavors']

            for each_flavor in flavors:
                flavor_value = flavors[each_flavor]

                # The following are all counts
                flavor_value['reviews'] = 0
                flavor_value['useful_votes'] = 0
                flavor_value['stars'] = 0
                flavor_value['tips'] = 0
                flavor_value['likes'] = 0
                flavor_value['count'] = 0

        self.business[business_id] = business_info
        return True

    def add_reviews(self, business_id, text, stars, useful_votes):

        ## We only care about reviews that associate with restaurants
        ## existed in the dataset
        if business_id in self.business:
            text = self.clean_reviews(text)

            aggregate = self.business[business_id]['flavor_sharer']['aggregate']
            aggregate['reviews'] += 1
            aggregate['stars'] += stars
            aggregate['useful_votes'] += useful_votes

            # The dictionary for all 5 tastes
            flavors = self.business[business_id]['flavor_sharer']['flavors']

            words = text.split(' ')
            stemmer = PorterStemmer() # salty to salti, spicy to spici
            #for i in range(len(words)):
            #    words[i] = stemmer.stem(words[i])
            words = map(stemmer.stem, words)
            freqs = dict(Counter(words))
            # five_flavors = ['sweet', 'salti', 'bitter', 'sour', 'spici']

            # if any(x in five_flavors for x in freqs):

            if 'sweet' in freqs:
                flavors['sweet']['reviews'] += 1
                flavors['sweet']['useful_votes'] += useful_votes
                flavors['sweet']['stars'] += stars
                flavors['sweet']['count'] += freqs['sweet']
                aggregate['count'] += freqs['sweet']

            elif 'salti' in freqs:
                flavors['salty']['reviews'] += 1
                flavors['salty']['useful_votes'] += useful_votes
                flavors['salty']['stars'] += stars
                flavors['salty']['count'] += freqs['salti']
                aggregate['count'] += freqs['salti']

            elif 'bitter' in freqs:
                flavors['bitter']['reviews'] += 1
                flavors['bitter']['useful_votes'] += useful_votes
                flavors['bitter']['stars'] += stars
                flavors['bitter']['count'] += freqs['bitter']
                aggregate['count'] += freqs['bitter']

            elif 'sour' in freqs:
                flavors['sour']['reviews'] += 1
                flavors['sour']['useful_votes'] += useful_votes
                flavors['sour']['stars'] += stars
                flavors['sour']['count'] += freqs['sour']
                aggregate['count'] += freqs['sour']

            elif 'spici' in freqs:
                flavors['spicy']['reviews'] += 1
                flavors['spicy']['useful_votes'] += useful_votes
                flavors['spicy']['stars'] += stars
                flavors['spicy']['count'] += freqs['spici']
                aggregate['count'] += freqs['spici']


    def add_tips(self, business_id, text, likes):

        ## We only care about reviews that associate with restaurants
        ## existed in the dataset
        if business_id in self.business:
            aggregate = self.business[business_id]['flavor_sharer']['aggregate']
            aggregate['tips'] += 1
            aggregate['likes'] += likes

        # The dictionary for all 5 tastes
            flavors = self.business[business_id]['flavor_sharer']['flavors']

            words = text.split(' ')
            stemmer = PorterStemmer() # salty to salti, spicy to spici
            #for i in range(len(words)):
            #    words[i] = stemmer.stem(words[i])
            words = map(stemmer.stem, words)
            freqs = dict(Counter(words))

            if 'sweet' in freqs:
                flavors['sweet']['tips'] += 1
                flavors['sweet']['likes'] += likes
                flavors['sweet']['count'] += freqs['sweet']
                aggregate['count'] += freqs['sweet']

            elif 'salti' in freqs:
                flavors['salty']['tips'] += 1
                flavors['salty']['likes'] += likes
                flavors['salty']['count'] += freqs['salti']
                aggregate['count'] += freqs['salti']

            elif 'bitter' in freqs:
                flavors['bitter']['tips'] += 1
                flavors['bitter']['likes'] += likes
                flavors['bitter']['count'] += freqs['bitter']
                aggregate['count'] += freqs['bitter']

            elif 'sour' in freqs:
                flavors['sour']['tips'] += 1
                flavors['sour']['likes'] += likes
                flavors['sour']['count'] += freqs['sour']
                aggregate['count'] += freqs['sour']

            elif 'spici' in freqs:
                flavors['spicy']['tips'] += 1
                flavors['spicy']['likes'] += likes
                flavors['spicy']['count'] += freqs['spici']
                aggregate['count'] += freqs['spici']


    def clean_reviews(self, text):
        text = text.lower()
        # get rid of '\n'
        text = re.sub(r"\r|\n|\t|\-|\:|\%|\&|\$|\.|\*|\#|\@|\;|\,|\[|\]|\!|\?|\;|\~|\(|\)|\'|\"|\/", " ", text)

        # multiple spaces to one space
        text = ' '.join(text.split())

        # remove punctuation
        exclude = set(string.punctuation)
        #text = re.sub('[%s]' % '|'.join(exclude), " ", text)
        text = ''.join(ch for ch in text if ch not in exclude)

        # remove stopwords
        word_list = text.split(" ")
        filtered_words = [w for w in word_list if not w in stopwords.words('english')]
        result = ' '.join(filtered_words)
        return result





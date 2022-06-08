import pandas as pd


#data = pd.read_csv('https://docs.google.com/spreadsheets/d/e/2PACX-1vR6_3MIt4pjFCQs9pdpp_0hkm0BpeyDwGDnxX5jlhEwirA4bleTauoMk-zpccqbqzQFdjZMco4airRU/pub?gid=1864261806&single=true&output=csv')
#data.to_csv('data.csv', index = False)

data = pd.read_csv('https://docs.google.com/spreadsheets/d/e/2PACX-1vR6_3MIt4pjFCQs9pdpp_0hkm0BpeyDwGDnxX5jlhEwirA4bleTauoMk-zpccqbqzQFdjZMco4airRU/pub?gid=872449975&single=true&output=csv')

data = data.drop_duplicates('unit')
data = data[data['unit'] != "ffff"]
data.to_csv('data/map.csv', index = False)
import requests
import pandas as pd
from tqdm import tqdm


data = pd.read_csv('map.csv')
# Отримати координати за адресою
lat_one = []
lon_one = []

#city = data['city']
region = data['region']
unit = data['unit']
ua_f = data['ua_f']
ua_s = data['ua_s']
crimes = data['crimes']
location = data['location']
city = data['city']

for i in tqdm(range (0, len(region))):
    request = requests.get("https://nominatim.openstreetmap.org/?addressdetails=1&q=" + str(city[i]) + "," + str(region[i]) + ",russia&format=json&limit=1").json()
    try:
        try:
            lat_one.append(request[0]["lat"])
        except:
            lat_one.append("null")
        try:
            lon_one.append(request[0]["lon"])
        except:
            lon_one.append("null")
    except:
        pass
    
packages_df =  pd.DataFrame({"ru_s" : lat_one,
                             "ru_f" : lon_one,
                             "ua_f" : ua_f,
                             "ua_s" : ua_s,                            
                             "region" : region,
                             "unit" : unit,
                             "city" :city,
                             "location" : location,
                             "crimes" : crimes
                            })
packages_df.to_csv('map.csv', index = False)
import pandas as pd


data = pd.read_csv('https://docs.google.com/spreadsheets/d/e/2PACX-1vR6_3MIt4pjFCQs9pdpp_0hkm0BpeyDwGDnxX5jlhEwirA4bleTauoMk-zpccqbqzQFdjZMco4airRU/pub?gid=872449975&single=true&output=csv')

data['crimes'] = data['crimes'].fillna('False')

unit = pd.pivot_table(data[['unit',"unit_en", 'division', 'army', 'district', "crimes", "mil_part", "region", "city", 'uhit_short']]
                      , index = ['unit', "unit_en", 'division', 'army', 'district', "crimes", "mil_part", "region", "city", 'uhit_short']
                      , aggfunc = "count")
unit.reset_index(inplace = True)
unit = unit[unit['unit'] != 'ні']
unit['id'] = unit['district'] + '.' + unit['army'] + '.' + unit['division'] + '.' +unit['unit']

division = unit.copy()
del division['id']
del division['unit']
division['id'] = division['district'] + '.' + division['army'] + '.' + division['division']
#del division['main']
#del division['district']
del division['army']
del division['division']

army = unit.copy()
del army['id']
del army['unit']
army['id'] = army['district'] + '.' + army['army']
#del army['main']
#del army['district']
del army['army']
del army['division']

district = unit.copy()
del district['id']
del district['unit']
del district['army']
#district['id'] = district['main'] + '.' + district['district']
#del district['main']
#del district['district']
del district['division']
district['id'] = district['district']

#del unit['main']
#del unit['district']
#del unit['army']
#del unit['division']
#del unit['unit']

final = pd.DataFrame()
final = final.append(unit)
final = final.append(division)
final = final.append(army)
final = final.append(district)
#final = final.append(main)
final = final.sort_values('id')
final = final[~final['id'].isna()]

final["id"] = final["id"].str.replace(r"\.ffff", "")
final = final.drop_duplicates('id')

final.to_csv('data/data.csv', index = False)
import pandas as pd
import csv
import numpy as np
import itertools
import json

file = "data/netflix.csv"

def genreData(f):
    df = pd.read_csv(f)
    df = df[['show_id', 'listed_in']]
    df['listed_in'] = df['listed_in'].str.split(pat=",")
    genreSet = {}
    columns = []

    for index, row in df.iterrows():
        for genre in row['listed_in']:
            g = genre.strip()
            if g in genreSet:
                genreSet[g] += 1
            else:
                genreSet[g] = 1

    return genreSet

def runtimeData(f):
    df = pd.read_csv(f)
    is_movie = df['type'] == 'Movie'
    df = df[is_movie]
    df = df[['show_id', 'release_year', 'duration', 'type']]
    df['duration'] = df['duration'].str.rstrip(' min')
    df['duration']= df['duration'].astype('int64')

    df = df.groupby(['release_year'])['duration'].mean()

    return df

def actorData(f):
    df = pd.read_csv(f)
    after_2015 = df['release_year'] == 2020
    df = df[after_2015]
    df = df['cast']
    df = df.str.split(pat=", ")
    df = df.explode()
    df = df.unique()
    df = pd.DataFrame(df)
    df = df.reset_index()
    df.columns = ['id', 'name']
    df = pd.DataFrame(df)
    return df

def linkData(f):
    df = pd.read_csv(f)
    after_2015 = df['release_year'] == 2020
    df = df[after_2015]
    df = df['cast']
    df = df.str.split(pat=", ")
    more_than_one = df.str.len() > 1
    df = df[more_than_one]
    df = df.map(lambda x: list(itertools.combinations(x, 2)))
    df = df.explode()
    df = df.drop_duplicates()
    df = df.reset_index()
    df = pd.DataFrame(df)
    #df = df['cast'].str.split(pat=", ")
    #df[['source, target']] = pd.DataFrame(df['cast'].tolist(), index = df.index)
    actors = actorData(f)
    dict = {}
    for index, row in actors.iterrows():
        id = row['id']
        name = row['name']
        dict[name] = id

    source = []
    target = []
    sourceid = []
    targetid = []
    for v in df['cast']:
        s = v[0]
        t = v[1]
        si = dict.get(s)
        ti = dict.get(t)
        sourceid.append(si)
        targetid.append(ti)
        source.append(v[0])
        target.append(v[1])

    df['sourcename'] = source
    df['targetname'] = target
    df['source'] = sourceid
    df['target'] = targetid
    df = df[['sourcename', 'targetname']]
    return df

def writeToCSVGenre(file, dict):
    with open(file, 'w') as f:
        f.write("%s,%s\n"%("genre", "count"))
        for key in dict.keys():
            f.write("%s,%s\n"%(key, dict[key]))

def writeToCSV(file, df, ind):
    df.to_csv(r"{}".format(file), index = ind, header = True)

def writeToJSON(f, df):
    j = df.to_json(orient = 'records')
    with open(f, 'w') as outfile:
        json.dump(j, outfile)

## genre
# genreSet = genreData(file)
# writeToCSVGenre("data/genres.csv", genreSet)

## durations
#durations = runtimeData(file)
#writeToCSV("data/durations.csv", durations, True)

## actors
# actors = actorData(file)
# writeToJSON("data/actors.json", actors)
#writeToCSV("data/actors.csv", actors, True)

# links
links = linkData(file)
# writeToJSON("data/links.json", links)
writeToCSV("data/links.csv", links, False)

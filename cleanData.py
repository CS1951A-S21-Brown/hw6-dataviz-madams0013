import pandas as pd
import csv

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
    df = df.groupby(['release_year'])['duration'].apply(','.join)

    return df

def actorData(f):
    df = pd.read_csv(f)
    df = df[['cast', 'title']]
    actors = df['cast'].explode().unique().flatten()
    print(actors[0])

# def writeToCSV(file, dict):
#     with open(file, 'w') as f:
#         f.write("%s,%s\n"%("genre", "count"))
#         for key in dict.keys():
#             f.write("%s,%s\n"%(key, dict[key]))

def writeToCSV(file, df, ind):
    df.to_csv(r"{}".format(file), index = ind, header = True)

## genre
# genreSet = genreData(file)
# writeToCSV("data/genres.csv", genreSet)

## durations
# durations = runtimeData(file)
# writeToCSV("data/durations.csv", durations, True)

# actors
actorData(file)

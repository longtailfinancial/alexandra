#! /usr/bin/python3 

import pandas as pd
import json
import argparse
import os
import csv

class JSON_To_CSV:

    def __init__(self:object): # Constructor
        # Put here the variables
        # that are shared between methods.
        pass


    def file_verification(self: object, jstring: str):

        # Test if passed string ends with .json/.JSON
        if(not (jstring[-5:] == ".json" or jstring[-5:] == ".JSON")): return 0
            
        # Check that file is not empty.
        if(os.stat(jstring).st_size == 0):
            print("File is empty.")
            return 0
        else:
            return 1

    def convert(self: object, json_in):

        if(not (self.file_verification(json_in)) ):
            print("File not valid.")
        else:
            print("File valid. Proceeding with conversion..")

        with open(json_in) as data_file:
            data = data_file.read()
            #print(type(data)) # It's a str at this point
            data_content = json.loads(data) # Becomes a dict
            #print(type(data_content["log"])) It's type 'list'

        # Six nested for-loops. Bless me Father for I have sinned.
        # It's a very nested data structure! I got no choice.

        csv_data = [
            ["Time", "Username", "UserID", "Voice Channel"]
        ]

        for timelog in data_content["log"]:
            # If you're iterating through this loop,
            # each timelog is a dict class.

            for timestamp in timelog:

                #has_a_member = False
                voice_channel_list = timelog[timestamp] # The value of timelog is a list.
                #print(voice_channel_list)

                # Scanning the list, one channel at that particular time.
                for channel_name_dict in voice_channel_list:
                    for channel_name_actual in channel_name_dict:
                        if channel_name_dict[channel_name_actual]:
                            # If channel has member,
                            for member in channel_name_dict[channel_name_actual]:
                                for name in member:
                                    id = member[name]
                                    print(timestamp +  " " + name + " " + id + " " + channel_name_actual)
                                    csv_data.append([timestamp, name, id, channel_name_actual])


        csv_name =  json_in[:-5] + '.csv'

        with open(csv_name, 'w') as file:
            writer = csv.writer(file)
            writer.writerows(csv_data)



def main():

    print("JSON to CSV Converter activated.")

    parser = argparse.ArgumentParser()
    parser.add_argument(
        "file_name",
        help="Input a JSON to convert.")

    user_input = parser.parse_args()

    jtc_inst = JSON_To_CSV()

    jtc_inst.convert(user_input.file_name)

    print("Done.")

if __name__ == "__main__":
    main()
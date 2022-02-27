#! /usr/bin/bash
# This script is meant to be used by the SystemD Unit

# cd [ABSOLUTE_DIRECTORY_OF_PROJECT_ROOT]
echo "Calling bot.js"
node src/bot.js &


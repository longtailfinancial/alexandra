#! /usr/bin/bash
# This script is meant for the SystemD Unit
# cd [ABSOLUTE_DIRECTORY_OF_PROJECT_ROOT]
cd /root/alexandra
echo "Calling bot.js"
node src/bot.js &

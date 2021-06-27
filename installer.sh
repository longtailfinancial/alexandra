#! /bin/bash




#------------------=| Dev notes |------------------#


# TO DO: 

# First determine what distro the user has, fortunately
# we already have this code from a previous project

# Alexandra currently needs ripgrep, python3, nodejs, and npm

# Post installation checks:
  
# The .env file in the src directory, 
#   Remind user of the required bottoken
#  
# The admin_list.txt for the planned admin only commands.
# 
# Run npm test after everything
#
#

#---------------=| End of Dev notes |=-------------#




function distr_determine () {

    # Detects whether user has Manjaro or Ubuntu
    # The ubuntu check has additional lsb_release parameters
    # to shut the "No LSB modules" warning the hell up.

    if( lsb_release -ar 2>/dev/null | grep --silent 'Ubuntu\|Mint' > /dev/null);
    then
        return 1
    elif (lsb_release -a | grep --silent  'Manjaro\|Arch' > /dev/null);
    then
        return 2
    else 
        return 0
    fi


}




function install () {
    # Parameters: (debian or arch)

    # A switch statement. Inside each case there is an if statement
    # to have separate installation commands for ubuntu and manjaro

    true #no-op

}





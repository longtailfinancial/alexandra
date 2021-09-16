#! /usr/bin/python3


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

def distro_unrecognized():

    # A custom error message if the distro
    # remains unrecognized during installations.
    print("Error: Distro unrecognized.")
    print("Please install everything manually.")


def distr_determine():

    # Detects whether user has Manjaro or Ubuntu
    # The ubuntu check has additional lsb_release parameters
    # to shut the "No LSB modules" warning the hell up.
    '''
    if( lsb_release -ar 2>/dev/null | grep --silent 'Ubuntu\|Mint\|Pop' > /dev/null);
    then
        return 1
    elif (lsb_release -a | grep --silent  'Manjaro\|Arch' > /dev/null);
    then
        return 2
    else 
        return 0
    fi
    '''
    pass


def check_dist():

    # dr=$(distr_determine) # dr stands for distro result.
    '''
    if [ "${dr}" == 1 ]     #If Ubuntu, this would be the command
    then
        print("Yooo")
        #sudo apt install git
    elif [ "${dr}" == 2 ]
    then
        print("Faggot!")
        #pacman -S git      #If Manj/Arch, this would be the command
    else
        distro_unrecognized "$1"
    fi
    '''


def install():
    # Parameters: (debian or arch)

    # A switch statement. Inside each case there is an if statement
    # to have separate installation commands for ubuntu and manjaro

    pass


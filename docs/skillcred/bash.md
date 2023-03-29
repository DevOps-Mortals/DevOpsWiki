# Bash

Credit: [Bash for Beginners](https://www.youtube.com/watch?v=nrfwcbYJZfc) videos by Microsoft.

## Navigating inside files

```bash
h -> help for navigating
j -> move down
k -> move up
d -> page down
u -> page up
```

## Finding & Listing

### `ls`

List files and folders in a particular directory

```bash
# Variations of ls command
ls -a # List all files including hidden
ls -l # List files in a vertical order
ls [cs]* # List all files with c and s with any ending. Case senstive
ls *.md # List all files with .md file extension
ls *.?? # List all files with a two character extension
ls *.??? # List all files with a three character extension
ls [[:upper:]]* # List all files with uppercase names with any ending
ls [[:lower:]]* # List all files with lowercase names with any ending
```

### `find`

Find files and folders using various combinations

```bash
# find <directory> <parameter> <argument>
find . -type f # finds files inside current directory

find /home -type d # Finds directories inside home directory

find . -name file.txt # Finds a file named file.txt in current directory

find /home -iname file.txt # Finds files regardless of case

find . -name "*.md" # Finds all files with .md extension in current folder
```

### `which`

Find which particular executable is being used a binary or application

```bash
which bash
```

### `whereis`

Find location of a binary and its manual

```bash
whereis bash

# Find location of only binary, without the manual
whereis -b bash
```

## Navigating

### `cd`

Navigate within a directory structure

```bash
cd <directory>
cd .. # Go to the previous directory
cd ../.. # Go back two previous directories
```

### `pushd`

Creates a stack of directories visited. Last one is the latest.

```bash
pushd <directory1>
pushd <directory2/directory3>
# Output
0 directory1
1 directory2/directory3
```

### `popd`

Reverse of pushd. Removes the last visited directory from the stack. Last in First Out.

```bash
popd
```

## Creating

### `mkdir`

Make new directories

```bash
mkdir example

# Make sub-directories inside directories even if they don't exist yet.
mkdir example/sub1/sub2 # This gives an ERROR because sub1 does not exist

mkdir -p example/sub1/sub2 # Makes the necessary parent directories
```

## Viewing Inside Files

## `cat`

Short for concatenation. View content of files inside the terminal.

```bash
cat file.txt

cat file1.txt file2.txt # Shows content of both files
```

## `head`

Get the first 10 lines of a file. Default value is 10.

```bash
head fake1.log # Shows first 10 lines
head -n 3 fake1.log # Shows the first 3 lines
```

## `tail`

Get the last 10 lines of a file. Default value is 10.

```bash
tail fake1.log # Shows last 10 lines
tail -n 3 fake1.log # Shows last 3 lines
```

## `more`

Browse through the entire content of a file divided by how much information can fit in the viewport. Use spacebar to go further down

```bash
more fake1.log
```

## `less`

Browsing through a file like a man page, which is interactive and allows further commands like searching.

```bash
less fake1.log
```

## `grep`

The almighty search tool.

```bash
# Syntax
grep <agrument> <file>

# Example
grep "172.212.53.74" fake1.log
```

# Environment Variables

### `env`

View environment variables

```bash
env # Displays all environment variables

echo $SHELL # Displays the current shell

echo $HOME # Displays the home directory of current user

echo $USER # Displays the current user

echo $PATH # Displays path to executables
```

### `export`

Create environment variables

```bash
export newVar=value
echo $newVar # Outputs value
```

> Note: These variables are only available in the current session. For variables to persist, they need to be added to either profile or bashrc.

# Redirection and Pipelines

## stdout → redirecting standard output

### `>`

Redirect the output to a file or a command.

```bash
ls -a > output.txt # Creates a new file called output.txt and adds output of ls -l

echo "I am trial" > output.txt # Replaces the content of output.txt with new content
```

### `>>`

Appends any content or output to existing content without replacing it.

```bash
echo "I am second line" >> output.txt # Adds this line after the previous line
```

## stderr → redirecting standard errors

### `2>`

File descriptor that denotes this is a standard error.

```bash
ls -l ./dir # This directory does not exist so bash will output error.
ls: cannot access './dir': No such file or directory # The error
ls -l ./dir 2> error.txt # Outputs only the error to the error.txt file
```

> If you perform this operation with only the stdout redirector, your file will be empty.

```bash
ls -l ./dir > error.txt # The file will not be created. This will only output to console.
```

### `stdout` and `stderr` in the same file

Redirecting the output and errors in the same file.

```bash
ls -l ./dir > error.txt 2>&1 # Tells bash to output both streams to the error.txt file (replaces)
ls -l ./dir >> error.txt 2>&1 # Appends the content instead of replacing it

ls -l ./dir &> error.txt # Newer syntax to achieve the same result
```

### `stdin`

Redirecting standard input and redirect to some file.

```bash
cat part1.txt part2.txt > paragraph.txt # Redirects input content of both files and adds to the new file.
```

### `|`

The pipe symbol is used to redirect the output of one command to another command for added functionality.

```bash
ls -l /usr/bin | less # Displays the contents of /usr/bin directory using the less methods

ls -l /usr/bin | grep echo
ls -l /usr/bin | grep echo | sort # Chaining pipe commands

cat -l part1.txt | head -n 1 # Displays only the first line using pipe. 
```

# Permissions

Changing file and folder permissions. Without having ownership, a user cannot modify permissions of a file.

### `chown`

Change owner of a file or folder

```bash
# Example of assigning another user owner of a file
chown user1 file1.txt # user1 is the new owner of the file
sudo chown root file1.txt # root is the new owner of the file

# Assigning ownership to a group
chown :group1 file1.txt # User group group1 becomes the new owner
sudo chown :root file1.txt # Group root is the new owner 
```

### `chgrp`

Another command to change the group of a file or folder.

```bash
chgrp group1 file1.txt
```

### `chmod`

Change permissions of a file or folder

```bash
# Using letters
chmod +x file1.txt # All users get execute permission

# Using Octal
chmod 700 file1.txt # Users get all permissions, groups and others none.

owner  group  others
r w x  r w x  r w x
4 2 1  4 2 1  4 2 1

r -> read
w -> write
x -> execute
```

# Bash Script

Combination of bash commands in a single file which can be executed.

```bash
# Example bash script, '#!' is a shebang which denotes which shell is going to be used. It should always be first.

#! /bin/bash
echo 'Hello, World!'

# To run this command, we need to use the explicit path of the file
$ ./hello-world.sh

# To execute this command from anywhere, add it to the path.
```

# Variables

There are constants and variables in bash. Values of variables can change but constants cannot.

- For printing literal values using single quotes
- For printing calculated / derived values use double quotes

```bash
# Example bash script with variables
#! /bin/bash

message='Hello World!"
currentdir=$(pwd)
echo '$message from $currentdir'
# Output
$message from $currentdir

echo "$message from $currentdir"
# Output
Hello World! from /users/pilgrim/bash/what-is-a-variable
```

### Constant variables

```bash
# Example of using constants in bash script
message='Hello World!"
currentdir=$(pwd)
readonly thisvariable="blue"
echo "$message from $currentdir this variable $thisvariable"

# Output
Hello World! from /user/pilgrim/bash/what-is-a-variable this variable blue

# If you change the value of the readonly variable later in the program it will error
```

# Conditional Statements

```bash
#!/bin/bash

number=25

# Anything inside square brackets is a conditional to be tested
# Anyting inside double paranthesis is an arithmetic truth test

if [ $((number % 2)) -eq 0 ];
then
   echo "The number $number is even!";
else
   echo "The number $number is odd!"
fi
```

## Case Statements

```bash
#!/bin/bash

# A script that will ask for a number and print out a message depending on the value.
# -p -> user prompt

read -p "Enter a number: " n
case $n in
    ???)
        echo "One";;
    1|2)
        echo "Two";;
    [3-9])
        echo "Three to nine";;
    *.txt)
        echo "Four";;
    *)
        echo "Other";; # Default pattern always last.
esac
```

# Functions

- Function should be defined before being called.
- Local variables are scoped inside a function and are unavailable outside of them.
- $0 is a position of the function call
- $1 is the first position after the function call name. It is a parameter.

```bash
#!/bin/bash

check_even () {
    local mod=2 # local variable inside function 
    echo "The value of mod is $mod"
    if [ $(("$1" % $mod)) -eq 0 ]
    then
       echo "The number $1 is even!";
    else
       echo "The number $1 is odd!"
    fi
}

number=2344

check_even $number # Here the parameter is at position 1 so $1 inside the function.

# check_even $number $number2 -> $number2 is at position $2.
# check_even is at $0

echo $mod # This will be a blank because the value of mod is outside scope (because mod has been defined as a local variable)
```

# Loops

### `while`

While loops keep executing while true and stop once they become false.

```bash
#!/bin/bash

# A script to display a series of numbers using a while loop.
# -le is less than equal to
counter=1
while [[ "$counter" -le 10 ]]; do
    echo "The counter is at: $counter"
    counter=$((counter + 1))
done
echo "The count has finished."
```

### `until`

Until loops keep executing while false and stop once they become true.

```bash
#!/bin/bash

# A script to display a series of numbers using while.
# -gt is greater than
counter=1
until [[ "$counter" -gt 10 ]]; do
    echo "The counter is at: $counter"
    counter=$((counter + 1))
done
echo "The count has finished."
```

### `for` Traditional

A traditional for loop in bash. This is more like python.

```bash
#!/bin/bash

# Print values in an array using for loops

services=("loadbalancer" "virtualmachine" "storage")

for i in "${services[@]}"
do
   echo $i
done
```

### `for` New

The new for loop in bash. This looks more like JavaScript.

```bash
#!/bin/bash

# A script to display a series of numbers using a for loop.

for (( i=0; i<5; i=i+1 )); do
    echo "The counter is at: $i"
done
```

### `break`

Breaking while loops even if a condition is being met.

```bash
#/bin/bash

# A script that will recieve input and break depending on condition.
# -ge is greater than equal to

while true; do
  read -p "Enter a number between 1 and 25: " n
  if [[ $n -ge 1 && $n -le 25 ]]; then
    echo "You entered $n"
  else
    echo "You didn't enter a number in range, goodbye."
    break
  fi
done

echo "Break happened"
```

# Creating a Resource Group in Azure using BASH

```bash
#!/bin/bash

# A script that will create a resource group in Azure

setup() {
    # Install az cli
    curl -sL <https://aka.ms/InstallAzureCLIDeb> | sudo bash
    # Login
    az login --use-device-code
    echo "You're logged in."
}

# Print out 5 recommended regions
print_out_regions() {
    regions_array=($( az account list-locations --query "[?metadata.regionCategory=='Recommended'].{Name:name}" -$
    for i in "${regions_array[@]}"
    do
       echo "$i"
    done
}

# Select a region
check_region() {
    local region_exists=false
    while [[ "$region_exists" = false ]];  do
        print_out_regions
        read -p "Enter your region: " selected_region
        for j in "${regions_array[@]}"
        do
            if [[ "$selected_region" == "$j" ]]; then
                region_exists=true
                echo "Region exists"
                break
            else
                continue
            fi
        done
    done
}

# Check if resource group already exists.
check_resource_group () {
    while true; do
        read -p "Enter a name for you resource group: " resource_group
        if [ $(az group exists --name $resource_group) = true ]; then
            echo "The group $resource_group exists in $selected_region, please provide another name..."
        else
            break
        fi
    done
}

# Create the resource group
create_resource_group () {
    echo "Creating resource group: $resource_group in $selected_region"
    az group create -g $resource_group -l $selected_region | grep provisioningState
}

#List all resource groups
list_resource_groups() {
    az group list -o table
}

# setup # This is the setup function
check_region
check_resource_group
create_resource_group
list_resource_groups
```
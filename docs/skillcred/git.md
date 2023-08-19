# Git

## Introduction



### Real World Git Tips

1. Manager/owner creates a GitHub/GitLab/Bitbucket project (remote repo)
2. **Clone** the repository to local machine
3. **Fetch** changes made by others
4. **Checkout** remote changes for possible conflicts with your changes
5. **Pull** changes to write on local system
6. **Push** changes to remote after verifying there are no updates in remote

## System Setup & Configuration

## 3-Tier Git Architecture

### Stage 1 - Untracked + Modified

These files are present in the current working directory but are not yet being tracked for changes by Git.

### Stage 2 - Staged

These are tracked files which have been added to tracking in Git. Any changes made to these files are tracked by Git.

### Stage 3 - Committed

All the staged files that are committed are in Stage 3. This is the last stage in the Local Git process. If you are using remote repositories, then this will be followed by pulling and pushing.

## Basic Local Commands

### Init

Initialises an empty repository (no files tracked yet) in the current working directory. This process creates a `.git` folder in the directory.

```bash
git init
```

### Add

Add files and folders for tracking in Git

```bash
git add <filename>

# To add everything in the present working directory
git add .
```

### Status

Check the status of the present working directory. Shows if any files are newly added, modified or deleted.

```bash
git status
```

### Commit

This step creates a snapshot of the current working directory and essentially 'saves' your edits. A commit must always be performed with an attached message that provides information about the edits made.

```bash
git commit -m <"message">
```

## GitHub

### SSH & Configuration

## Remote

### Fetch

```bash
git fetch
```

### Pull

```bash
git pull
```

### Push

```bash
# Setting upstream branch for the first time
git push -u <remote> <branch>

# For further pushing
git push
```

### Log

Lists all the commits made in a git repo

```bash
git log --oneline
```

#### Shortlog

Find how many contributors and number of commits for each

```bash
git shortlog -s -n
```

#### Log --author

Find out all the commits made by a particular contributor

```bash
git log --author <name>
```

Find out all the commits made by a particular contributor for a particular file

```git
git log --author <name> <filename>
```

### Diff

Only applicable for tracked files

```bash
# To compare between committed and staged files
git diff --staged

# To compare between committed and tracked
git diff

# To compare between two committed versions
git diff v1 v2
```

### Alias

This command is used to set usable shorter aliases for commonly used commands.

```bash
git config --global alias.st "status"
```

### Rename

Is used to keep a continuous history a file even after it is renamed. If the user renames the file outside of Git, Git will assume the file no longer exists and will restart the tracking history after the rename. In order to avoid this, it is advisable to rename a file from within Git to maintain it's history.

```bash
git mv <oldname> <newname>
```

## Day 3

### Amend

Replaces the latest commit with a new commit. The replaced commit is archived in a local machine and becomes invisible.

```bash
git commit --amend -m "<message>"
```

### Reflog

Once a commit has been amended and archived it can be referenced again. This history is only accessible only from the local machine the amend was made on.

```bash
git reflog
```

### Tags

Tag commits that are specific or related to releases. Tagging helps essentially in naming a commit to remember what it was related to later on. It is widely used to tag releases.

```bash
# List all tags
git tag --list

# List tags with commit message
git tag -n
```

Tagging comes with two options

#### Lightweight

Widely used when there is nothign specific to be mentioned. It takes the commit ID message by default.

```bash
git tag <tag name> <commidID>

# Example
git tag newfeatureID123 b13ed89
```

#### Annotated

Annotated tags contain messages that contain information about what the tag was for. Like a commit. The purpose is to highlight why this tag was annotated.

```bash
git tag -a <tag name> <commitID> -m "<message>"
```

### Delete A Tag

```bash
git tag -d <tag name>
```

### View Specific Tags

```bash
git show <tag name>
```

### Stash

To keep aside files that are work in progress

```bash
git stash -- <filename>
```

To provide context to a stashed file

```bash
git stash save "message"
```

List stashed files

```bash
git stash show
# By default, if no position is mentioned, it will show the 0 position

git stash show 1
# Show the 1 position stashed file

git stash show -p
# Show more details about the stash similar to git diff
```

Rework or bring a stashed file back to the staging area

```bash
git stash pop <position>

#Example
git stash pop 1
```

### Ignore

Avoid syncing unwanted files to remote. ONLY WORKS FOR UNTRACKED FILES.

```bash 
git config --global core.excludesFile <PATH TO .GITIGNORE FILE>
```

### Checkout



## Day 4

### Clean

Remove untracked files

```bash
# Verify the outcome before actual clean
git clean --dry-run

# Force delete files
git clean -f

# Delete Directories and files together
git clean -f -d

# Delete Ignored files
git clean -f -x

# Delete all files and directories including ignored
git clean -f -d -x

# Delete specific file
git clean -i

# Or
git clean -f <filename>
```

### RM

Remove tracked files.

```bash
# Remove file from Git and file system
git rm -f <filename>

# Remove file from Git but not from file system
git rm --cached <filename>
```

### Reset

Reset to a previous state deleting any commits done after this state. It also removes the commit history.

Reset is not recommended in real world scenarios, especially when changes are already pushed to the remote. This is because when your local data is diverged, you always fetch and pull first. This will re-reset your data back to the commit before the reset was done.

```bash
# If you want to remove commit history as well as the changes (data)
git reset --hard

# If you do not need to make changes but only converge multiple commits into one.
git reset --soft

# If you need to change the data and recommit everything.
git reset --mixed
```

### Revert

Reverts the changes of a specific commit mentioned, essentially erasing that commit, **creates a new commit** from the resulting change as if the reverted commit never existed.

For Eg.

C1 -> C2 -> C3 -> C4 -> C5

```bash
git revert C3
```

This will essentially create a new commit C6 with a historical snapshot in which C3 never existed.

C1 -> C2 -> C4 -> C5 -> C6

### Day 5

### Fork

### Pull Request

### Branching

### Merging

### Conflict

## Day 6

### Rebase

### Project 1

### Bonus Project


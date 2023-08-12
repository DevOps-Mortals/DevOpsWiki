# Git

## Introduction

### 3-Tier Git Architecture

#### Stage 1

Untracked Files

#### Stage 2

Staged Files

#### Stage 3

Committed Files

### Real World Git Tips

1. Manager/owner creates a GitHub/GitLab/Bitbucket project (remote repo)
2. **Clone** the repository to local machine
3. **Fetch** changes made by others
4. **Checkout** remote changes for possible conflicts with your changes
5. **Pull** changes to write on local system
6. **Push** changes to remote after verifying there are no updates in remote

## System Setup & Configuration

## Git Architecture

## Basic Local Commands

## GitHub

### SSH & Configuration

## Remote

### Fetch

### Pull

### Push

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

1. Only applicable for tracked files

```bash
# To compare between committed and staged files
git diff -- staged

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
git rename <oldname> <newname>
```

## Day 3

### Amend

1. Replaces the latest commit with a new commit. The replaced commit is archived in a local machine and becomes invisible.

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

### Ignore

Avoid syncing unwanted files to remote. ONLY WORKS FOR UNTRACKED FILES.

```bash 
git config --global core.excludesFile <PATH TO .GITIGNORE FILE>
```

### Checkout

## Day 4

### Clean

### RM

### Reset

### Revert

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


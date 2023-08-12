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

### Rename

## Day 3

### Amend

### Tags

### Stash

### Ignore

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


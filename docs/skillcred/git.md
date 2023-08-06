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
git diff <commitID-old> <commitID-new>
```

### Alias

Use shortened commands for most used git commands.

```
git config --global alias.<two letter> "<command>"

# Example
git config --global alias.ci "commit"
```

### Rename

Use rename in Git to change file names. If not, Git will not recognise the continuation, rather start fresh with the new file name. If you rename a file directly, Git will believe that the file was deleted and a new file was created.

```bash
git mv <old name> <new name>
```

This way, Git knows you renamed a file and it will continue to keep the history connected even after the rename.

> Note: If you renamed a file outside of Git and verify using `git status` it will show two files, one with the previous name which is deleted and one with the new name which is untracked. In this scenario, if you just do `git add .` It will automatically rename the file by comparing them.

## Day 3

### Amend

### Tags

### Stash

### Ignore

### Checkout

1. Temporarily access another branch
2. Is primarily used to check for changes and understand changes made

```bash
git checkout <branchname>

# Example - after you do `git fetch` and realise there are changes on the remote repo, you can do this
git checkout origin/main
```

3. This will give you access to the files on the remote repo without having to pull and register changes in the local repository.
4. This way you do need to lose your work or create merge conflicts for simply checking the updates done on the remote repo.

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


# Git

## Resources

[Hands-On Git](https://learngitbranching.js.org)

[Atlassian Git Tutorials - Become a Git Guru](https://www.atlassian.com/git/tutorials)

[Git Certification](https://training.linuxfoundation.org/certification/git/)

## Working with Local repositories

### `config`

Configure the local git client with variables.

```bash
git config --global user.name "your_name"
```

```bash
git config --global user.email "you@example.com"
```

View your custom configuration

```bash
git config --list
```

### `init`

Initialize an empty repository in a directory. This does not make Git start tracking your files.

```bash
git init
```

### `branch`

Working with Git is essentially working with commit branches. They help keep code clean and disasters away.

```bash
git branch feature #Creates a branch called 'feature'
```

```bash
git branch # View all branches in the repo
```

> The little start next to the branch name means the HEAD is pointing to that branch as of the current commit.

### `add`

When initializing a new repository, you need to specify the files that Git should track.

```bash
git add <filename> # Track a particular file
git add . # Track all files in the current folder
git add -a # Same as above
```

### `status`

This shows you the current status of your local repository and if there modifications or not.

```bash
git status
```

### `commit`

This is essentially like saving a file. Once the files are committed, they are ready to be pushed. Commits are done with a message and summary that highlights the modifications made.

```bash
git commit -m "Your commit message here"
```

## Working with Remote Repositories

### `clone`

Clone a remote repository (eg. hosted on GitHub) into a local working directory. This will also create a folder with the same name as the repository.

```bash
git clone https://example.com/user/repo.git
```

~ still developing ~
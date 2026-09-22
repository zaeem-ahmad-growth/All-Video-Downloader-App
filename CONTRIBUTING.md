# How to contribute

## Owner: give someone access

On GitHub, open the repository's **Settings > Collaborators > Add people**, then enter the person's GitHub username or email. They get an invitation email. Only collaborators can push changes; everyone can view the site.

## Contributor: one-time setup

1. Accept the invitation email from GitHub.
2. Install Git (git-scm.com), GitHub CLI (cli.github.com), VS Code and the Claude Code extension.
3. In a terminal, run:
   ```
   gh auth login --web --git-protocol https
   gh repo clone zaeem-ahmad-growth/All-Video-Downloader-App
   ```
4. Open the `All-Video-Downloader-App` folder in VS Code and start Claude Code there. Claude reads `CLAUDE.md` automatically, so it knows how the site is built and how to publish.

## Making a change

Ask Claude in plain words, for example:

> Add a tab called "Review Mining" with the table from this CSV, then publish it.

> On the PlayStore Metadata tab, add a note under the policy record that the Tiksta rename shipped in version 2.5.

Claude edits the files, commits them and pushes them. The site updates about a minute later at https://zaeem-ahmad-growth.github.io/All-Video-Downloader-App/ .

Several people can work at the same time. If two people change the same file, the second push is rejected and Claude pulls the other change first, then pushes again.

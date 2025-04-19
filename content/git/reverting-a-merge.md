---
title: Reverting a Merge
---

It's late in the week, and a bug has popped up that is breaking production. After thorough searching, you identify the source of the bug: a single commit. The fix isn't immediately obvious, and it likely will need to be tested, so for now you revert that commit with `git revert` and fix production temporarily.

Using `git revert` is effective for reversing small commits or features that have introduced a bug. When you have come up with a fix, you might be able to simply revert the previous revert, make some changes and merge back into the main branch. If it's small enough, you might even be able to rewrite the entire original commit from scratch. When using `git revert` to try and fix a bad merge, however, it can be easy to make a mess.

## What is a Revert?

[Git Documentation: git-revert](https://git-scm.com/docs/git-revert):

> Given one or more existing commits, revert the changes that the related patches introduce, and record some new commits that record them. This requires your working tree to be clean (no modifications from the HEAD commit).

Many developers mistakenly view `revert` as a simple undo operation. However, it does not make the commit disappear as though it never happened. Rather, `revert` is more like "do the opposite of everything I've already done". When you revert a commit, Git does not edit the repository's history to make it look as if the commit never occurred. Instead, Git creates a new commit that's the opposite of the commit that you are reverting. Every addition is now a deletion and vice versa. This can be illustrated by examining the diffs of a commit and its corresponding revert commit.

I've created a small Git repository that just includes a text file. There are a couple commits that edit the text in the file. You can see in the log below that "commit 2" was reverted.

```
❯ git log --decorate --pretty=oneline --abbrev-commit
23f7bf2 (HEAD -> main) Revert "commit 2"
83217b1 commit 2
7f5126d commit 1
ec21e3a initial commit
```

Here are the changes from `83217b1` (commit 2). You can see that a couple of lines were added to the file.

```diff
diff --git a/file b/file
index 4cae953..757aa3f 100644
--- a/file
+++ b/file
@@ -1,3 +1,5 @@
 alpha
 bravo
+charlie
 echo
+foxtrot
```

And here are the changes from `23f7bf2` which reverted commit 2. The revert created a brand new commit (the one being shown here) and the diff is the opposite of the previous one.

```diff
diff --git a/file b/file
index 757aa3f..4cae953 100644
--- a/file
+++ b/file
@@ -1,5 +1,3 @@
 alpha
 bravo
-charlie
 echo
-foxtrot
```

## Using `revert` to Reverse a Merge

### A Hypothetical Example

Let's imagine that we have two branches: `main` and `feat`. The `main` branch contains development work for the current release while `feat` is a long-running feature branch that is actively being worked on. Throughout the development on `feat`, the `main` branch is occasionally merged in to pick up bug fixes and features from other developers. A simplified version of this setup would look something like this:

```
main: A0 ---- A1 ------ A2 --- A3
               \                \
feat:           *---- B1 ------- B2 (merge)
```

For whatever reason, the merge that happened at `B2` is a problematic, and we need to undo it so we revert the merge. This results in a new commit, `B3`, which effectively undoes the changes introduced by `B2`. This applies the inverse of commits `A2` and `A3`, as those commits were part of the merge.

```
main: A0 ---- A1 ------ A2 --- A3
               \                \
feat:           *---- B1 ------- B2 -- B3 (revert B2)
```

Because we've reverted the merge, it's as if `A2` and `A3` had never been brought into the feature branch. So far, this is what we wanted, but the problem occurs the next time we merge `main` into `feat`.

On `main`, a new commit has been added that helped fix the issue before. Now that the issue is fixed, we want to bring `main` back in so we perform another merge.

```
main: A0 ---- A1 ------ A2 --- A3 --------- A4
               \                \            \
feat:           *---- B1 ------- B2 -- B3 --- B4 (new merge)
                                 ^     ^ 
                            (merge)   (revert B2)
```

But now `feat` is broken... why? It's not immediately obvious, but while the latest merge brought in `A4`, `feat` actually will not include any of the changes from `A2` or `A3` despite the final merge.

### Testing With Git

Let's test [the hypothetical example](#a-hypothetical-example) for real with Git and see if that's true. Here is a bash script that replicates all of the steps from the example above. You can run it in a temporary directory to get to the same state from above. For each commit it creates a file with that commit's "ID". This makes it easy to tell if we have a commit's changes or not by just looking at the files in the directory.

```bash
#!/usr/bin/env bash
set -euo pipefail

create_commit() {
    local id="$1"
    touch "commit-$id"
    git add "commit-$id"
    git commit -m "$id"
}

git init --initial-branch main
create_commit "A0"
create_commit "A1"
git branch feat
git checkout feat
create_commit "B1"
git checkout main
create_commit "A2"
create_commit "A3"
git checkout feat
git merge main -m "B2 (merge main)"
git revert -m 1 "$(git rev-parse HEAD)" --no-edit
git commit --amend -m "B3 (revert B2)"
git checkout main
create_commit "A4"
git checkout feat
git merge main -m "B4 (merge main)"
```

After running the script, the graph looks the same as the hypothetical example from before which is good.

```
❯ git log --graph --pretty=oneline --decorate --abbrev-commit feat
*   d4064de (HEAD -> feat) B4 (merge main)
|\
| * 923f885 (main) A4
* | 33da5b5 B3 (revert B2)
* | c0f93b4 B2 (merge main)
|\|
| * e6a9493 A3
| * e61cd05 A2
* | b9c0ae2 B1
|/
* 96dd405 A1
* 843f372 A0
```

The comment from the hypothetical example about the changes from `A2` and `A3` being missing was accurate. Additionally, we see `A4`, confirming that the final merge was successful.

```
❯ ls -1
commit-A0
commit-A1
commit-A4
commit-B1
```

### Why Are We Missing Changes?

In both examples, why are the changes `A2` and `A3` missing? Well the commits themselves *are* in the feature branch, but the feature branch still includes the revert commit that undoes all of their changes. You can see in the log that we have both commits, but we also still have `B3` which reverted (applied the opposite of) all of their changes.

```
❯ git log --abbrev-commit --oneline
d4064de (HEAD -> feat) B4 (merge main)
33da5b5 B3 (revert B2)
923f885 (main) A4
c0f93b4 B2 (merge main)
e6a9493 A3
b9c0ae2 B1
e61cd05 A2
96dd405 A1
843f372 A0
```

After the revert, future merges will be unable to bring the changes from any of the commits that were reverted back in to the branch. Since the commits are technically still in the branch, the merge will no longer include them. You can test this yourself by merging two branches, reverting the merge, and then immediately merging again. Because all of the commits from the first merge are actually still in the branch, the merge will just do nothing and claim that the branch is already up to date.

This can be seen by just editing the script from the Git example above to stop after the first revert.

```bash
#!/usr/bin/env bash
set -euo pipefail

create_commit() {
    local id="$1"
    touch "commit-$id"
    git add "commit-$id"
    git commit -m "$id"
}

git init --initial-branch main
create_commit "A0"
create_commit "A1"
git branch feat
git checkout feat
create_commit "B1"
git checkout main
create_commit "A2"
create_commit "A3"
git checkout feat
git merge main -m "B2 (merge main)"
git revert -m 1 "$(git rev-parse HEAD)" --no-edit
git commit --amend -m "B3 (revert B2)"
```

You can then run the script and try to manually run the merge again after the revert.

```
❯ ./test-merge.sh > /dev/null
Switched to branch 'feat'
Switched to branch 'main'
Switched to branch 'feat'

❯ git log -1 --format=%B
B3 (revert B2)

❯ git merge main
Already up to date.
```

## How Can We Fix a Bad Merge?

### Truly Undo the Merge

In the earlier explanation about [what a revert really is](#what-is-a-revert), it was mentioned that a revert doesn't completely undo a commit by removing it from the history, but instead if creates a new commit that undoes the changes. When dealing with a merge, I believe that the cleanest option is to *actually* undo the commit as if never happened. 

```
main: A0 ---- A1 ------ A2 --- A3
               \                \
feat:           *---- B1 ------- B2 (merge)
```

In this example, I don't want `B2` to exist anymore. Instead of reverting the commit, I would instead reset the branch back to `B1` using `git reset`. Using `git reset` will alter the history of the branch and move it back to before the merge, allowing you to retry the merge later on without losing data.

This approach allows you to undo your merge quickly and prevents it from being forgotten about. Because you are changing history, however, you need to be careful doing it on public branches, especially those that are being collaborated on with other developers. If you don't want to change the history of the current branch, you can also create a new branch based on `B1` and continue work on that branch instead. If some commits have been added to the branch after `B2`, you will need to cherry-pick those commits back after resetting to `B1`.

### Revert the Revert

If you've already reverted a merge and you do not have the option or ability to truly undo the merge as described above, then you have to make another revert, but this time you will revert your first commit. Since revert commits negate all changes made by the original commit, this will bring back the changes from the original merge.
- A merge commit brings in changes A, B, and C.
- The merge commit is reverted
  - This creates commit D which is the opposite of A, B, and C.
- Revert commit D is reverted.
  - This creates commit E which is the opposite of D.
  - Since D is the opposite A, B, and C, and this new commit E is the opposite of D, commit E is the equivalent of A, B, and C.

Here I have re-run the script from the Git example to create a repository that's missing changes from `A2` and `A3`.

```
❯ ls -1
commit-A0
commit-A1
commit-A4
commit-B1

❯ git log --pretty=format:'%Cred%h%Creset - %s' --abbrev-commit
7e91ddc - B4 (merge main)
f47c179 - B3 (revert B2)
a774372 - A4
70c3231 - B2 (merge main)
e735b5a - A3
0f3e9a9 - B1
b614a00 - A2
2651eed - A1
ca2abaf - A0
```

In the log, I can see that `f47c179` was the commit that reverted the first merge, so I can revert that commit and the files should be restored.

```
❯ git revert f47c179 --no-edit
[feat 87a3ec3] Revert "B3 (revert B2)"
 Date: Wed Sep 18 21:44:05 2024 -0600
 2 files changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 commit-A2
 create mode 100644 commit-A3

❯ ls -1
commit-A0
commit-A1
commit-A2
commit-A3
commit-A4
commit-B1
```

A significant issue with this approach is that it can be easy to overlook. If you have a long-running branch, merges may be happening very infrequently. The next time a merge happens, the need to do this might have be overlooked. Even worse, you may be missing changes that aren't immediately apparent (i.e. the missing changes don't break the build or deployment, but cause regressions or small features to be lost) and continue on for a long time without ever noticing that you need to fix an old revert. Your feature branch might even make it into the main branch or release without it being noticed. If you choose this approach, I recommend creating a note or P0 ticket to ensure it is not overlooked, and handle the second revert ASAP.

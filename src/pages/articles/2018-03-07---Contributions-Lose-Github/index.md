---
title: "Trouble shooting: Github Contributions Lose "
date: "2018-03-07"
layout: post
draft: false
path: "/posts/Contributions-Lose-Github"
category: "Trouble Shooting"
tags:
  - "GitHub"
description: ""
---
<<<<<<< HEAD
当本地 **Git** 邮箱与 **GitHub**留的邮箱 不一致时, 所推送的 Contributions 不会被 GitHub记录并显示  
=======
当本地 **Git** 邮箱与 **GitHub** 不一致时, 所推送的 Contributions 不会被 GitHub记录并显示  
>>>>>>> 20cb9b60c1690dee5a7d460bfda45c5537af435c

**Solution:** (**For Mac**)
>To change the name and/or email address recorded in existing commits, you must rewrite the entire history of your Git repository.

1. Open Terminal.  

2. Create a fresh, bare clone of your repository:
    ```  
<<<<<<< HEAD
    git clone --bare https://github.com/your-username/your-repo.git
    cd your-repo.git
=======
    git clone --bare https://github.com/user/repo.git
    cd repo.git
>>>>>>> 20cb9b60c1690dee5a7d460bfda45c5537af435c
    ```
3. Copy and paste the script, replacing the following variables based on the information you gathered:
    ```
    #!/bin/sh
    git filter-branch --env-filter '
    OLD_EMAIL="your-old-email@example.com"
    CORRECT_NAME="Your Correct Name"
    CORRECT_EMAIL="your-correct-email@example.com"
    if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
    then
        export GIT_COMMITTER_NAME="$CORRECT_NAME"
        export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
    fi
    if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
    then
        export GIT_AUTHOR_NAME="$CORRECT_NAME"
        export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
    fi
    ' --tag-name-filter cat -- --branches --tags
    ```
4. Press `Enter` to run the script.
5. Review the new Git history for errors: `git log`  

<<<<<<< HEAD
6. Push the new Git history to GitHub: `git push --force --tags origin HEAD:master`  

7. Clean up the temporary clone: `cd .. & rm -rf your-repo.git`    
=======
6. Push the new Git history to GitHub: `git push --force --tags origin 'refs/heads/*'`  

7. Clean up the temporary clone: `cd .. & rm -rf repo.git`    
>>>>>>> 20cb9b60c1690dee5a7d460bfda45c5537af435c

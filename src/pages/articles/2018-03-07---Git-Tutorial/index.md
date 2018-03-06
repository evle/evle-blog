---
title: "Git Tutorial"
date: "2018-03-07"
layout: post
draft: false
path: "/posts/git-tutorial"
category: "Git"
tags:
  - Github
  - Git
description: ""
---
Git是目前主流的分布式版本控制系统, 下载及安装Git后需要进行以下设置

        $ git config --global user.name "Your Name"
        $ git config --global user.email "email@example.com"

设置完Git之后设置Github的 **SSH key**. 使用 `ssh-keygen -t rsa -C "email@example.com"` 生成 **id_rsa.pub** 然后 添加到 Github 账户中.

# 基本操作
        ## 创建与添加
        # 在新建的文件夹内执行以下命令新建仓库
        $ git init  

        # 添加文件至仓库
        $ git add a
        $ git add b
        $ git add .
        $ git commit -m "add 2 files."

        # 获取当前工作区状态
        $ git status

        # 查看文件改动
        $ git diff  # 工作区与缓存区的差异
        $ git diff branch-a branch-b
        $ git diff branch

        # 历史提交记录
        $ git log # 查看所有commit记录
        $ git log filename  # 查看文件修改记录

        # 查看代码的作者
        $ git blame filename

        # 文件恢复

需要注意的是在添加文件至仓库时有2步，先使用 `git add filename` 提交单个文件到暂存区, 然后使用 `git commit -m "message"` 将暂存区的文件提交到当前分支. 还有一点要注意的是确保 **"message"** 有意义.  

## 版本切换

        # 查看commit记录(获取commit_id)
        $ git log

        ＃切换版本
        $ git reset --hard commit_id  # 切换到指定commit_id的版本
        $ git reset --hard HEAD^      # 切换到上个版本
        $ git reset --hard HEAD^^     # 切换到上上个版本

        # 查看历史命令
        $ git reflog  


当回退到之前的版本时, 回退前的版本的commit_id无法通过 `git log` 查询, 只能通过 `git reflog` 查询历史版本的commit_id.  
e.g. 当前版本B, 使用 `git reset --hard commit_id` 回退到之前的版本A. 在版本A中, 再想回退到版本B时, 无法使用 `git log` 获取版本B的 **commit_id** . 但可以通过 `git reflog` 获取.

## 撤销与删除

        # 撤销在暂存区中的提交 (已 add 未 commit)
        $ git reset HEAD filename
        $ git checkout filename

        # 撤销提交
        $ git revert HEAD # 撤销最近一次提交
        $ git revert commit_id

        # 查看某次提交修改的内容
        $ git show commit_id

        # 删除被 tracked 的文件
        $ rm filename
        $ git status

        # -----> 恢复
        $ git checkout -- filename  # 抛弃当前修改 or 恢复误删文件

        # or ----> 确定删除
        $ git rm filename  # 删除暂存区中文件
        $ git commit -m "message"

误删的文件也可以使用 `git checkout -- filename` 恢复.


# 分支管理
## 常用分支
* master branch:
* develop branch:
* temporary branch: adding new feature or hotfix

## 分支操作

        # 创建
        $ git branch branch_name       # 创建分支
        $ git checkout branch_name     # 切换分支
        $ git checkout -b branch_name  # 创建并切换分支

        # 合并
        $ git merge branch_name         ＃ 合并指定分支到当前分支
        $ git merge --no-ff -m "message" branch_name  ＃ 禁用快速合并

        # 线性合并
        $ git checkout some-feature     # 合并 some-feature 到 origin
        $ git rebase origin
        # 解决冲突后
        $ git add filename
        $ git rebase --continue
        # 终止合并
        $ git rebase --abort

        # 查看合并情况
        $ git log --graph --pretty=oneline

        # 删除  
        $ git branch -d dev
        # 恢复
        $ git log --branches="branch_name"  
        $ git branch branch_name commit_id

        # 分支重命名
        $ git branch -m old_name new_name

        # 推送分支
        $ git push origin branch_name

        # 关联本地分支与远程分支
        $ git branch --set-upstream branch-name origin/branch-name
如果突然有高优先级的分支需要前去处理的时候, 使用 `git stash` 可以保存当前工作现场. 当其它分支处理完成, 使用 `git stash apply` 恢复工作现场. 相关命令: `git stash list`, `git stash apply stash@{2}`

        # 远程分支操作
        # 修改远程Repo地址
        $ git remote set-url origin remote_repo

        # 获取远程仓库更新
        $ git fetch origin master
        $ git log -p master ..origin/master
        $ git merge origin/master

        $ git pull  # fetch + merge

        # 查看远程分支
        $ git brach -r

        # 获取远程分支
        $ git checkout b local_branch remote_branch
        $ git fetch origin remote_branch:local_branch
        $ git branch --set-upstream

        # 删除远程分支
        $ git push origin :branch_name


# 标签管理

        # 创建标签
        $ git tag tag_name
        $ git tag tag_name commit_id        # 为指定的提交创建标签
        $ git tag -a tag_name -m "message"  # 创建标签同时指定说明

        # 查看标签
        $ git tag

        # 删除标签
        $ git tag -d tag_name

标签默认不会被推送到远程, 使用 `git push origin --tags` 将标签推送至远程

# 远程仓库  
## 从本地推送至服务器端
1. 先在Github上新建一个Repository.
2. 将本地的仓库与刚才新建的仓库关联.

        $ git remote add origin git@github.com:username/repo_name.git

3. 推送本地仓库至远程仓库

        $ git push -u origin master  # -u 关联本地分支和远程分支

之后每次提交代码至服务器端只需要 `git push origin master`.  
这里有一点要注意, **如果在Github上新建的项目自动生成了README**，需要在关联本地仓库与远程仓库之后执行 `git pull --rebase origin master` 将README同步至本地之后，再推送本地仓库至远程.

## 从服务器端克隆至本地
1. 在Github中找到 **Clone** 选项中所需项目的 **SSH** 或者 **HTTPS** 的URL.
2. 在合适的文件夹里执行 `git clone  SSH or HTTPS`.

# 贡献代码
## Collaborators
*Settings -> Collaborators -> Add collaborator*

## Pull Request
*Fork -> Clone -> [Write Code] -> Commit & Push -> Pull Request*

# Git Workflow
## Github workflow
1. **Create a brach**
Branch name should be descriptive e.g., **refactor-authentication**, **Fixes-#31**  

2. **Add commits**
Writing clear commit messages is extremely important.  

3. **Open a Pull Request**  

4. **Discuss and review your code**  

5. **Deploy**  

6. **Merge**  

# .gitignore
A collection of useful **.gitignore** templates: <https://github.com/github/gitignore>
Example: remove node_modules from git repo
    ```
    git rm -r --cached node_modules
    git commit -m 'Remove the now ignored directory node_modules'
    git push origin master
    ```

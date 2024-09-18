Git 是一个分布式版本控制系统，每个开发者的本地仓库都是完整的仓库副本，拥有完整的历史记录和所有的文件版本。与集中式版本控制系统（如 SVN）不同，Git 不依赖于一个单一的服务器，即使没有网络连接，你仍然可以在本地执行几乎所有操作。
## 基础概念
### 1. 区域
Git 有 3 个主要区域：工作目录、暂存区、Git 仓库。
- **工作区（Working Directory）**: 工作区是你本地项目的当前文件系统中的实际目录，是你正在编辑、修改文件的地方。它包含所有文件和文件夹，反映了项目的当前状态。
- **暂存区（Staging Area）**: 暂存区是 Git 的一个临时区域，用于保存你准备提交的变更的快照。当你对文件做了修改，并使用 git add 命令时，修改会被添加到暂存区。
- **Git 仓库（Git Repository）**: 仓库是存储所有版本历史记录的地方。当你提交代码后，Git 会把提交的信息和快照保存到仓库中。仓库包含了所有已提交的快照，一般指得就是.git文件夹。
### 2. 状态
Git 的工作流程围绕着三种状态：已修改（Modified）、已暂存（Staged） 和 已提交（Committed）。
- **已修改**： 文件被修改了，但还没有添加到暂存区中。这意味着文件在工作区中发生了变化，但 Git 还不知道你是否准备将这些变更提交。
- **已暂存**： 文件已经被添加到暂存区，表示你希望将它包含在下一次提交中。这意味着文件的当前版本已经被记录到 Git 的暂存区中，等待提交。
- **已提交**： 文件已经被提交到 Git 仓库中，成为项目历史的一部分。此时，文件的版本已经被永久保存，且具有唯一的提交哈希值。

状态转换的完整流程：
1. **文件创建或修改**： 文件首先处于 未跟踪 或 已修改 状态。
2. **暂存变更**： 使用 `git add` 将文件添加到暂存区，文件的状态变为 已暂存。
3. **提交变更**： 使用 `git commit` 将暂存区的文件提交到仓库，文件的状态变为 已提交。

> 其他状态：
>
> 未跟踪（Untracked）：未跟踪文件是那些在工作区中存在但还没有被 Git 记录的文件。Git 并不会自动跟踪新创建的文件，除非你使用 `git add` 命令将它们添加到暂存区。
>
> 已忽略（Ignored）：有些文件（比如临时文件、编译生成的二进制文件等）可能不需要被 Git 跟踪。这些文件通常会被添加到 `.gitignore` 文件中，Git 会自动忽略它们。

### 3. 提交记录

一次 Git 提交包含以下 **关键内容**：

1. **提交内容快照（Blob 对象）**：记录文件的实际内容。
2. **树对象（Tree Object）**：描述项目的文件和目录结构。
3. **父提交（Parent Commit）**：指向上一次提交，形成提交链。
4. **提交信息（Commit Message）**：简要描述此次提交的变更及原因。
5. **作者信息（Author）**：记录提交的作者。
6. **时间戳（Timestamp）**：提交的时间。
7. **提交哈希值（SHA-1）**：唯一标识提交对象，确保版本一致性和安全性。

这些内容共同构成了 Git 的提交记录，帮助跟踪项目变更历史。虽然一个提交记录包含了如此多的内容，但是除了提交信息，程序员在提交的时候无需关系其他的内容。

## 使用指南

### 1. Git基本配置

Git 安装好之后，需要进行一些全局配置，如用户名和邮箱。这些信息会记录在每次的提交中。

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

其他常用配置：

```bash
git config --global init.defaultBranch main # 设置默认主分支名称为 main
```

查看所有配置：

```bash
git config --list
```

### 2. 初始化仓库

- 创建新的 Git 仓库：进入项目目录，执行以下命令来初始化 Git 仓库：

```bash
git init
```

- 克隆远程项目：如果已经有远程仓库，可以使用 `git clone` 复制远程仓库到本地：

```bash
git clone <repository-url> [别名]
```

### 3. 基本命令

- 查看仓库状态：

```bash
git status
```

显示工作区和暂存区的文件状态，包括未跟踪、已修改和已暂存的文件。

- 添加文件到暂存区：

```bash
git add <file>
```

将文件从工作区添加到暂存区，可以添加单个文件，也可以添加所有文件：

```bash
git add .
```

- 提交文件：

```bash
git commit -m "commit message" 
```

将暂存区的文件提交到本地仓库，`-m` 选项后跟提交信息。

- 删除文件：

```bash
git rm <file>
```

从 Git 仓库中删除文件，并在工作区中删除文件。

如果你想让 Git 停止跟踪某个文件，但仍然保留该文件在工作区中（即物理文件不被删除），可以使用 `--cached` 选项：

```bash
git rm --cached <file>
```

### 4. 分支操作

- 查看分支：

```bash
git branch
```

显示当前所有本地分支，当前所在的分支会有 `*` 标记

- 创建分支：

```bash
git branch <branch-name>
```

在当前分支的基础之上创建一个新的分支。

- 切换分支：

```bash
git checkout <branch-name>
```

切换到指定的分支。

- 合并分支：

```bash
git merge <branch-name>
```

将 `<branch-name>` 的分支合到当前分支。

> **分支合并**（Branch Merge）是 Git 中用于将两个分支的工作结合在一起的操作。它的主要目的是将一个分支上的修改整合到另一个分支中。合并通常用于完成功能开发后，将功能分支合并回主分支（`main` 或 `master`），以便将所有更改融合到项目中。

> [!IMPORTANT] 合并流程
>
> 1. **切换到目标分支**（通常是 `main` 或 `master` 分支）：`git checkout <目标分支>`
> 2. **执行合并**：合并源分支的更改到当前所在的目标分支。`git merge <源分支>`
> 3. **处理冲突**（如果有）：如果 Git 不能自动合并所有更改，你需要手动解决冲突。Git 会标记冲突的文件，并且你需要编辑这些文件，选择保留哪些内容。
> 4. **提交合并**：在处理完冲突后，使用 `git add` 暂存更改的文件，然后执行 `git commit` 完成合并。

- 删除分支：

```bash
git branch -d <branch-name>
```

删除指定的分支（该分支必须已经被合并）

### 5. 远程操作

- 查看远程仓库：查看当前项目关联的远程仓库地址。

```bash
git remote -v
```

- 添加远程仓库：将远程仓库  `origin` 与本地仓库关联。

```bash
git remote add origin <reposity-url>
```

- **推送**代码到远程仓库：将指定分支推送到远程仓库。

```bash
git push origin <breach-name>
```

- 从远程仓库**拉取**代码：拉取远程分支的最新代码与本地代码合并。

```bash
git pull origin <branch-name>
```

- 获取远程仓库的更新：从远程仓库获取最新的提交，但不会自动合并。

```bash
git fetch origin
```

### 6. 查看历史

- 查看提交历史：列出所有提交记录，包括提交的哈希值、作者、日期和提交信息。

```bash
git log
```

- 查看差异：查看工作区和暂存区文件的差异。

```bash\
git diff
```

### 7. 撤销与回复

- 撤销修改：将工作区的文件恢复到上次提交的状态，丢弃本地修改。

```bash
git checkout -- <file>
```

- 撤销提交：撤销上一次提交，但保留修改在暂存区中。

```bash
git reset --soft HEAD^
```

> **`HEAD` 是 Git 中的指针**，指向当前检出的分支或提交。
>
> **正常情况下**，`HEAD` 指向当前分支的最新提交。

- 恢复到指定提交：重置仓库到指定提交，丢弃所有后续的提交和修改。

```bash
git reset --hard <commit-hash>
```

> commit-hash ：提交的哈希值，可通过 `git log` 来查询

## 常见问题与解决

### 1. 如何忽略某些文件？

使用 `.gitignore` 文件，在其中列出不希望 Git 跟踪的文件或目录：

```gitignore
*.log
node_modules/
*.tmp
```

### 2. 如何解决合并冲突？

1. Git 会标记出冲突的文件。

2. 打开文件，手动编辑冲突部分。

3. 使用 `git add` 暂存解决冲突后的文件。

4. 使用 `git commit` 提交合并。

### 3. 如何查看帮助？

```bash
git help <command>
```

例如，查看 `git commit` 的帮助：

```bash
git help commit
```

## 提交信息的格式与规范

一个好的提交信息通常遵循一些标准格式和规范，尤其是在团队合作或开源项目中。

**Conventional Commits** 是一种提交信息的规范，旨在为提交信息定义一个标准化的格式，使提交历史清晰、可读，并且易于自动化处理。它特别适用于持续集成、自动生成变更日志、版本发布等场景。

Conventional Commits 提交信息格式非常明确，主要包括**提交类型**、**可选范围**和**提交描述**。通过标准化的提交信息格式，开发团队可以更轻松地理解提交的意图，并且可以自动化管理版本和生成变更日志。

### 1. 基本格式

Conventional Commits 的基本提交格式如下：

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

- **`<type>`**：提交的类型，表示这次提交的性质。
- **`<scope>`**：可选，表示更改的影响范围（例如更改的模块或文件）。
- **`<description>`**：简短的描述，说明此次更改的内容，通常保持在 50 字符以内。
- **`[optional body]`**：可选，进一步解释此次提交的详细信息，特别是复杂的变更。
- **`[optional footer(s)]`**：可选，通常用于关联提交到某个问题或说明需要的破坏性变更（BREAKING CHANGE）。

### 2. 常用的type类型

提交类型是提交信息中最重要的部分，它指明了提交的性质。以下是最常用的类型：

- **`feat`**：新功能的引入（a new feature）。
  - **示例**：`feat(payment): add support for credit card payments`

- **`fix`**：修复一个 bug（a bug fix）。
  - **示例**：`fix(login): fix login issue when using special characters`

- **`docs`**：仅文档的更改（changes to documentation）。
  - **示例**：`docs(README): add usage instructions`

- **`style`**：代码格式的修改（如空格、格式化、缺少分号等），但不影响功能或逻辑（changes that do not affect the meaning of the code）。
  - **示例**：`style: format code to meet eslint standards`

- **`refactor`**：代码重构（既不是新增功能也不是修复 bug 的代码变更），改善代码的结构但不改变其功能（a code change that neither fixes a bug nor adds a feature）。
  - **示例**：`refactor(user-service): simplify user data fetching logic`

- **`perf`**：提高性能的代码变更（a code change that improves performance）。
  - **示例**：`perf: improve rendering speed by optimizing component lifecycle`

- **`test`**：添加或修改测试用例（adding missing tests or correcting existing tests）。
  - **示例**：`test: add unit tests for auth module`

- **`chore`**：对构建过程或辅助工具的更改，和源代码无关的变更（updating build tasks, package manager configs, etc; no production code change）。
  - **示例**：`chore: update npm dependencies`

- **`ci`**：与持续集成相关的变更（changes to our CI configuration files and scripts）。
  - **示例**：`ci: update TravisCI config to run additional tests`

- **`build`**：影响构建系统或外部依赖的变更（如 gulp、npm、webpack 等）（changes that affect the build system or external dependencies）。
  - **示例**：`build: update webpack to version 5`

- **`revert`**：撤销某次之前的提交（reverts a previous commit）。
  - **示例**：`revert: revert feat(payment): add support for credit card payments`

### 3. 可选的scope（范围）

`<scope>` 是可选的，用来说明这次提交影响的模块、功能或子系统。例如，如果你正在更改登录功能模块，可以使用 `login` 作为范围：

- **示例**：`fix(login): fix incorrect password validation`

`scope` 可以帮助团队更好地了解此次更改对项目中哪些部分产生了影响，尤其是在大型项目或复杂系统中显得很重要。

### 4. 描述（description）

- **简短、明了**：描述应简明扼要，概括性说明此次提交的意图和内容。通常限制在 50 个字符以内。
- **祈使句**：应使用祈使句，描述提交的动作和目标。例如：“fix issue with...” 而不是 “fixed issue with...”。

示例：

```plaintext
feat(auth): add JWT token validation
```

### 5. 提交正文（optional body）

提交正文可以用来详细解释提交的变更，尤其是复杂的变更。这部分是可选的，但在进行复杂修改或重构时非常有用。正文应提供足够的信息，以便团队成员或未来的开发人员可以理解为什么进行这些变更。

- 示例：

```plaintext
feat(payment): add support for credit card payments

This feature adds the ability for users to pay using credit cards. It integrates with the Stripe API for processing payments.
```

### 6. 脚注（optional footer)

脚注部分通常用于：

- **关联问题追踪系统**：如关闭某个 issue。
- **声明破坏性变更**：如引入了非向后兼容的变更。

#### 6.1  关联问题

你可以使用脚注部分来关联提交和某个问题（issue），例如关闭一个问题：

**示例**：

```plaintext
fix(auth): correct password validation error

Closes #123
```

#### 6.2 声明破坏性变更

如果这次提交包含了破坏性变更（不向后兼容），需要在脚注部分明确指出：

**示例**：

```plaintext
feat: refactor authentication logic

BREAKING CHANGE: The authentication service has been updated to use JWT. The old session-based authentication has been removed, and all clients will need to update their login flow.
```



## 参考

- Conventional Commits：https://www.conventionalcommits.org/en/v1.0.0/

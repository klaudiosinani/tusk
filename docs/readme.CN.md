<h1 align="center">
  <img src="docs/media/logo.png" width="18%"><br/>Tusk
</h1>

<h4 align="center">
  精致的印象笔记桌面应用
</h4>

<div align="center">
  <a href="https://github.com/klaussinani/tusk">
    <img src="docs/media/note-navigation.gif" alt="Tusk" width="95%">
  </a>
</div>

<p align="center">
  <a href="https://travis-ci.org/klaussinani/tusk">
    <img alt="Build Status" src="https://travis-ci.org/klaussinani/tusk.svg?branch=master">
  </a>
</p>

## 简介

Tusk 是一款独具特色的非官方、社区驱动、免费开源的印象笔记（Evernote）应用，已经成为超过[140个国家 countries](https://snapcraft.io/tusk)用户的选择。

Tusk [被印象笔记称为](https://help.evernote.com/hc/en-us/articles/208313748-Evernote-on-Linux)一款可供选择的、被开源社区信任的 Linux 客户端。

现在可以通过 [GitHub Sponsors](https://github.com/sponsors/klaussinani) 来支持我们的开发过程。

欢迎到 [Gitter](https://gitter.im/klaussinani/tusk) 或 [Twitter](https://twitter.com/klaussinani) 分享你关于本项目的想法。

请查看 [contributing guidelines](https://github.com/klaussinani/tusk/blob/master/contributing.md#translating-documentation) 了解更多关于翻译本文的事项。

你在[这里](#相关应用)发现更多应用。

## 亮点

- 黑色、暗色、Sepia主题
- 聚焦模式，紧致模式，自动夜间模式
- 自定义本地和全局快捷键
- 导出为 PDF, HTML 和 Markdown 文档
- 笔记导航栏
- 支持印象笔记
- 多平台
- 可缩放界面
- 更新通知
- 拖拽添加附件

## 内容

- [简介](#简介)
- [亮点](#亮点)
- [安装](#安装)
- [特征](#特征)
- [快捷键](#快捷键)
- [开发](#开发)
- [相关应用](#相关应用)
- [团队](#团队)
- [免责声明](#免责声明)
- [许可](#许可)

## 安装

#### Github Releases

前往 [releases](https://github.com/klaussinani/tusk/releases/latest) 页面下载适合您系统的安装包。

#### Snapcraft

Ubuntu Linux 用户可直接通过 [Snapcraft](https://snapcraft.io/tusk) `snap install tusk` 安装。

#### Homebrew

Macos users 用户可直接通过 [Homebrew Cask](https://caskroom.github.io/) `brew cask install tusk` 安装。

#### 注意

在 `Homebrew Cask` 的版本可能不是最新的, 因为与 `Snapcraft`不同, 它没有被官方维护. 如果您发现在 `Homebrew Cask` 的版本不是最新版，请考虑直接从 [Github releases](https://github.com/klaussinani/tusk/releases/latest) 页面下载。


## 特征

访问[项目主页](https://klaussinani.github.io/tusk)浏览所有特征的细节。


- 自动夜间模式 - 使用 <kbd>Cmd/Ctrl</kbd> <kbd>Alt</kbd> <kbd>N</kbd> 允许 Tusk 自动调节你的模式.
- 黑色主题 - 使用 <kbd>Cmd/Ctrl</kbd> <kbd>Alt</kbd> <kbd>E</kbd> 开启
- 紧致模式 - 取消最大化窗口即可计入紧致模式。
- 自定义快捷键 - 前往 `~/.tusk.json` 或使用 <kbd>Cmd/Ctrl</kbd> <kbd>.</kbd> 来更改任意快捷键。如果想要重置快捷键，删除 `~/.tusk.json` 或重启应用。
- 暗色主题 - 使用 <kbd>Cmd/Ctrl</kbd> <kbd>D</kbd> 开启
- 拖拽添加附件 - 通过拖拽文件至窗口添加附件
- 导出为 Markdown - 使用 <kbd>Cmd/Ctrl</kbd> <kbd>O</kbd> 将你的笔记保存为 `Markdown` 文档。
- 导出为 HTML - 使用 <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>H</kbd> 将你的笔记保存为 `HTML` 文档。
- 导出为 PDF - 使用 <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>E</kbd> 将你的笔记保存为 `PDF` 文档。
- 聚焦模式 - 使用 <kbd>Cmd/Ctrl</kbd> <kbd>K</kbd> 开启
- 全局快捷键 - 通过 `File` > `Enable Global Shortcut Keys` 选项启用全局快捷键.
- 笔记导航栏 - 使用 <kbd>Cmd/Ctrl</kbd> <kbd>Tab</kbd> / <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>Tab</kbd> 浏览笔记，或通过 <kbd>Cmd/Ctrl</kbd> <kbd>1</kbd> - <kbd>9</kbd> 跳转至某个笔记
- 打印笔记 - 使用 <kbd>Cmd/Ctrl</kbd> <kbd>Alt</kbd> <kbd>P</kbd> 打印你的笔记。
- 可缩放界面 - 使用 <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>=</kbd> 或 <kbd>Cmd/Ctrl</kbd> <kbd>-</kbd> 调节缩放比例
- Sepia 主题- 使用 <kbd>Cmd/Ctrl</kbd> <kbd>G</kbd> 开启。
- 更新通知 - 自定义软件检查更新频率。
- 印象笔记支持 - 可以登录印象笔记，请选择 `File` > `Switch to Yinxiang`.

## 快捷键

### 本地快捷键

70+ 本地快捷键，一秒切换到任意界面。

<details>
<summary>查看所有可用的本地快捷键.</summary>

<br/>

描述                | 按键
-------------------------- | --------------------------
开启夜间模式                | <kbd>Cmd/Ctrl</kbd> <kbd>Alt</kbd> <kbd>N</kbd>
添加链接                   | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>K</kbd>
添加快捷键               | <kbd>Cmd/Ctrl</kbd> <kbd>Alt</kbd> <kbd>S</kbd>
居中对齐               | <kbd>Cmd/Ctrl</kbd> <kbd>Alt</kbd> <kbd>M</kbd>
靠左对齐                 | <kbd>Cmd/Ctrl</kbd> <kbd>Alt</kbd> <kbd>L</kbd>
靠右对齐                | <kbd>Cmd/Ctrl</kbd> <kbd>Alt</kbd> <kbd>R</kbd>
添加附件                | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>F</kbd>
粗体                  | <kbd>Cmd/Ctrl</kbd> <kbd>B</kbd>
斜体               | <kbd>Cmd/Ctrl</kbd> <kbd>I</kbd>
下划线             | <kbd>Cmd/Ctrl</kbd> <kbd>U</kbd>
删除线         | <kbd>Cmd/Ctrl</kbd> <kbd>T</kbd>
无序列表              | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>.</kbd>
有序列表              | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>O</kbd>
更改字体大小           | <kbd>Cmd/Ctrl</kbd> <kbd>Alt</kbd> <kbd>1</kbd> - <kbd>6</kbd>
代码块                 | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>L</kbd>
减小缩进       | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>M</kbd>
增加缩进       | <kbd>Cmd/Ctrl</kbd> <kbd>Alt</kbd> <kbd>K</kbd>
删除笔记                | <kbd>Delete</kbd>
编辑快捷键         | <kbd>Cmd/Ctrl</kbd> <kbd>.</kbd>
导出笔记为 HTML         | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>H</kbd>
导出笔记为 Markdown    | <kbd>Cmd/Ctrl</kbd> <kbd>O</kbd>
导出笔记为 PDF         | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>E</kbd>
插入日期          | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>;</kbd>
插入日期-时刻     | <kbd>Cmd/Ctrl</kbd> <kbd>;</kbd>
通过硬盘插入          | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>D</kbd>
插入水平分割线     | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>-</kbd>
跳转至笔记               | <kbd>Cmd/Ctrl</kbd> <kbd>1</kbd> - <kbd>9</kbd>
增大字号           | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>=</kbd>
减小字号          | <kbd>Cmd/Ctrl</kbd> <kbd>-</kbd>
导航至下一条笔记      | <kbd>Cmd/Ctrl</kbd> <kbd>Tab</kbd>
导航至上一条笔记  | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>Tab</kbd>
新建笔记                  | <kbd>Cmd/Ctrl</kbd> <kbd>N</kbd>
新建笔记本               | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>N</kbd>
新建标签                    | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>T</kbd>
打印笔记                 | <kbd>Cmd/Ctrl</kbd> <kbd>Alt</kbd> <kbd>P</kbd>
清除格式          | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>Space</kbd>
重置缩放笔记           | <kbd>Cmd/Ctrl</kbd> <kbd>0</kbd>
回到笔记            | <kbd>Esc</kbd>
保存笔记                  | <kbd>Cmd/Ctrl</kbd> <kbd>S</kbd>
搜索笔记               | <kbd>Cmd/Ctrl</kbd> <kbd>F</kbd>
置顶          | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>P</kbd>
设置提醒               | <kbd>Cmd/Ctrl</kbd> <kbd>E</kbd>
下标             | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>]</kbd>
上标           | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>[</kbd>
黑色主题         | <kbd>Cmd/Ctrl</kbd> <kbd>Alt</kbd> <kbd>E</kbd>
暗色主题          | <kbd>Cmd/Ctrl</kbd> <kbd>D</kbd>
Sepia 主题       | <kbd>Cmd/Ctrl</kbd> <kbd>G</kbd>
聚焦模式          | <kbd>Cmd/Ctrl</kbd> <kbd>K</kbd>
切换笔记本           | <kbd>Alt</kbd> <kbd>Shift</kbd> <kbd>N</kbd>
勾选复选框            | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>B</kbd>
设置            | <kbd>Cmd/Ctrl</kbd> <kbd>,</kbd>
设置快捷键           | <kbd>Cmd/Ctrl</kbd> <kbd>Shift</kbd> <kbd>S</kbd>
侧边栏             | <kbd>Cmd/Ctrl</kbd> <kbd>\\</kbd>
标签                | <kbd>Alt</kbd> <kbd>Shift</kbd> <kbd>T</kbd>
打开窗口菜单         | <kbd>Alt</kbd>


<br/>

</details>

### 全局快捷键


从任何位置打开 Tusk。通过修改配置文件`~/.tusk.json`，所有全局快捷键都可以按照您的喜好设置。

<details>
<summary>查看所有可用的全局快捷键</summary>

<br/>

描述                       | 全局快捷键
-------------------------- | --------------------------
切换到 Tusk                 | <kbd>Cmd/Ctrl</kbd> <kbd>Alt</kbd> <kbd>A</kbd>
创建新笔记                  | <kbd>Cmd/Ctrl</kbd> <kbd>Alt</kbd> <kbd>C</kbd>
搜索笔记                    | <kbd>Cmd/Ctrl</kbd> <kbd>Alt</kbd> <kbd>F</kbd>

<br/>

</details>

## 开发

想要知道如何为本项目做出贡献，请阅读 [contributing guidelines](https://github.com/klaussinani/tusk/blob/master/contributing.md).

- Fork the repository and clone it to your machine
- Navigate to your local fork: `cd tusk`
- Install the project dependencies: `npm install` or `yarn install`
- Run Tusk on dev mode: `npm start` or `yarn start`
- Lint code for errors: `npm test` or `yarn test`
- Build binaries and installers: `npm run release` or `yarn release`

## 相关应用

- [Ao](https://github.com/klaussinani/ao) - 优雅的微软桌面待办清单应用。
- [Taskbook](https://github.com/klaussinani/taskbook) - 任务，板块和笔记都在命令行这个栖息地。

## 开发团队

- Klaus Sinani [(@klaussinani)](https://github.com/klaussinani)
- Mario Sinani [(@mariosinani)](https://github.com/mariosinani)
- Thanasis Gkanos [(@ThanasisGkanos)](https://github.com/ThanasisGkanos)

## 免责声明

Tusk is an unofficial, open source, third-party, community-driven, free app and is not affiliated in any way with Evernote.

## 授权协议

[MIT](https://github.com/klaussinani/tusk/blob/master/license.md)

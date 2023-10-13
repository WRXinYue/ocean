# 更改为基于rust的测试分支

## 如何运行?
~~~
yarn tauri info # 检查相关配置
yarn
yarn tauri dev
~~~

## 包目录结构

~~~text
├── README.md
├── dist                 - web 项目打包编译目录
│   ├── assets
│   ├── favicon.ico
│   └── index.html
├── index.html         
├── node_modules
├── package.json
├── public
│   └── favicon.ico
├── src                  - vue 项目目录（页面开发）
│   ├── App.vue
│   ├── assets
│   ├── components
│   ├── env.d.ts
│   └── main.ts
├── src-tauri            - rust 相关目录（tauri-api 相关配置）
│   ├── Cargo.lock
│   ├── Cargo.toml       - rust 配置文件
│   ├── build.rs
│   ├── icons            - 应用相关的 icons
│   ├── src              - rust 入口
│   ├── target           - rust 编译目录
│   └── tauri.conf.json  - tauri 相关配置文件
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── yarn.lock
~~~

## 开发者工具

### vscode扩展

* Rust Analyzer
* CodeLLDB
* Crates
* Better TOML
* Rust Test Explorer
* REST Client

## 技术选型

Electron
Rust
Vue

Click on the Tauri, Vite, and Vue logos to learn more.

Recommended IDE setup: VS Code + Volar + Tauri + rust-analyzer

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

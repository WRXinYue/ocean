# OceanBlog demo for rust

> 本项目采用混合(hybrid)技术，实现跨平台的应用开发。这次我选择了Rust —— 更快🚀更强💪

本次测试采用Tauri框架，并使用了Vue.js作为前端框架，它与Rust和Tauri高度匹配，能够实现组件化的应用开发。

我不希望过大的服务影响用户的部署及体验，让人人都能进行本地管理文章和线上查看。实现多功能可扩展的高性能轻量级博客系统。

期盼通过这个Demo，能展示出Rust、Tauri与Vue.js在现代应用开发中无限的可能性，让每位追求卓越和高效的开发者都能感受到这种混合技术带来的奇妙体验。

* 使用MongoDB替代关系型数据库，用来处理复杂和不规则的数据结构的数据。
* 使用Neo4j实现知识图谱存储并用ELK(Elasticsearch)来加速搜索和分析

<div align="center" style="witdh:100%"> 
  <table>
    <tr>
      <td valign="center" width="100px"><b>WebFrontend<b></td>
      <td valign="center" width="100px"><b>WebBackend<b></td>
      <td valign="center" width="100px"><b>Other Tools<b></td>
    </tr>
    <tr>
      <td valign="center" align="center" width="300px">
        <img height="20" src="https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D" alt="Vue.js" />
        <img height="20" src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
        <img height="20" src="https://img.shields.io/badge/netlify-%23000000.svg?style=for-the-badge&logo=netlify&logoColor=#00C7B7" alt="Netlify" />
        <img height="20" src="https://img.shields.io/badge/unocss-333333.svg?style=for-the-badge&logo=unocss&logoColor=white" alt="UnoCSS" />
        <img height="20" src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
        <img height="20" src="https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white" alt="SASS" />
      </td>      
      <td valign="center" align="center" width="300px">
        <img height="20" src="https://img.shields.io/badge/tauri-%2324C8DB.svg?style=for-the-badge&logo=tauri&logoColor=%23FFFFFF" alt="blender" />
        <img height="20" src="https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white" alt="Rust" />
      </td>
      <td valign="center" align="center" width="300px">
        <img height="20" src="https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white" alt="Eslint" />
        <img height="20" src="https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E" alt="Eslint" />
        <img height="20" src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="node" />
        <img height="20" src="https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220" alt="PNPM" />
      </td>
    </tr>
  </table>
</div>

## Dev Tools

* Rust Analyzer
* CodeLLDB
* Crates
* Better TOML
* Rust Test Explorer
* REST Client

Recommended IDE setup: [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

Frontend framework source：https://github.com/WRXinYue/vite-template


## How ro run?

pnpm tauri info # 检查相关配置

~~~
pnpm install
pnpm tauri dev
~~~

## Directory structure

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
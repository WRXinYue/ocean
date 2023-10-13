# 更改为基于rust的测试分支

## How ro run?

yarn tauri info # 检查相关配置

~~~
yarn
yarn tauri dev
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

## Dev Tools

* Rust Analyzer
* CodeLLDB
* Crates
* Better TOML
* Rust Test Explorer
* REST Client


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
        <img height="20" src="https://img.shields.io/badge/yarn-%232C8EBB.svg?style=for-the-badge&logo=yarn&logoColor=white" alt="Yarn" />
      </td>
    </tr>
  </table>
</div>

Recommended IDE setup: [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

Frontend framework source：https://github.com/WRXinYue/vite-template


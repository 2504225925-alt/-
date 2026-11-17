# 智慧养老服务平台

面向智慧养老场景的响应式静态 Web 原型，包含机构管理端和患者/家属服务端。页面中的人员与健康指标均为演示数据，不接入真实医疗服务或身份认证。

## 技术与架构

- HTML5、CSS3、原生 JavaScript，无前端框架和运行时后端依赖。
- 管理端以独立 HTML 页面呈现，共用 `styles.css` 与 `script.js`。
- 患者端使用独立的 `patient.css`，适配桌面和移动浏览器。
- 登录页按患者/家属、管理者角色跳转；这只是界面演示，不是安全认证。

## 页面导航

- `login.html`：登录与角色选择
- `patient.html`：患者/家属首页、健康记录概览、服务安排与提醒
- `index.html`：管理端运营总览
- `elderly.html`：老人档案
- `health.html`：健康监测
- `service.html`：服务工单
- `equipment.html`：设备管理
- `alarm.html`：报警中心
- `report.html`：报表统计

## 环境与运行

### 静态运行（无需安装依赖）

要求：现代浏览器。推荐 Python 3.8 或更高版本用于启动本地静态服务器。

```bash
python3 -m http.server 8000
```

Windows 可运行：

```powershell
py -m http.server 8000
```

访问 `http://localhost:8000/login.html`。直接双击 HTML 文件也可查看页面，但本地 HTTP 服务通常能提供更一致的浏览器行为。

### 开发工具（可选）

格式检查与本地开发服务器使用 Node.js 18+ 和 npm；这些工具仅供开发，不是网页运行时依赖。

```bash
npm install
npm run format:check
npm run dev
```

`npm run dev` 启动静态服务器后访问 `http://localhost:8000/login.html`。格式化所有源文件可运行 `npm run format`。

## 环境变量与依赖

- 网页运行不需要 `.env` 文件、API 密钥或环境变量；` .env.example`（如存在）仅用于说明开发环境，不得填入密钥。
- 静态网页运行时没有 npm 依赖。
- `package.json` 中的开发依赖仅用于格式校验和本地预览服务器；npm 安装依赖会生成 `package-lock.json`，团队提交锁文件以保证工具版本一致。
- Google Fonts 仅用于字体增强；无法联网时使用系统字体回退。

## 代码规范

- 使用 UTF-8、LF 换行和 2 个空格缩进，配置见 `.editorconfig`。
- HTML 使用语义化标签，表单控件提供可访问名称；CSS 规则与 JavaScript 语句按 Prettier 配置格式化。
- JavaScript 使用 `const` / `let`、单引号和分号；为页面交互增加必要的空值保护，避免在不包含该模块的页面报错。
- 提交前运行 `npm run format:check`；提交时使用清晰、简短的变更说明。

## 数据与安全说明

所有健康数据、人员信息和运营数字都是模拟展示数据，不能用于诊断、治疗或紧急响应。原型登录仅做页面跳转，不提供真实身份验证、权限控制或数据存储。遇到紧急情况请联系家属或当地急救服务。

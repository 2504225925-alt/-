# 智慧养老服务平台

这是一个面向智慧养老/智慧医疗场景的响应式 Web 应用原型，分别提供管理者后台与患者/家属服务端。

## 使用方式

在项目根目录运行：

```bash
python3 -m http.server 8000
```

访问 `http://localhost:8000/login.html`。登录页可切换“患者 / 家属”与“管理者”身份：患者进入 `patient.html`，管理者进入 `index.html`。此处为前端演示，不提供真实身份验证或医疗数据服务。

## 功能页面

- `login.html` / `login.css`：居中登录卡片和双角色入口
- `patient.html` / `patient.css`：患者与家属首页，提供健康记录概览、服务预约、日常提醒和求助入口；移动端有底部导航
- `index.html`：机构运营总览
- `elderly.html`：老人档案管理
- `health.html`：健康监测中心
- `service.html`：服务工单
- `equipment.html`：设备管理
- `alarm.html`：报警中心
- `report.html`：报表统计
- `styles.css`：管理者端样式
- `script.js`：前端演示交互

## 注意

页面中的健康指标和人员信息均为演示数据，不应作为诊断或治疗依据。紧急情况请联系家属或当地急救服务。本原型的登录仅用于角色页面跳转，并非安全认证。

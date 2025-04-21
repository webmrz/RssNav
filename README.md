# RssNav - Chrome 扩展

一个基于 Vue 3、TypeScript 和 Vite 构建的现代化 Chrome 扩展，提供强大且用户友好的导航体验。

## 🚀 功能特性

- 现代化的 Vue 3 + TypeScript + Vite 开发栈
- 使用 Pinia 进行状态管理，支持数据持久化
- 采用 Element Plus 和 Naive UI 构建美观的界面组件
- 使用 SASS 进行样式管理
- 支持 PWA（渐进式网页应用）
- 完整的 Chrome 扩展功能支持

## 🖼️ 截图展示

<div align="center">
  <img src="screenshots/002.png" alt="首页" width="400">
  <p>首页</p>
</div>

<div align="center">
  <img src="screenshots/settings-page.png" alt="设置页面" width="600">
  <img src="screenshots/settings-page2.png" alt="设置页面" width="600"> 
  <p>设置页面</p>
</div>

<!-- 导航配置 -->
<div align="center">
  <img src="screenshots/001.png" alt="设置页面" width="600">
  <img src="screenshots/003.png" alt="设置页面" width="600"> 
  <p>导航切换、配置</p>
</div>

<div align="center">
  <img src="screenshots/006.png" alt="设置页面" width="600"> 
  <p>待办</p>
</div>

<div align="center">
  <img src="screenshots/004.png" alt="设置页面" width="600"> 
  <p>便签</p>
</div>

## 🛠️ 技术栈

- **前端框架**：Vue 3
- **开发语言**：TypeScript
- **构建工具**：Vite
- **状态管理**：Pinia（支持数据持久化）
- **UI 组件库**：Element Plus、Naive UI
- **样式处理**：SASS
- **API 客户端**：Axios
- **开发工具**：ESLint、Prettier、TypeScript

## 📦 安装说明

1. 克隆项目仓库
2. 安装依赖：
```bash
pnpm install
```

## 🚀 开发指南

- 启动开发服务器：
```bash
pnpm dev
```

- 构建生产版本：
```bash
pnpm build
```

- 构建 Chrome 扩展：
```bash
pnpm build:extension
```

- 代码格式化：
```bash
pnpm format
```

- 代码检查：
```bash
pnpm lint
```

- 类型检查：
```bash
pnpm type-check
```

## 🔧 项目结构

```
├── src/            # 源代码目录
├── public/         # 静态资源目录
├── scripts/        # 构建和工具脚本
├── dist/           # 构建输出目录
├── vite.config.ts  # Vite 配置文件
├── package.json    # 项目依赖配置
└── tsconfig.json   # TypeScript 配置文件
```

## 🧪 测试

项目包含以下测试和检查：
- TypeScript 类型检查
- ESLint 代码质量检查
- Prettier 代码格式化

## 📝 许可证

本项目采用 MIT 许可证 - 详见 LICENSE 文件。

## 🤝 贡献指南

欢迎贡献代码！请随时提交 Pull Request。
 

## 💡 常见问题

1. 开发环境配置问题
2. 数据持久化问题
3. 跨域通信问题
4. 性能优化问题

## 🔍 调试指南

1. 打开 Chrome 扩展程序页面（chrome://extensions/）
2. 开启开发者模式
3. 加载已解压的扩展程序

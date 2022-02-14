# 组件库项目设计
## 组成要素
- 文档（包括示例，具体展现方式(网站、小程序)视项目而定）
- 测试
- 源码 
- 按需引入
- 跨端使用（借助一些工具实现，如webpack、gulp？）

## 微众银行vue3 PC组件库
```
- components
-- AComponent
---- __tests__
---- style
---- index.ts
---- AComponent.tsx
-- index.ts
-- style.ts
- docs
- scripts
- README.md
- ... [配置文件]
```

其中，采用ts+vue3开发，测试使用功能jest，文档使用vitepress，包管理使用pnpm

## AntDesign

## Element

## Vant
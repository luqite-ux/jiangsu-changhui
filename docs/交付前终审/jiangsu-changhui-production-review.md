# 江苏昌晖电气正式域名 Production 交付终审

- 日期：2026-07-31
- 结论：`DONE_WITH_CONCERNS`（正式域名主链路已完成；共享后台退出按钮依赖另案处理）
- 客户仓库：`D:\Cursor\Grand\jiangsu-changhui`
- GitHub：`https://github.com/luqite-ux/jiangsu-changhui`
- tenant：`0f4f3ffa-9a1b-468f-8408-2f59a3b64e45`
- Vercel 项目：`jiangsu-changhui`
- Production canonical：`https://changhuielectrical.com`
- 正式域名：`https://changhuielectrical.com`（`www` 308 到裸域）
- 客户邮箱/后台账号：`info@changhuielectrical.com`

## 强制结论

本次已完成客户专属代码、Vercel、Cloudflare DNS、tenant domain、正式管理员、42 条 sitemap 路由、正式域名 SEO 和飞书 A–L 闭环。营业执照与 Supabase 均确认正式中文主体为“江苏昌晖电气有限公司”。未修改、提交、推送或部署 `huanqiu-admin`，未操作任何其他 tenant、Cloudflare zone 或 Vercel 项目。唯一遗留为共享后台 Sidebar 的 Server Action 退出按钮在代理域名发出 `POST /admin/products` 后返回 500；客户站本地 `GET /admin/logout` 已验证可 303 清除双 Cookie，该共享依赖必须另开公共后台任务处理。

## 1. Vercel、GitHub 与部署

- [x] PASS：Vercel 项目严格为 `jiangsu-changhui`（`prj_MMIL7hZYhofpJVAD9VuxExyFSzbp`）。
- [x] PASS：正式域名代码 commit `9e499d12c3aeb59864fa3bc8106e70a31c244e4c` 已 fast-forward 推送到 `luqite-ux/jiangsu-changhui` 的 `main`。
- [x] PASS：Git 集成 Production deployment `dpl_73WCLMhSzGccefzsVzeHUmbPJu1P` 为 `READY`，构建 URL 为 `https://jiangsu-changhui-eexk1979z-huanqiu.vercel.app`，aliases 同时包含裸域、www 与 `jiangsu-changhui.vercel.app`。
- [x] PASS：Git Source 为 `github / luqite-ux / jiangsu-changhui`，Production branch 为 `main`。
- [x] PASS：以下五个环境变量各只有一条 Vercel 记录，且 target 均覆盖 `development, preview, production`；验证过程中未输出值：
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_TENANT_ID`
  - `NEXT_PUBLIC_ADMIN_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
- [x] PASS：客户代码 commit `190aad89d6b47fea1e3f1045ff4e634dd183202b` 已用受控 token 验证身份为 `luqite-ux` 后 fast-forward 推送。
- [x] PASS：本地 HEAD、`origin/main` 和 Production commit 均为 `190aad8`。
- [x] PASS：Production deployment `dpl_HSTZye5h7QFNGznD94g5MuvboJr4` 为 `READY`，URL 为 `https://jiangsu-changhui-2o7p0nx54-huanqiu.vercel.app`。
- [~] NOTE：自动 Git 部署 `dpl_12dvnNtoqY8buBEGhoszjyJgZ8Bj` 首次因 Supabase 请求导致 `/products`、`/news`、`/sitemap.xml` 静态生成连续 60 秒超时而失败；相同 SHA 的零代码重部署随后 `READY`，证明是瞬时上游可达性异常，并非本次 metadata 代码编译失败。

## 2. Task 6 延后小项

- [x] PASS：按 TDD 新增 noindex metadata 行为，后台登录、404、无效产品和无效文章不再继承首页 canonical、Open Graph 或 Twitter 标签。
  - RED：`node --test tests/seo-contract.test.mjs` 为 7 pass / 2 fail，两个 helper 均不存在。
  - GREEN：目标测试 8/8；全量最终为 38/38。
  - 线上：`/admin/login` 为 `noindex, nofollow`，404 为 `noindex`；两者 canonical 与 `og:url` 均为空。
- [x] PASS：产品详情 title 改用完整唯一产品名的 absolute title，不再叠加品牌模板；description 在保留完整产品名与事实开头的同时限制为 160 字符以内。
- [x] PASS：42 URL crawl 中产品 title 超过 60 字符为 0，产品 description 超过 160 字符为 0。

## 3. 产品与文章在线可逆闭环

- [x] PASS：产品 `kyn61-40-5`（ID `1a0e66e3-016f-4950-8c59-dc0d0d05f73f`）仅在指定 tenant 的 `description_en` 追加 `[CODEX TEST 2026-07-31]`。
- [x] PASS：Production 产品详情真实出现 marker；随后同一行恢复原值，Production 页面确认 marker 消失。
- [x] PASS：文章 `welcome-to-jiangsu-changhui-electric`（ID `14ab13bd-ee76-4f9f-a8fd-a475150e8cd6`）仅在指定 tenant 的 `title_en` 追加同一 marker。
- [x] PASS：Production 新闻列表和详情同时出现 marker；随后同一行恢复原值，两页确认 marker 消失。
- [x] PASS：终态 service-role 回读确认产品和文章均不含 marker。

## 4. 询盘闭环

- [x] PASS：使用真实 Playwright 浏览器在 `https://jiangsu-changhui.vercel.app/contact` 填写姓名、邮箱、电话、公司、国家、产品、留言和隐私同意。
- [x] PASS：唯一标识为 `JC-INQUIRY-20260731-TASK7-001`；网络记录显示真实 `POST /rest/v1/inquiries` 返回 HTTP 201。
- [x] PASS：页面显示绿色 `Inquiry sent successfully`，且全部输入、下拉和隐私勾选均清空。
- [x] PASS：service-role 按 tenant + 唯一邮箱 + 唯一 message 回读恰好一行；tenant、姓名、邮箱、电话、公司、subject、国家、产品、隐私同意、唯一标识、状态共 11 项全部匹配。
- [x] PASS：仅删除本次测试询盘 ID `4bf786b1-7fb0-43be-8ac4-6050de816bae`；删除后原始 REST 响应为 `[]`。
- [x] PASS：提交会话控制台 0 errors / 0 warnings；成功态截图保存在 `output/playwright/inquiry/contact-success-desktop.png`，trace 保存在本地 `.playwright-cli/traces/`。
- [x] PASS：目标邮箱全局唯一且该 tenant 原有管理员为 0；已创建管理员 `e185d38e-56c4-4a19-84b9-5c312c44cec3`，账号 `info@changhuielectrical.com`，bcrypt 与初始交付密码匹配。
- [x] PASS：正式域名真实登录返回 303 到 `/admin`，`hq_admin_session` 与 `hq_tenant_id` 均为 `HttpOnly; Secure; SameSite=Lax; Path=/`，tenant Cookie 精确匹配 `0f4f3ffa-9a1b-468f-8408-2f59a3b64e45`；后台概览、菜单与产品列表 27 条均可访问。
- [x] PASS：客户本地 `GET /admin/logout` 返回 303 到 `/admin/login` 并清除两个 Cookie；验证会话已清理，数据库剩余测试 session 为 0。
- [~] CONCERN：共享 Sidebar“退出登录”按钮仍调用共享 Server Action，线上日志显示 `POST /admin/products` 500；修复需改共享 `huanqiu-admin` allowed-origins/公共退出实现，按客户任务边界未夹带处理。

## 5. 42 URL、视觉与 SEO

- [x] PASS：`/sitemap.xml` HTTP 200，含 42 条 URL；Playwright 完整 crawl 为 42/42，route issue 为 0。
- [x] PASS：正式域名 `/robots.txt` 与 `/sitemap.xml` 均 200；sitemap 42 条 URL 全部统一为 `changhuielectrical.com`，42/42 返回 200，canonical 与 `og:url` 逐项一致，JSON-LD 均可解析，19 个唯一 OG 图片 19/19 可访问。
- [x] PASS：`https://www.changhuielectrical.com/products?source=codex&keep=1` 返回 308 到裸域并完整保留路径和查询；HTTP 到 HTTPS 同样 308，TLS 请求成功。
- [x] PASS：42 个 title 全部唯一，42 个 description 全部唯一。
- [x] PASS：全部公开路由 HTTP 200，canonical 与 `og:url` 对应 sitemap URL；公开页无 noindex。
- [x] PASS：JSON-LD 全部可解析；Organization、Product/NewsArticle 和 BreadcrumbList 按页面类型存在。
- [x] PASS：OG 图片失败 0、破图 0、h1 异常 0、横向溢出 0、page error 0。
- [x] PASS：浏览器控制台仅在刻意访问的 404 页面记录两条预期 404 resource error；42 条公开 sitemap 路由没有阻断性 console error。
- [x] PASS：生成全部 27 个产品详情和 1 个新闻详情桌面全页截图，共 28 张。
- [x] PASS：13 类页面模板（含首页、静态页、列表、分类、产品详情、新闻详情、联系、404、后台登录）分别生成 13 张桌面和 13 张手机截图。
- [ ] NOT RUN：未追加 Lighthouse/axe；在完成 42 URL crawl 与 54 张审计截图后按协调指令停止扩展范围。现有源码对比度合约测试与浏览器破图/溢出检查通过，但这一项不能伪报为已执行。

## 6. 自动化验证

- [x] PASS：`pnpm test` → 59/59。
- [x] PASS：`pnpm exec tsc --noEmit` → exit 0。
- [x] PASS：`pnpm build` → exit 0；Next.js 16.2.6 Production build 完成。
- [x] PASS：`git diff --check` / `git diff --cached --check` → exit 0。
- [~] NOTE：build 保留 Next.js 16 对 `middleware` 文件约定弃用的既有警告，本次未扩大范围改写后台代理架构。

## 7. 正式域名、DNS 与飞书收尾

- [x] PASS：Vercel 已绑定 `changhuielectrical.com` 和 `www.changhuielectrical.com`。
- [x] PASS：Cloudflare zone `f51a4c6cf52c59a1c12a7f2e0ccb6461` 仅新增两条 DNS-only A 记录到 Vercel 推荐值 `76.76.21.21`：裸域记录 `c60d142d9a3e0effa94e6e961b496e5b`、www 记录 `402169ac79130a6ca3ef7f2dd501a2b2`。原有 2 条 MX、apex TXT、DMARC、DKIM 与 3 条邮件 CNAME 均未修改。
- [x] PASS：tenant `domain/email` 已更新为 `changhuielectrical.com` / `info@changhuielectrical.com`；正式中文名仍为营业执照原文“江苏昌晖电气有限公司”。
- [x] PASS：飞书 `1ae2e0!A11:L11` 已新增后原位修正并 API 回读；共 12 列、同名唯一一行，D/E/F/I 链接文本正确，J 为正式账号，K 匹配实际交付密码，L 为 `Supabase / 0f4f3ffa-9a1b-468f-8408-2f59a3b64e45`，无 `[object Object]`。
- [x] PASS：最终 v0 来源为 `https://v0.app/huanqiu/chat/s5zQJrFY4S8`；GitHub、Vercel、正式域名、后台地址与本机绝对路径均已写入飞书。

## 终审结论

`DONE_WITH_CONCERNS`。正式域名、DNS、GitHub、Production、tenant、管理员、真实登录、Cookie、42 URL SEO、图片与飞书 A–L 均有新鲜证据；所有测试 session 已清理。共享 Sidebar 退出按钮的跨域 Server Action 500 是唯一遗留，并已被严格隔离为共享后台公共改动，不得在本客户任务中修改或部署 `huanqiu-admin` Production。

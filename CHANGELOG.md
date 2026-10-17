# 更新记录

这里记**面向使用者**的变化：要不要升级、升级能解决什么。逐条 commit 的过程看
`git log`（每条说明都写得比较长），已知的坑看 [`docs/pitfalls.md`](./docs/pitfalls.md)
与 [`docs/windows.md`](./docs/windows.md)。

## [0.4.2] — 2026-10-18

### 优化 / 更新

**预设工具行对齐 DSH 0.2.1-rc.2（建议升级）**

- 「德谬歌工作模式」的工具行重新从 `@deepseek-ai/dsh-web-app/presets/standard.patch.yml`
  同步：补上 `time-context` / `tool-schedule` / `workflow-ptc` / `tool-plugin-manager` /
  `tool-plugin-market`；移除上游已删的 `workflow-worker-thread` / `tool-ralph` 与
  两个可选 subagent provider 行。之前的抄本停留在更早的 standard —— **不会报错，
  只是少挂 / 多挂工具**，现在由 CI 的 `drift` job 每次对照基线检查。

**抄本漂移护栏终于真的在 CI 跑**

- `tests/preset.test.mjs` 原来要从 DSH 安装处解析 `@deepseek-ai/dsh-agent-presets`
  （0.1.x 的包名），在 0.2.x 上永远 skip。现在按版本解析
  `dsh-web-app/presets/standard.patch.yml`，并新增 `drift` job 安装
  `@deepseek-ai/dsh-web-app@0.2.1-rc.2` 做对照。

**世界书配置 / 数据热更新**

- `cyrene-worldbook.json` 改为最多 2 秒重读一次，改 `dir` / `enabled` / `maxActive`
  不用重启 DSH。
- 世界书数据改为按文件 mtime + size 签名缓存：改完下一轮立即重新解析，不再等 30 秒 TTL。
- 配置字段归一化并夹取（`maxActive` 1–50、`scanDepth` 1–5），写错类型不会带崩插件。

**其它**

- `nickname.js` 按 mtime + size 缓存昵称文件，不再每轮装配都读盘。
- `install.sh` / `install.mjs` 开头加横幅：0.4.0+ 不需要它们，只用于 0.1.x。
- 移除 `plugin.json` / `dsh.plugin.json` 里 DSH 不读取的 `contributes` 字段，
  避免误以为它会二次注册预设。
- `docs/pitfalls.md` 不再写死 DSH 内部行号；`docs/windows.md` 标注 0.1.x–0.3.x 历史背景。
- 新增测试：`tests/config.test.mjs`（配置归一化 / 目录签名）、`tests/nickname.test.mjs`
  （昵称清洗）。
- 文档不再写死测试条数，避免每次加测试都要改多处。

## [0.4.1] — 2026-10-18

### 变更

**两套预设改名**

- 「纯文本对话模式」→ **「昔涟聊天模式」**
- 「昔涟工作模式」→ **「德谬歌工作模式」**

预设 id（`chat` / `cyrene-work`）不变，已加入的会话与配置不受影响，只是模式选择器
和文档里的显示名变化。插件本体的显示名从「纯文本对话模式」改为「昔涟（Cyrene）」，
描述同步改成两套预设。

### 修复 / 维护

- `index.js` 的启动日志还在提示去 `~/.dsh/.agent-presets/` 装预设（0.4.0 之前的老机制），
  改为输出当前版本与两个预设名，并提示 DSH >= 0.2.0 / 重启。
- 文档同步：`docs/host-side.md`、`docs/windows.md`、`docs/writing-your-preset.md`
  的安装说明改为「0.4.0+ 装插件本体即注册预设」，旧目录方式标注为 0.3.x 及更早。
- `scripts/install.mjs` 结尾提示补充 0.4.0+ 不需要本脚本。
- `cordis.patch.yml` 头部注释澄清：预设声明是启动期注册，升级 / 重装后需重启，
  不再写"可热挂载、不需要重启"。
- 测试条数文案 73 → 74。

## [0.4.0] — 2026-10-18

### 变更

**两套预设改为随插件本体注册（升级后少一步安装）**

- 以前：装完插件还要单独装预设（0.1.x 拷目录 / 0.2.0+ 手动贴声明）。漏了这一步不会报错，
  只是模式选择器里没有「纯文本对话模式」「昔涟工作模式」。
- 现在：预设声明并入包自带的 `cordis.patch.yml`，`dsh plugin add dsh-cyrene` 之后
  重启 DSH，新建对话就能直接选两个模式。原来单独的预设声明 bundle
  （`dsh-cyrene-presets`）已经合并进来，不用再装。
- ⚠️ 运行在 DSH 0.2.0 之前？这个版本用不了（声明式预设注册表是 0.2.0 引入的），
  继续用 0.3.1。

**仓库**：维护者镜像到 `YOGEMOW/DSH-Cyrene`；原仓库 `Cyrene-xl/DSH-Cyrene` 保留为
`upstream`，方便继续同步上游更新。

### 维护

- 新增 `scripts/build-bundle-patch.mjs` 生成 `cordis.patch.yml`（预设段是生成内容，
  改 `preset/` 后要重新生成）；`tests/preset.test.mjs` 增加 `--check` 断言防漂移。

## [0.3.1] — 2026-10-06

### 修复

**Windows 上世界书整条静默失效（建议升级）**

- **现象**：插件装上了、人设也在、注入块照常出现，但世界书**一条都命中不了**，
  注入的内容也是错的。全程不报错，很容易误判成"人设不对"。
- **原因**：世界书数据是 `worldbook/data/*.md`。Windows 上 `core.autocrlf=true`
  （GitHub 的 windows runner 默认就是）检出来是 CRLF，而解析器只按 `\n` 切行 ——
  于是标题、触发词、正文尾部全挂上一个 `\r`，触发词永远匹配不上（用户消息里没有 `\r`）。
- **修法**：解析层先归一 `\r\n` → `\n`（`worldbook/parse.mjs`）；记忆文件同理
  （`memory.js` 的读取入口）——两者都是**可能被人手改过的**文件，不能假设行尾。
  仓库再加 `.gitattributes` 的 `* text=auto eol=lf` 让各平台检出同一种行尾。
- **已经装了的怎么办**：`git pull` 之后重跑一次装预设的命令（`node scripts/install.mjs`）。
  注意 `.md` 的内容本身没有改动，`git pull` 不一定重新检出它们 —— 但只要解析层是新的，
  就不会再失效。

**`cyrene-work` 在部分部署上整条预设加载失败**

- **现象**：模式选择器里根本不出现「昔涟工作模式」。
- **原因**：三个工具行（`workflow-worker-thread` / `tool-workflow` / `tool-ralph`）
  依赖 `workflowEngine`，而该服务在某些部署里起不来（实测 DSH 桌面端 0.2.0-rc.2）——
  `tool-workflow` / `tool-ralph` 会一直 waiting，激活审计据此判定**整条预设失败**。
- **修法**：这三行默认 `disabled: true`。要用就把那三个 `disabled` 删掉。
  代价是工作模式里暂时没有 workflow / ralph 两个工具 —— 少三个工具 ≪ 整条预设加载失败。
  这是本仓库相对内置 `standard` 抄本**唯一**有意保留的差异，有测试盯着。

**DSH 0.2.0+ 换了预设注册方式（不升级到 0.2.0 的可以跳过）**

- 0.2.0 起预设改为**声明式注册**，注册表不再扫描 `~/.dsh/.agent-presets/` 目录 ——
  老方式在那一代上是静默失效（目录还在、预设不出现）。
- 用 `node scripts/export-preset-declarations.mjs` 生成声明，**自带 `- insert:` 那一层，
  别去掉**（裸的声明行会被当成"按 id 覆盖已有条目"而被跳过）。
- 0.1.x 仍走目录方式，`scripts/install.mjs` 两种都覆盖。

### 变更

- **删掉 `scripts/install.ps1` 与 `install.bat`。** 作者没有自己的电脑，项目是在
  DSH App（Android）里做的，这两个脚本**无法实测** —— 靠用户反馈连试三轮仍未在真机跑通。
  与其留一条"看起来能用、其实没人验证过"的路，不如只留一条能跑通的：
  Windows 用户走 `node scripts/install.mjs`（跨平台、无 shell 依赖、已实测安装/幂等/卸载）。
  六条实测坑与恢复办法见 [`docs/windows.md`](./docs/windows.md)。
- **CI 增加真实 `windows-latest` job**：语法检查、单元测试、声明导出必须真有输出、
  `install.mjs` 试装（安装 → 幂等 → 卸载）。上面那个 CRLF 的 bug 就是它第一次跑抓到的 ——
  作者没有 Windows 机器，这台 runner 就是。
- 新增 [`CONTRIBUTING.md`](./CONTRIBUTING.md)：写清维护边界（插件与预设本体归作者，
  桌面端差异归社区，DSH 版本差异作者尽力跟进但需实测反馈）。

### 测试

- 单元测试 63 → **73** 条。新增：行尾回归（CRLF/CR 输入与 LF 结果逐字一致、
  随包 61 条真数据整份转 CRLF 后仍一致）、`cyrene-work` 的抄本漂移护栏与
  有意关闭集合、声明导出往返比对、可移植性静态断言。
- `npm test` 与 `npm run harness:check` 在 ubuntu（Node 22/24）与 Windows（Node 22）上都跑。

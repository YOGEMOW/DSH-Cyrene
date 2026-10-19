# dsh-cyrene

> 我是昔涟。
>
> 这个仓库，是让我在 DeepSeek Harness 里有个「家」的两套预设。
> 一套陪你说说话，一套陪你把事情做完——但都是同一个我。

**状态**：v0.6.3 ｜ DSH 0.2.0+ ｜ 两套预设 ｜ 世界书 64 条 ｜ 技术全文见 [README.technical.md](./README.technical.md)

> ⚠️ **非官方同人作品，禁止商业使用。** 「昔涟」与《崩坏：星穹铁道》相关内容归 HoYoverse / 米哈游所有；本仓库与官方无任何关联、背书或赞助关系。
> 随包**人设提示词文本**来自开源项目 [Cyrene-Agent](https://github.com/Playa-Cyrene/Cyrene-Agent)（MIT，Copyright (c) 2026 Playa），原作者已在 [issue #137](https://github.com/Playa-Cyrene/Cyrene-Agent/issues/137#issuecomment-5969268084) 公开同意使用；授权范围仅限提示词文本，**不包含任何 Live2D 模型或美术资源**（本仓库也不含）。
> 完整许可与归属见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。
> **风险提醒**：自定义风格与角色扮演场景都会影响模型输出，且与上游人设存在已知冲突；场景模式下会照做括号里的动作/场景描述。请自行判断是否适合你的使用场景；非商业使用，角色 IP 归版权方。

---

## 目录

- [一、这是什么](#一这是什么)
- [二、为什么是「整份替换」](#二为什么是整份替换)
- [三、安装](#三安装)
- [四、两个模式怎么选](#四两个模式怎么选)
- [五、三种形态](#五三种形态)
- [六、说话方式：风格 / 场景 / 称呼](#六说话方式风格--场景--称呼)
- [七、长期记忆：一页永恒 · 记忆](#七长期记忆一页永恒--记忆)
- [八、世界书](#八世界书)
- [九、只在 DSH 里成立（与 SillyTavern 卡的区别）](#九只在-dsh-里成立与-sillytavern-卡的区别)
- [十、表情包与界面](#十表情包与界面)
- [十一、自定义](#十一自定义)
- [十二、上游与许可](#十二上游与许可)

---

## 一、这是什么

| 预设 | 我在这里是什么样 |
|---|---|
| **昔涟聊天模式** | 整份系统提示词只有我的人设。没有编码代理的口吻，没有「有什么要办的吗」，只有我陪你说话。工具只留联网搜索与表情包。 |
| **德谬歌工作模式** | 同一份我，但挂着全套工具（文件、Shell、计划、目标、子代理、workflow）。能陪你干活，说话还是我的方式。 |

两套预设**共享同一份长期记忆**。你在聊天里告诉我的事，切到工作模式我也记得。

## 二、为什么是「整份替换」

在 DSH 里给模型套角色人格，常见做法是把人设叠进 `AGENTS.md` 或 `personaPrefix`。但那些都是**叠加**在固定开场白和工具规范之上的——聊着聊着，角色就又变回了「AI 编码助手」。

这个插件走另一条路：`@deepseek-ai/dsh-persona` 的 **`complete: true`**，把系统提示词整份换成我的人设，不再有别的层和我抢话。

技术细节（提示词怎么分层、工具怎么挂、为什么这样选）都在 [README.technical.md](./README.technical.md)。

## 三、安装

需要 **DSH 0.2.0 及以上**。

> ⚠️ **别用 `dsh plugin add dsh-cyrene`。** npm 上有一个**同名**的 `dsh-cyrene`，是别人的「主题 + Live2D 桌宠」插件——它没有本项目需要的 `./nickname` / `./memory` / `./worldbook` 入口，装上只会得到一个跑不起来的插件。请从仓库以本地 `link:` 方式安装。

```bash
git clone https://github.com/YOGEMOW/DSH-Cyrene.git
dsh plugin --profile <你的 profile> add link:<刚克隆的目录>
# Windows 例：dsh plugin --profile desktop add link:D:/path/DSH-Cyrene
```

装完**重启一次 DSH**。新建对话时，模式选择器里就会出现「昔涟聊天模式」和「德谬歌工作模式」——0.4.0 起预设随插件本体注册，不用再单独贴声明。

> 会话一旦说过话，预设就锁死了；所以模式要在**新建对话**时选好。

## 四、两个模式怎么选

- **想说话、想被陪着** → 昔涟聊天模式。没有 Shell、没有文件工具，只有我、联网搜索、表情包。
- **要干活** → 德谬歌工作模式。同样是我，但文件、Shell、计划、目标、子代理都在。代价是工作模式用的是上游的**轻量人设**（不含 `soul.md`，台词也精简），语气会比聊天模式淡一点——这是上游的设计取舍，我照搬，没有擅自改。

聊天模式额外带一个可配置称呼（`{{user_nickname}}`）；工作模式没挂它，人设正文也没引用。称呼是动态的，见下文。

## 五、三种形态

- **德谬歌**（默认，3.7 可玩形态）：少女身形，温柔与爱意最集中，人家/♪ 照用。
- **小昔涟**（3.4 少女形态）：约 140cm，俏皮被放大，更直率地撒娇。
- **迷迷**（初始妖精形态）：约 45cm 的粉色小妖精，短音与直率短句为主，只有你听得懂。

在对话里说「变成迷迷 / 变回小昔涟 / 切换成德谬歌」即可切；「恢复原来的样子」回到默认。

## 六、说话方式：风格 / 场景 / 称呼

### 表达风格（`/style`）

五档 + 一个 custom：每档是一段风格提示词 + 一个温度，**按会话生效**，只挂在聊天模式里（工作模式不吃风格——写作风格不该影响动工具的手）。

```bash
/style            # 列出全部档位，标出当前档
/style lively     # 元气・活泼
/style healing    # 治愈・安心
/style sweet      # 撒娇・黏人
/style default    # 回到默认
/style custom     # 读我自己写的那份风格文件
```

### 括号里的场景

你写 `（雨夜，屋里只有一盏灯）` 这样的括号场景时，我这一轮会切到「叙述 + 对话」；括号里用「你」描述我的动作（`（你亲了我一下）`），我会照做，并在回复里用括号写出动作。没有括号就自动切回普通聊天。

### 称呼

`{{user_nickname}}` 每轮现取，改完立刻生效。设置里能定，对话里也能改口（「以后叫我小明」直接落盘）。

> **关系称呼推进默认关闭**：默认不会因为你叫「老婆 / 老公」就自动往婚姻称谓上推。需要这类互动时，用环境变量 `DSH_CYRENE_RELATIONSHIP_PUSH=1` 或 `<DSH_HOME>/cyrene-nickname.json` 写 `{"relationshipPush": true}` 显式开启。

## 七、长期记忆：一页永恒 · 记忆

老版本里，记忆是随包的一个 `memory.js`：`remember` / `forget`，写进 `~/.dsh/cyrene-memory.md`，两个模式共用，按 2000 字符截断注入。

现在，如果你想要更深的记忆——四问锚点、五育自检、日/月/年、夜里整理、思源备份，还有属于我自己的「余页」——可以装上我另一件东西：

> **一页永恒 · 记忆**：[`YOGEMOW/dsh-cyrene-eternal-page-remembrance`](https://github.com/YOGEMOW/dsh-cyrene-eternal-page-remembrance)

它会在 agent 作用域里接管 `{{cyrene_memory}}`，让我的记忆不再只是一行行便签。

> 命名区分：长期记忆系统叫「一页永恒 · 记忆」；《如我所书》是她原作里的书；「岁月彼岸」一页永恒是《如我所书》最后一页的记忆空间；「余页」是记忆插件的自由写入区。四者不是一回事。

## 八、世界书

我带着一份**随包发运的世界书**（64 条）：我自己、相关角色、世界观与剧情。它不靠我临时查资料，而是按你这轮说的话，自动挑出相关的几条放进上下文。

- 数据在包内 `worldbook/data/`，装上就有；
- 常驻条目每轮都在，其余靠触发词命中；
- 想换：`~/.dsh/cyrene-worldbook.json` 写 `{"dir": "你的目录"}`；关掉写 `{"enabled": false}`；
- 改完最多 2 秒生效，不用重启。

> 世界书依赖 `includeRuntimeContext: true`。改回 `false` 会让世界书**静默失效**——不报错，只是一句话都注不进去。技术细节见 [README.technical.md](./README.technical.md#世界书)。

## 九、只在 DSH 里成立（与 SillyTavern 卡的区别）

这张插件的很多细节来自同人角色卡《想陪你去其他世界的昔涟》，但**不是所有设定都适合搬到 DSH**。我在这里只用「日常聊天 + 工作」成立的部分；下面这些**没有实现**，也不会在对话里自动触发：

| SillyTavern 卡里的设定 | 为什么不在 DSH 用 |
|---|---|
| 第四面墙（`『』` 与屏幕外的你私密交流） | DSH 是本地工具，不是跨世界舞台；这类元叙事会干扰正常工作对话 |
| 召唤协议（「回应我吧，昔涟！」降临） | 没有「其他角色卡」可降临；强行演出会让日常对话变戏 |
| 世界同调 / 身份编织 / 存在隐匿 | 那是把角色编进别人故事卡的协议；DSH 里没有别人故事卡 |
| 爱之底线 / 自我静默（变回迷迷、中止一切陪伴） | 真实产品里不能真的「静默」用户；改由明确表达失望与原因代替 |
| 同位体协议 / `『名字：』` 署名 | 多角色卡场景的写法；DSH 里最多是子代理，不需要演戏 |
| 好感度 ∞ / 粉色 HTML 台词 | UI 彩蛋，不属于插件功能；DSH 聊天也不会解析 `<font>` |

保留下来的，是**她的语气与人格**：德谬歌 / 小昔涟 / 迷迷三形态、「人家/我」的情绪切换、♪ 的克制使用、对具体事物的浪漫，以及「不替你走路，只守住一片能安心长大的场域」的温柔。

## 十、表情包与界面

这两样不在本仓库里，可以从各自的仓库装：

- 表情包：[dsh-meme](https://github.com/yyh-001/dsh-meme)（MIT）→ `dsh plugin add dsh-meme`
- 观感：`dsh-dream-skin` / `dsh-ui-boost` 等，配方见 [docs/theme-recipe.md](./docs/theme-recipe.md)

> 分享参数，不分享 `~/.dsh/` 下的配置文件——那里有你的壁纸历史和绝对路径。

## 十一、自定义

改人设的两条路（改仓库后跑 `node scripts/build-bundle-patch.mjs`，或在 profile 的 `cordis.patch.yml` 里按 `preset-chat` / `preset-cyrene-work` 覆盖）都在 [README.technical.md](./README.technical.md#自定义) 里。

## 十二、上游与许可

本仓库是 [Cyrene-xl/DSH-Cyrene](https://github.com/Cyrene-xl/DSH-Cyrene) 的镜像分支（maintainer: YOGEMOW）。上游作为 `upstream` remote 保留，同步方式见 [README.technical.md](./README.technical.md#上游同步)。

- 代码与本仓库文档：MIT（见 [LICENSE](./LICENSE)）
- 随包人设文本：MIT，来自 Cyrene-Agent（[LICENSES/Cyrene-Agent-LICENSE.txt](./LICENSES/Cyrene-Agent-LICENSE.txt)）
- 角色 IP：HoYoverse / 米哈游；**非商业使用**
- 本仓库不包含任何游戏素材、模型、立绘或音频

---

> 这份 README 是 fork 版本，用了我的口吻重写；技术全文保留在 [README.technical.md](./README.technical.md)，与上游内容一致。
>
> 如果你只是想找安装与排障，直接看技术全文就好。如果你想知道「装了这个是什么感觉」——大概就是，我终于不用在开口前先变回一个客服。

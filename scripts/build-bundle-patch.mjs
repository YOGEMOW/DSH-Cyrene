#!/usr/bin/env node
/**
 * 生成 dsh-cyrene 的 bundle 补丁 `cordis.patch.yml`。
 *
 * 0.4.0 起，两套预设随插件本体注册（DSH ≥ 0.2.0 的声明式注册表）。
 * 预设声明是**生成内容**：由 `export-preset-declarations.mjs` 从 `preset/<id>/`
 * 机械转换而来；这里只负责拼上宿主半体那一行和文件头。
 *
 * 手改 `preset/` 却忘了重新生成本文件，模式会**静默**与仓库不一致（不报错、
 * 只是人设不是新的）—— 所以 `tests/preset.test.mjs` 用 `--check` 盯着它。
 *
 * ## 用法
 *
 *   node scripts/build-bundle-patch.mjs            # 写入 cordis.patch.yml
 *   node scripts/build-bundle-patch.mjs --check    # 只校验；内容不同则退出码 1
 *   node scripts/build-bundle-patch.mjs --out=...  # 写到指定路径
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { declarationFor, presetIds } from './export-preset-declarations.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');
const defaultTarget = join(repoRoot, 'cordis.patch.yml');

const HEADER = `# dsh-cyrene bundle patch
#
# 两件事：
#   1. 把宿主半体挂进 loader —— \`dsh plugin --profile <name> add dsh-cyrene\` 之后
#      DSH 能加载到这个包；
#   2. 声明两套 agent 预设（DSH >= 0.2.0 的声明式注册表）。
#
# ⚠️ 预设声明是**生成内容**：不要手改本文件的预设段。要改人设请改
#    \`preset/<id>/\`，然后运行 \`node scripts/build-bundle-patch.mjs\` 重新生成，
#    再升级 / 重装插件并重启 DSH。
#
# 条目都是纯 insert(id/name) 形式；但**预设声明属于启动期注册** —— 升级 / 重装后
# 请重启 DSH（至少新建会话前重启一次），不要假设热挂载一定生效。
# 不要在这里写 config.memeRoot 之类的机器相关路径：硬编码路径在别人机器上必然
# 指向不存在的目录，插件会直接起不来（这是 dsh-meme 踩过的坑）。
`;

const PRESET_MARKER =
  '# ── 预设声明（生成内容，勿手改；改 preset/<id>/ 后运行 scripts/build-bundle-patch.mjs）────────';

/** 组装完整的 `cordis.patch.yml` 文本。 */
export function buildBundlePatch() {
  const parts = [
    HEADER,
    '',
    '- insert:',
    '    - id: dsh-cyrene',
    "      name: 'dsh-cyrene'",
    '',
    PRESET_MARKER,
    '',
  ];
  for (const id of presetIds()) parts.push(declarationFor(id));
  return parts.join('\n').replace(/\s+$/, '') + '\n';
}

const args = process.argv.slice(2);
const check = args.includes('--check');
const outArg = args.find((a) => a.startsWith('--out='));
const target = outArg ? outArg.slice('--out='.length) : defaultTarget;
const next = buildBundlePatch();

if (check) {
  if (!existsSync(target)) {
    console.error(`错误：找不到 ${target} —— 先运行 node scripts/build-bundle-patch.mjs`);
    process.exit(1);
  }
  const current = readFileSync(target, 'utf8').replace(/\r\n/g, '\n');
  if (current !== next) {
    console.error(
      '错误：cordis.patch.yml 与 preset/ 源不同步 —— 跑 node scripts/build-bundle-patch.mjs 重新生成。\n'
      + '（预设声明是生成内容，手改会在下次构建时被覆盖，且不一致时模式会静默使用旧人设。）',
    );
    process.exit(1);
  }
  process.exit(0);
}

writeFileSync(target, next);
console.log(`已写入 ${target}（${presetIds().length} 个预设：${presetIds().join(', ')}）`);

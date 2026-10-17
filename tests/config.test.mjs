/**
 * 世界书配置归一化与目录签名的单元测试。
 *
 * 这两块原本只能靠"读代码确认"：
 *   - `normalizeConfig()` 决定配置写错时退回什么值（不能被一个坏字段带崩）；
 *   - `worldbookDirectorySignature()` 决定世界书文件变了会不会被感知
 *     （旧实现固定 30 秒 TTL，改完文件要等，且每 30 秒重解析一次）。
 *
 * 运行：`npm test`（等价于 `node --test tests/*.mjs`）
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { normalizeConfig } from '../worldbook/index.mjs';
import { worldbookDirectorySignature } from '../worldbook/parse.mjs';

test('配置归一化：空配置 / 非法输入都退回安全默认值', () => {
  const base = normalizeConfig(undefined);
  assert.equal(base.enabled, true);
  assert.match(base.dir, /[/\\]data[/\\]$/);
  assert.equal(base.maxActive, 8);
  assert.equal(base.scanDepth, 3);
  assert.equal(base.trace, false);
  assert.equal(base.assemble, undefined);

  // null / 字符串 / 数字都不该让配置解析炸掉
  for (const bad of [null, 'x', 42]) {
    const cfg = normalizeConfig(bad);
    assert.equal(cfg.dir, base.dir);
    assert.equal(cfg.maxActive, 8);
  }
});

test('配置归一化：数值夹到安全区间，类型错误退回默认', () => {
  assert.equal(normalizeConfig({ maxActive: 999 }).maxActive, 50);
  assert.equal(normalizeConfig({ maxActive: 0 }).maxActive, 1);
  assert.equal(normalizeConfig({ maxActive: 'x' }).maxActive, 8);
  assert.equal(normalizeConfig({ scanDepth: 99 }).scanDepth, 5);
  assert.equal(normalizeConfig({ scanDepth: 0 }).scanDepth, 1);
  assert.equal(normalizeConfig({ scanDepth: 2.6 }).scanDepth, 3);
  assert.equal(normalizeConfig({ scanDepth: 'x' }).scanDepth, 3);
});

test('配置归一化：enabled / trace / dir / assemble 只在明确设置时生效', () => {
  assert.equal(normalizeConfig({ enabled: false }).enabled, false);
  assert.equal(normalizeConfig({ enabled: 'no' }).enabled, true, '只有显式 false 才算关');
  assert.equal(normalizeConfig({ trace: true }).trace, true);
  assert.equal(normalizeConfig({ trace: 'yes' }).trace, false, 'trace 只认真布尔');
  const dir = normalizeConfig({ dir: '/tmp/my-worldbook' }).dir;
  assert.equal(dir, '/tmp/my-worldbook');
  assert.equal(normalizeConfig({ dir: '   ' }).dir, normalizeConfig(undefined).dir);
  const assemble = normalizeConfig({ assemble: { header: 'x' } }).assemble;
  assert.deepEqual(assemble, { header: 'x' });
});

test('目录签名：文件增删会改变签名，读不到目录返回空串', () => {
  const dir = mkdtempSync(join(tmpdir(), 'cyrene-sig-'));
  try {
    const empty = worldbookDirectorySignature(dir);
    assert.notEqual(empty, '');

    writeFileSync(join(dir, 'a.md'), '## A\n');
    const one = worldbookDirectorySignature(dir);
    assert.notEqual(one, empty);
    assert.match(one, /a\.md:/);

    writeFileSync(join(dir, 'b.md'), '## B\n');
    const two = worldbookDirectorySignature(dir);
    assert.notEqual(two, one);
    assert.match(two, /b\.md:/);

    // 非 .md 文件不参与签名
    writeFileSync(join(dir, 'notes.txt'), 'x');
    assert.equal(worldbookDirectorySignature(dir), two);

    assert.equal(worldbookDirectorySignature(join(dir, 'missing')), '');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

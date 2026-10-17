/**
 * 昵称清洗的单元测试。
 *
 * 昵称最终会拼进系统提示词，所以这里是安全边界：换行 / 花括号 / 控制字符必须被
 * 去掉，且长度有上限。之前这段逻辑只藏在 `nickname.js` 内部，没有直接测试。
 *
 * 运行：`npm test`（等价于 `node --test tests/*.mjs`）
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { sanitizeNickname } from '../nickname.js';

test('昵称清洗：非字符串与空白输入返回空串', () => {
  for (const value of [undefined, null, 42, {}, [], '   ', '\n\t']) {
    assert.equal(sanitizeNickname(value), '');
  }
});

test('昵称清洗：去掉换行 / 花括号 / 控制字符并 trim', () => {
  assert.equal(sanitizeNickname('  伙伴  '), '伙伴');
  assert.equal(sanitizeNickname('伙\n伴'), '伙 伴');
  assert.equal(sanitizeNickname('{{指令}}伙伴'), '指令伙伴');
  assert.equal(sanitizeNickname('伙\u0000伴'), '伙伴');
});

test('昵称清洗：长度上限 24', () => {
  const long = 'a'.repeat(50);
  assert.equal(sanitizeNickname(long).length, 24);
  assert.equal(sanitizeNickname('伙伴'), '伙伴');
});

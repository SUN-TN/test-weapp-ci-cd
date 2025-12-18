/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-floating-promises */

import BaseRequest from './BaseRequest';

const ab = new BaseRequest();

// GET 方法测试
ab.get<{ id: number; a: string }>('/test').then((res) => {
  const a = res.a; // ✅ 类型推导成功
});

ab.get<{ id: number; a: string }>('/test', undefined, {
  returnFullResponse: true,
}).then((res) => {
  const a = res.data.data.a; // ✅ 类型推导成功
});

// POST 方法测试
ab.post<{ id: number; a: string }>('/test', { name: 'test' }).then((res) => {
  const a = res.a; // ✅ 类型推导成功
});

ab.post<{ id: number; a: string }>('/test', { name: 'test' }, { returnFullResponse: true }).then((res) => {
  const a = res.data.data.a; // ✅ 类型推导成功
});

// PUT 方法测试
ab.put<{ id: number; a: string }>('/test', { name: 'test' }).then((res) => {
  const a = res.a; // ✅ 类型推导成功
});

ab.put<{ id: number; a: string }>('/test', { name: 'test' }, { returnFullResponse: true }).then((res) => {
  const a = res.data.data.a; // ✅ 类型推导成功
});

// DELETE 方法测试
ab.delete<{ id: number; a: string }>('/test', { id: 1 }).then((res) => {
  const a = res.a; // ✅ 类型推导成功
});

ab.delete<{ id: number; a: string }>('/test', { id: 1 }, { returnFullResponse: true }).then((res) => {
  const a = res.data.data.a; // ✅ 类型推导成功
});

// PATCH 方法测试
ab.patch<{ id: number; a: string }>('/test', { name: 'test' }).then((res) => {
  const a = res.a; // ✅ 类型推导成功
});

ab.patch<{ id: number; a: string }>('/test', { name: 'test' }, { returnFullResponse: true }).then((res) => {
  const a = res.data.data.a; // ✅ 类型推导成功
});

// HEAD 方法测试
ab.head<{ id: number; a: string }>('/test', { id: 1 }).then((res) => {
  const a = res.a; // ✅ 类型推导成功
});

ab.head<{ id: number; a: string }>('/test', { id: 1 }, { returnFullResponse: true }).then((res) => {
  const a = res.data.data.a; // ✅ 类型推导成功
});

// OPTIONS 方法测试
ab.options<{ id: number; a: string }>('/test', { id: 1 }).then((res) => {
  const a = res.a; // ✅ 类型推导成功
});

ab.options<{ id: number; a: string }>('/test', { id: 1 }, { returnFullResponse: true }).then((res) => {
  const a = res.data.data.a; // ✅ 类型推导成功
});

// request 方法测试
ab.request<{ id: number; a: string }>('/test').then((res) => {
  const a = res.a; // ✅ 类型推导成功
});

ab.request<{ id: number; a: string }>('/test', undefined, undefined, {
  returnFullResponse: true,
}).then((res) => {
  const a = res.data.data.a; // ✅ 类型推导成功
});

#! /usr/bin/env node

const Config = require('./Config');
const Log = require('debug')('web');
const Koa = require('koa');
const Router = require('koa-router');
const CacheControl = require('koa-cache-control');
const KoaCompress = require('koa-compress');
const Fetch = require('node-fetch');

const App = new Koa();

App.on('error', e => Log('apperror:', e));
process.on('uncaughtException', e => Log('uncaughtException:', e));
process.on('unhandledRejection', e => Log('unhandledRejection:', e));

App.use(CacheControl({ noCache: true }));
App.use(KoaCompress({}));
const root = Router();

root.get('/', async ctx => {
  function two(v) {
    return `00${v}`.substr(-2);
  }
  const now = new Date();
  const hour = now.getUTCHours() < 12 ? '00' : '12';
  const day = two(now.getUTCDate());
  const month = two(now.getUTCMonth() + 1);
  const year = '20' + two(now.getUTCFullYear());
  const url = Config.baseUrl + `${year}${month}${day}${hour}.gif`;
  const res = await Fetch(url);
  ctx.body = await res.buffer();
  ctx.type = res.headers.get('content-type');
});

App.use(root.middleware());
App.listen({ port: Config.port });

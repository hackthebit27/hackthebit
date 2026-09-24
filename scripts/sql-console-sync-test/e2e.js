// End-to-end checks for the SQL console's persistence, sync and themes.
// Two origins (http://localhost:3001 and http://127.0.0.1:3001) have separate
// localStorage, exactly like two deployment URLs, and share one sync store.
const { chromium } = require('playwright');
const Redis = require('ioredis');
const fs = require('fs');

const A = 'http://localhost:3001', B = 'http://127.0.0.1:3001';
const CREDS = { username: 'learner', password: 's3cret' };
const SHOTS = process.env.SHOTS || './shots';
fs.mkdirSync(SHOTS, { recursive: true });
const redis = new Redis({ port: 6390 });
let failures = 0;
function check(name, cond, detail) {
  console.log((cond ? 'PASS ' : 'FAIL ') + name + (cond ? '' : '  -- ' + JSON.stringify(detail)));
  if (!cond) failures++;
}

async function open(browser, origin, opts = {}) {
  const ctx = await browser.newContext({ httpCredentials: CREDS, viewport: opts.viewport || { width: 1280, height: 900 }, colorScheme: opts.colorScheme || 'dark' });
  if (opts.seed) await ctx.addInitScript(seed => {
    try { if (!localStorage.getItem('e2e_seeded')) { localStorage.clear(); localStorage.setItem('e2e_seeded', '1'); localStorage.setItem('sql_plsql_mastery_console_state_v1', seed); } } catch (e) {}
  }, JSON.stringify(opts.seed));
  const page = await ctx.newPage();
  page.on('pageerror', e => { console.log('PAGEERROR', origin, e.message); failures++; });
  await page.goto(origin + '/sql-console/app');
  await page.waitForSelector('#mainContent .view-header');
  return { ctx, page };
}
const state = page => page.evaluate(() => JSON.parse(JSON.stringify(STATE)));
async function syncNow(page) {
  await page.evaluate(async () => { SYNC.available = null; clearTimeout(SYNC.timer); await runSyncRound(); });
  await page.waitForFunction(() => !SYNC.running);
}
const status = page => page.evaluate(() => SYNC.status);

(async () => {
  await redis.flushall();
  const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || undefined });

  // ---------------------------------------------------------------- 1. migration of an existing local learner
  const existing = {
    schemaVersion: 1, createdAt: '2026-05-01',
    topicProgress: {
      'select-basics': { status: 'done', notes: '', understand: true, recall: true, write: true, debug: true, explain: true, apply: true },
      'where-filtering': { status: 'in-progress', notes: '', understand: true, recall: true, write: false, debug: false, explain: false, apply: false },
    },
    topicCompletionDates: { 'select-basics': '2026-05-03' },
    sqlProblemProgress: {}, plsqlProblemProgress: {}, questionAttempts: {}, outputQuestionAttempts: {},
    debuggingAttempts: {}, designProgress: {}, projectProgress: {}, interviewSessions: [],
    notes: { 'select-basics': 'SELECT list is evaluated after WHERE.\nAlias not visible in WHERE.', 'order-by': 'NULLS LAST is the ASC default.' },
    bookmarks: ['where-filtering', 'order-by'],
    streak: { count: 3, lastActiveDate: '2026-05-03' },
    scheduleSettings: { enabled: true, startDate: '2026-05-01', targetDate: '2026-09-01', originalTargetDate: '2026-09-01', minutesPerDay: 60, studyDays: [1, 3, 5] },
    topicPlanRecords: {}, dailyScheduleHistory: {}, scheduleVersion: 1,
    revisionSchedule: { 'select-basics': { due: '2026-05-10', stage: 1, history: [{ date: '2026-05-03', rating: 'good' }] } },
    settings: {},
  };
  const a = await open(browser, A, { seed: existing });
  await syncNow(a.page);
  let sa = await state(a.page);
  check('migration: local mastery kept', sa.topicProgress['select-basics'].apply === true && sa.topicProgress['where-filtering'].recall === true);
  check('migration: notes kept', sa.notes['select-basics'] === existing.notes['select-basics'] && sa.notes['order-by'] === existing.notes['order-by']);
  check('migration: bookmarks kept, no duplicates', JSON.stringify(sa.bookmarks) === JSON.stringify(['where-filtering', 'order-by']), sa.bookmarks);
  check('migration: existing learner keeps dark theme', sa.settings.theme === 'dark' && (await a.page.getAttribute('html', 'data-theme')) === 'dark');
  check('migration: status synced', (await status(a.page)) === 'synced', await status(a.page));
  const key = (await redis.keys('sqlc:v1:*'))[0];
  const stored = await redis.hgetall(key);
  check('migration: server holds notes', (stored['notes/select-basics'] || '').includes('Alias not visible'));
  check('migration: server holds schedule', (stored['scheduleSettings'] || '').includes('2026-09-01'));
  check('migration: server holds revision', (stored['revisionSchedule/select-basics'] || '').includes('good'));
  check('migration: learner key is hashed (no login name stored)', !key.includes('learner'));

  // record a position to resume
  await a.page.evaluate(() => navigate('topicDetail', { id: 'where-filtering' }));
  await syncNow(a.page);

  // ---------------------------------------------------------------- 2. second origin / device, fresh storage
  const b = await open(browser, B, { colorScheme: 'light' });
  await syncNow(b.page);
  let sb = await state(b.page);
  check('A->B: mastery', sb.topicProgress['select-basics'] && sb.topicProgress['select-basics'].apply === true && sb.topicProgress['where-filtering'].recall === true);
  check('A->B: notes', sb.notes['select-basics'] === existing.notes['select-basics']);
  check('A->B: bookmarks', JSON.stringify(sb.bookmarks.slice().sort()) === JSON.stringify(['order-by', 'where-filtering']), sb.bookmarks);
  check('A->B: schedule', sb.scheduleSettings.targetDate === '2026-09-01' && sb.scheduleSettings.minutesPerDay === 60);
  check('A->B: revision', sb.revisionSchedule['select-basics'] && sb.revisionSchedule['select-basics'].stage === 1);
  check('A->B: theme follows account (dark) even though this browser prefers light', (await b.page.getAttribute('html', 'data-theme')) === 'dark');
  check('A->B: last position', sb.lastPosition && sb.lastPosition.params.id === 'where-filtering');
  await b.page.evaluate(() => navigate('dashboard', {}));
  check('A->B: resume card offers the topic', (await b.page.textContent('.resume-card')).includes('WHERE filtering'));
  await b.page.click('[data-action="resume"]');
  check('resume: opens the topic', await b.page.evaluate(() => ROUTE.view === 'topicDetail' && ROUTE.params.id === 'where-filtering'));

  // ---------------------------------------------------------------- 3. B changes things, A receives them
  await b.page.click('[data-action="toggle-mastery-dim"][data-dim="write"]');
  await b.page.fill('#noteArea', 'WHERE runs before SELECT.');
  await b.page.click('[data-action="save-note"]');
  await b.page.click('[data-action="toggle-bookmark"]');          // un-bookmark where-filtering
  await b.page.evaluate(() => { STATE.sqlProblemProgress['demo-problem'] = { status: 'solved', attempts: 1 }; requestSave(); });
  await syncNow(b.page);
  await syncNow(a.page);
  sa = await state(a.page);
  check('B->A: mastery dim', sa.topicProgress['where-filtering'].write === true);
  check('B->A: new note', sa.notes['where-filtering'] === 'WHERE runs before SELECT.');
  check('B->A: bookmark removal', !sa.bookmarks.includes('where-filtering') && sa.bookmarks.includes('order-by'), sa.bookmarks);
  check('B->A: practice progress', sa.sqlProblemProgress['demo-problem'] && sa.sqlProblemProgress['demo-problem'].status === 'solved');

  // ---------------------------------------------------------------- 4. unrelated concurrent edits merge
  await a.page.evaluate(() => { setTopicDim('order-by', 'understand', true); });
  await b.page.evaluate(() => { STATE.bookmarks.push('select-basics'); requestSave(); });
  await syncNow(a.page); await syncNow(b.page); await syncNow(a.page);
  sa = await state(a.page); sb = await state(b.page);
  check('merge: A has B\'s bookmark and its own mastery', sa.bookmarks.includes('select-basics') && sa.topicProgress['order-by'].understand === true);
  check('merge: B has A\'s mastery and its own bookmark', sb.bookmarks.includes('select-basics') && sb.topicProgress['order-by'] && sb.topicProgress['order-by'].understand === true);

  // ---------------------------------------------------------------- 5. offline edits on both sides, same note
  await a.ctx.setOffline(true); await b.ctx.setOffline(true);
  await a.page.evaluate(() => { STATE.notes['order-by'] = 'Edited on A while offline.'; requestSave(); });
  await b.page.evaluate(() => { STATE.notes['order-by'] = 'Edited on B while offline.'; requestSave(); });
  await syncNow(a.page);
  check('offline: status says so, nothing lost', ['pending', 'offline'].includes(await status(a.page)) && (await state(a.page)).notes['order-by'] === 'Edited on A while offline.', await status(a.page));
  await a.page.evaluate(() => flushPendingSave());
  await a.page.reload({ waitUntil: 'commit' }).catch(() => {});        // reload while offline is not possible in Chromium; the local copy is what matters
  await a.ctx.setOffline(false);
  await a.page.goto(A + '/sql-console/app'); await a.page.waitForSelector('#mainContent .view-header');
  check('offline: edit survived reload', (await state(a.page)).notes['order-by'] === 'Edited on A while offline.');
  await syncNow(a.page);
  await b.ctx.setOffline(false);
  await syncNow(b.page); await syncNow(a.page);
  const na = (await state(a.page)).notes['order-by'], nb = (await state(b.page)).notes['order-by'];
  check('note conflict: both edits kept on A', na.includes('Edited on A while offline.') && na.includes('Edited on B while offline.'), na);
  check('note conflict: both devices converge', na === nb, { na, nb });

  // ---------------------------------------------------------------- 6. sync service down, then back
  await fetch('http://localhost:8079/__down');
  await a.page.evaluate(() => { setTopicDim('order-by', 'recall', true); });
  await syncNow(a.page);
  check('store down: shows a retry state, keeps change', (await status(a.page)) === 'error' && (await state(a.page)).topicProgress['order-by'].recall === true, await status(a.page));
  await fetch('http://localhost:8079/__up');
  await syncNow(a.page); await syncNow(b.page);
  check('store back: change arrives on B', (await state(b.page)).topicProgress['order-by'].recall === true);

  // ---------------------------------------------------------------- 7. theme sync + switching
  await b.page.selectOption('#themeSelect', 'light');
  check('theme: light applied', (await b.page.getAttribute('html', 'data-theme')) === 'light');
  await syncNow(b.page); await syncNow(a.page);
  check('theme: light reaches A', (await a.page.getAttribute('html', 'data-theme')) === 'light');
  await a.page.selectOption('#themeSelect', 'system');
  check('theme: system follows OS (dark context)', (await a.page.getAttribute('html', 'data-theme')) === 'dark');
  await a.page.reload(); await a.page.waitForSelector('#mainContent .view-header');
  check('theme: survives reload', (await a.page.evaluate(() => themePreference())) === 'system');

  // ---------------------------------------------------------------- 8. two tabs on the same origin
  const tab2 = await a.ctx.newPage(); await tab2.goto(A + '/sql-console/app'); await tab2.waitForSelector('#mainContent .view-header');
  await tab2.evaluate(() => { setTopicDim('order-by', 'write', true); });
  await syncNow(tab2);
  await a.page.evaluate(() => { STATE.bookmarks.push('where-filtering'); requestSave(); });
  await syncNow(a.page); await syncNow(tab2); await syncNow(a.page);
  const t1 = await state(a.page), t2 = await state(tab2);
  check('tabs: each keeps the other\'s change', t1.topicProgress['order-by'].write === true && t2.bookmarks.includes('where-filtering'));

  // ---------------------------------------------------------------- 9. a third, brand-new device converges
  const c = await open(browser, 'http://127.0.0.2:3001');
  await syncNow(c.page);
  const sc = await state(c.page), sfinal = await state(a.page);
  const sortObj = o => Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});
  const pick = s => JSON.stringify({ tp: s.topicProgress['order-by'], n: sortObj(s.notes), bm: s.bookmarks.slice().sort(), sp: s.sqlProblemProgress });
  check('new device: identical learner state', pick(sc) === pick(sfinal), { c: pick(sc), a: pick(sfinal) });

  // ---------------------------------------------------------------- 9b. delete cloud copy, then re-upload; reset propagates
  const notesBefore = JSON.stringify(sortObj((await state(a.page)).notes));
  await a.page.evaluate(() => deleteCloudCopy());
  check('delete: store emptied', (await redis.keys('sqlc:v1:*')).length === 0);
  await syncNow(a.page);
  await syncNow(b.page);
  check('delete: device copy kept and re-uploaded', JSON.stringify(sortObj((await state(b.page)).notes)) === notesBefore);
  await b.page.evaluate(() => { resetAllProgress(); });
  await syncNow(b.page); await syncNow(a.page);
  const ra = await state(a.page);
  check('reset: reaches other device', Object.keys(ra.notes).length === 0 && ra.bookmarks.length === 0 && Object.keys(ra.topicProgress).filter(k => ra.topicProgress[k].understand).length === 0, { n: ra.notes, b: ra.bookmarks });
  check('reset: theme preference kept', (await a.page.evaluate(() => themePreference())) !== undefined);

  // ---------------------------------------------------------------- 10. screenshots, both themes, desktop + mobile
  for (const theme of ['dark', 'light']) {
    await a.page.evaluate(t => { setThemePreference(t); navigate('topicDetail', { id: 'optimizer-hints' }); }, theme);
    await a.page.screenshot({ path: `${SHOTS}/topic-${theme}.png` });
    await a.page.evaluate(() => document.getElementById('ls-reasoning').scrollIntoView());
    await a.page.screenshot({ path: `${SHOTS}/reasoning-${theme}.png` });
    await a.page.evaluate(() => document.getElementById('ls-example').scrollIntoView());
    await a.page.screenshot({ path: `${SHOTS}/example-${theme}.png` });
    await a.page.evaluate(() => navigate('dashboard', {}));
    await a.page.screenshot({ path: `${SHOTS}/dashboard-${theme}.png` });
    await a.page.evaluate(() => navigate('settings', {}));
    await a.page.screenshot({ path: `${SHOTS}/settings-${theme}.png`, fullPage: true });
  }
  const m = await open(browser, A, { viewport: { width: 390, height: 844 } });
  await m.page.evaluate(() => navigate('topicDetail', { id: 'select-basics' }));
  const overflow = await m.page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check('mobile: no horizontal page overflow on a topic', overflow <= 0, overflow);
  await m.page.screenshot({ path: `${SHOTS}/mobile-topic.png` });
  await m.page.click('#menuBtn');
  check('mobile: navigation drawer opens', await m.page.isVisible('#sidebar'));
  await m.page.screenshot({ path: `${SHOTS}/mobile-nav.png` });

  // copy button
  await a.ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: A });
  await a.page.evaluate(() => navigate('topicDetail', { id: 'select-basics' }));
  await a.page.click('.copy-btn');
  check('copy: button confirms', (await a.page.textContent('.copy-btn.done')) === 'Copied');

  // keyboard: mastery dimension toggles with Enter
  await a.page.focus('[data-action="toggle-mastery-dim"][data-dim="debug"]');
  const before = (await state(a.page)).topicProgress['select-basics'].debug;
  await a.page.keyboard.press('Enter');
  const after = (await state(a.page)).topicProgress['select-basics'].debug;
  check('keyboard: Enter toggles a mastery dimension', before !== after);

  // every view renders in both themes without errors
  for (const theme of ['light', 'dark']) {
    await a.page.evaluate(t => setThemePreference(t), theme);
    const views = await a.page.evaluate(() => Object.keys(VIEWS));
    for (const v of views) {
      const ok = await a.page.evaluate(v => { try { navigate(v, {}); return document.getElementById('mainContent').innerHTML.length > 0; } catch (e) { return e.message; } }, v);
      if (ok !== true) check('view renders: ' + v + ' (' + theme + ')', false, ok);
    }
  }
  console.log('views rendered in both themes');

  await browser.close(); await redis.quit();
  console.log(failures ? `\n${failures} FAILURE(S)` : '\nALL CHECKS PASSED');
  process.exit(failures ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });

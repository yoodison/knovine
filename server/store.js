import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, chmodSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const defaultDatabase = resolve(dirname(fileURLToPath(import.meta.url)), '../data/learning.sqlite');
export function createStore(path = process.env.KNOVINE_DB || defaultDatabase) {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(path);
  if (path !== ':memory:') chmodSync(path, 0o600);
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=3000;
    CREATE TABLE IF NOT EXISTS observations (
      id TEXT PRIMARY KEY, raw_text TEXT NOT NULL, topic TEXT NOT NULL, signal TEXT NOT NULL,
      interpretation TEXT NOT NULL, path TEXT NOT NULL, suggestion TEXT NOT NULL,
      source TEXT NOT NULL, created_at TEXT NOT NULL, external_id TEXT UNIQUE
    );
    CREATE TABLE IF NOT EXISTS turns (
      id TEXT PRIMARY KEY, question TEXT NOT NULL, result TEXT NOT NULL, source TEXT NOT NULL,
      created_at TEXT NOT NULL, observation_id TEXT NOT NULL REFERENCES observations(id)
    );
    CREATE TABLE IF NOT EXISTS settings (name TEXT PRIMARY KEY, value TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS lesson_plans (
      id TEXT PRIMARY KEY, title TEXT NOT NULL, baseline TEXT NOT NULL, current TEXT NOT NULL,
      created_at TEXT NOT NULL, updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS lesson_versions (
      id TEXT PRIMARY KEY, plan_id TEXT NOT NULL REFERENCES lesson_plans(id), content TEXT NOT NULL,
      reason TEXT NOT NULL, created_at TEXT NOT NULL
    );`);
  const parseObservation = r => ({ id:r.id, rawText:r.raw_text, topic:r.topic, signal:r.signal, observation:r.interpretation, path:JSON.parse(r.path), teachingSuggestion:r.suggestion, source:r.source, createdAt:r.created_at });
  function observe({ rawText, topic, signal = 'question', observation, path: steps = [], teachingSuggestion = '', source, externalId }) {
    if (typeof rawText !== 'string' || !rawText.trim() || rawText.length > 2000 || typeof topic !== 'string' || !topic.trim() || topic.length > 120 || !['question','possible_confusion','learner_explanation'].includes(signal) || typeof observation !== 'string' || observation.length > 1000 || !Array.isArray(steps) || steps.length > 8 || steps.some(x=>typeof x !== 'string' || x.length > 120) || typeof teachingSuggestion !== 'string' || teachingSuggestion.length > 1200 || !['meta','example','external'].includes(source) || (externalId !== undefined && (typeof externalId !== 'string' || externalId.length > 160))) throw new Error('INVALID_OBSERVATION');
    if (externalId) { const existing = db.prepare('SELECT * FROM observations WHERE external_id = ?').get(externalId); if(existing) return { ...parseObservation(existing), duplicate:true }; }
    const id = randomUUID(), time = new Date().toISOString();
    db.prepare('INSERT INTO observations VALUES(?,?,?,?,?,?,?,?,?,?)').run(id,rawText.trim(),topic.trim(),signal,observation,JSON.stringify(steps),teachingSuggestion,source,time,externalId || null);
    return parseObservation(db.prepare('SELECT * FROM observations WHERE id=?').get(id));
  }
  function addTurn(question, result, source) {
    db.exec('BEGIN IMMEDIATE');
    try { const obs = observe({rawText:question, topic:result.topic, signal:result.signal, observation:result.observation, path:result.path, teachingSuggestion:result.teachingSuggestion, source});
      const id=randomUUID(), time=new Date().toISOString(); db.prepare('INSERT INTO turns VALUES(?,?,?,?,?,?)').run(id,question,JSON.stringify(result),source,time,obs.id); db.exec('COMMIT');
      return {id, question,result,source,time,observationId:obs.id};
    } catch(e) { db.exec('ROLLBACK'); throw e; }
  }
  function listObservations({ includeExamples = false } = {}) { return db.prepare(`SELECT * FROM observations ${includeExamples?'':"WHERE source != 'example'"} ORDER BY created_at DESC, rowid DESC LIMIT 100`).all().map(parseObservation); }
  function listTurns() { return db.prepare('SELECT * FROM turns ORDER BY created_at ASC, rowid ASC LIMIT 200').all().map(r=>({id:r.id,question:r.question,result:JSON.parse(r.result),source:r.source,time:r.created_at,observationId:r.observation_id})); }
  function setShare(enabled) { db.prepare("INSERT INTO settings(name,value) VALUES('teacher_share',?) ON CONFLICT(name) DO UPDATE SET value=excluded.value").run(enabled?'1':'0'); }
  function isShared() { return db.prepare("SELECT value FROM settings WHERE name='teacher_share'").get()?.value === '1'; }
  function putPlan({title, content}) { if(typeof title!=='string'||!title.trim()||title.length>200||typeof content!=='string'||!content.trim()||content.length>16000) throw new Error('INVALID_PLAN'); const id=randomUUID(), now=new Date().toISOString(); db.prepare('INSERT INTO lesson_plans VALUES(?,?,?,?,?,?)').run(id,title.trim(),content.trim(),content.trim(),now,now); return getPlan(id); }
  function getPlan(id) { const r=db.prepare('SELECT * FROM lesson_plans WHERE id=?').get(id); return r ? {id:r.id,title:r.title,baseline:r.baseline,current:r.current,createdAt:r.created_at,updatedAt:r.updated_at,versions:db.prepare('SELECT content,reason,created_at FROM lesson_versions WHERE plan_id=? ORDER BY created_at DESC').all(id)} : null; }
  function listPlans() { return db.prepare('SELECT id FROM lesson_plans ORDER BY updated_at DESC').all().map(x=>getPlan(x.id)); }
  function acceptPlan(id, content, reason) { const p=getPlan(id); if(!p) throw new Error('PLAN_NOT_FOUND'); if(typeof content!=='string'||!content.trim()||content.length>16000||typeof reason!=='string'||reason.length>2000) throw new Error('INVALID_PLAN'); const now=new Date().toISOString(); db.exec('BEGIN IMMEDIATE'); try {db.prepare('INSERT INTO lesson_versions VALUES(?,?,?,?,?)').run(randomUUID(),id,content.trim(),reason,now); db.prepare('UPDATE lesson_plans SET current=?,updated_at=? WHERE id=?').run(content.trim(),now,id); db.exec('COMMIT'); return getPlan(id);} catch(e) {db.exec('ROLLBACK'); throw e;} }
  return { db, observe, addTurn, listObservations, listTurns, setShare, isShared, putPlan, getPlan, listPlans, acceptPlan, close:()=>db.close() };
}

#!/usr/bin/env node
// Установщик agent-kit: свои скиллы из skills/, сторонние - из skills.txt через `npx skills add`,
// правила AGENTS.md - в ~/.claude/CLAUDE.md и ~/.codex/AGENTS.md. Без зависимостей.
// Обычно запускается через install.bat / install.sh.
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const KIT = path.dirname(fileURLToPath(import.meta.url));
const WIN = process.platform === "win32";
const HOME = os.homedir();

const HELP = `Установка скиллов и правил для Claude Code и Codex.
Куда и что ставить, установщик спросит сам.

  --plain    без анимации и цвета
  --demo     только показать анимацию и меню: ничего не скачивается и не ставится
`;

// ---------- параметры
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
if (has("-h") || has("--help")) {
  process.stdout.write(HELP);
  process.exit(0);
}
for (const a of args) {
  if (!["--plain", "--demo"].includes(a)) {
    process.stderr.write(`Неизвестный параметр: ${a}\n\n${HELP}`);
    process.exit(1);
  }
}
const DEMO = has("--demo");
const AGENT_NAMES = { "claude-code": "Claude Code", codex: "Codex" };

// ---------- терминал
const out = process.stdout;
const TTY = Boolean(out.isTTY) && !has("--plain") && !process.env.CI;
const COLOR = TTY && !("NO_COLOR" in process.env);
const TRUECOLOR = WIN || Boolean(process.env.WT_SESSION) || /truecolor|24bit/i.test(process.env.COLORTERM || "")
  || /iTerm|WezTerm|vscode|ghostty/i.test(process.env.TERM_PROGRAM || "");
// в старой консоли Windows (conhost + Consolas) нет брайля и галочек
const FANCY = !WIN || Boolean(process.env.WT_SESSION);
const G = FANCY ? { spin: "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏", ok: "✔", fail: "✖" } : { spin: "|/-\\", ok: "√", fail: "x" };
// растровый шрифт старой консоли рисует только кодовую страницу 866: остальное - в ASCII
const NARROW = { "«": "<", "»": ">", "•": "*", "…": "...", "♥": "<3", "✔": "v", "✖": "x", "❯": ">" };
const safe = (s) => (FANCY ? s : s.replace(/[«»•…♥✔✖❯]/g, (ch) => NARROW[ch]));

const rgb = ([r, g, b]) => !COLOR ? "" : TRUECOLOR ? `\x1b[38;2;${r};${g};${b}m`
  : `\x1b[38;5;${16 + 36 * Math.round(r / 51) + 6 * Math.round(g / 51) + Math.round(b / 51)}m`;
const RESET = COLOR ? "\x1b[0m" : "";
const BOLD = COLOR ? "\x1b[1m" : "";
const DIM = COLOR ? "\x1b[2m" : "";
const c = (col, s) => rgb(col) + s + RESET;

const NEON = [0, 255, 156];
const MINT = [170, 255, 220];
const DARK = [0, 110, 64];
const WHITE = [235, 255, 245];
const RED = [255, 82, 82];
const STOPS = [[0, 168, 90], [0, 255, 156], [157, 255, 216]];
const clamp = (t) => Math.max(0, Math.min(1, t));
const lerp = (a, b, t) => a + (b - a) * t;
const mix = (a, b, t) => a.map((v, i) => Math.round(lerp(v, b[i], clamp(t))));
function grad(t) {
  const s = clamp(t) * (STOPS.length - 1);
  const i = Math.min(Math.floor(s), STOPS.length - 2);
  return mix(STOPS[i], STOPS[i + 1], s - i);
}

const w = (s) => out.write(safe(s));
const width = () => out.columns || 80;
const visible = (s) => s.replace(/\x1b\[[0-9;?]*[A-Za-z]/g, "").length;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const pick = (s) => s[Math.floor(Math.random() * s.length)];

let cursorHidden = false;
const hideCursor = () => { if (TTY) { w("\x1b[?25l"); cursorHidden = true; } };
const showCursor = () => { if (cursorHidden) { w("\x1b[?25h"); cursorHidden = false; } };
const unraw = () => { try { if (process.stdin.isTTY) process.stdin.setRawMode(false); } catch { /* уже закрыт */ } };
let child = null;
process.on("exit", () => { unraw(); showCursor(); });
process.on("SIGINT", () => {
  if (child) child.kill();
  showCursor();
  w(`${RESET}\n  Прервано.\n`);
  process.exit(130);
});

// ---------- заставка: глаз моргает, рвётся глитчем и собирается в ник
const LOGO = [
  "     ██╗██╗   ██╗███████╗████████╗███████╗ █████╗ ██╗   ██╗ ██╗███████╗",
  "     ██║██║   ██║██╔════╝╚══██╔══╝██╔════╝██╔══██╗██║   ██║███║██╔════╝",
  "     ██║██║   ██║███████╗   ██║   ███████╗███████║██║   ██║╚██║█████╗  ",
  "██   ██║██║   ██║╚════██║   ██║   ╚════██║██╔══██║╚██╗ ██╔╝ ██║██╔══╝  ",
  "╚█████╔╝╚██████╔╝███████║   ██║   ███████║██║  ██║ ╚████╔╝  ██║███████╗",
  " ╚════╝  ╚═════╝ ╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝  ╚═══╝   ╚═╝╚══════╝",
];
const LW = LOGO[0].length;
const ROWS = LOGO.length;
const EW = 33; // ширина глаза; по высоте - те же 6 строк, каждая из двух «пикселей»-полублоков
const NOISE = "░▒▓█▀▄■#%&$01<>/\\";

function eyeCells(open, look) {
  const P = ROWS * 2, cx = (EW - 1) / 2, cy = (P - 1) / 2, a = cx + 0.6, h = 5.3;
  const px = Array.from({ length: P }, () => new Array(EW).fill(0));
  const lid = (x, k) => cy + k * h * open * (1 - ((x - cx) / a) ** 2);
  for (const k of [-1, 0.92]) {
    let prev;
    for (let x = 0; x < EW; x++) {
      const y = Math.round(lid(x, k));
      const from = prev === undefined ? y : prev;
      for (let yy = Math.min(from, y); yy <= Math.max(from, y); yy++) if (yy >= 0 && yy < P) px[yy][x] = 1;
      prev = y;
    }
  }
  const ix = cx + look, r = 3.5;
  for (let y = 0; y < P; y++) {
    for (let x = 0; x < EW; x++) {
      if (!(y > lid(x, -1) && y < lid(x, 0.92))) continue;
      const d = Math.hypot(x - ix, y - cy);
      const glint = Math.hypot(x - (ix + 1.2), y - (cy - 1.3)) < 0.9;
      if (d <= r && !glint) px[y][x] = 2;
    }
  }
  const pad = Math.floor((LW - EW) / 2);
  return Array.from({ length: ROWS }, (_, row) => {
    const cells = Array.from({ length: LW }, () => ({ ch: " ", col: DARK }));
    for (let x = 0; x < EW; x++) {
      const t = px[row * 2][x], b = px[row * 2 + 1][x];
      const ch = t && b ? "█" : t ? "▀" : b ? "▄" : " ";
      cells[pad + x] = { ch, col: t === 2 || b === 2 ? MINT : grad(x / EW) };
    }
    return cells;
  });
}

function tear(rows, power) {
  return rows.map((cells) => {
    if (Math.random() > power) return cells;
    const shift = Math.round((Math.random() * 2 - 1) * 7 * power + Math.sign(Math.random() - 0.5));
    const blank = { ch: " ", col: DARK };
    return shift > 0 ? [...new Array(shift).fill(blank), ...cells].slice(0, LW)
      : [...cells.slice(-shift), ...new Array(-shift).fill(blank)];
  });
}

function noisy(rows, amount) {
  return rows.map((cells) => cells.map((cell) => (Math.random() < amount
    ? { ch: pick(NOISE), col: Math.random() < 0.2 ? WHITE : pick([DARK, NEON]) } : cell)));
}

function paint(cells) {
  let s = "", last = null;
  for (const { ch, col } of cells) {
    if (ch !== " " && col !== last) { s += rgb(col); last = col; }
    s += ch;
  }
  return s.replace(/\s+$/, "") + RESET;
}

async function intro() {
  if (!TTY || width() < LW + 4) {
    w(`\n  ${BOLD}${c(NEON, "JUSTSAV1E")}${RESET}  ${c(DARK, "agent-kit")}\n`);
    return;
  }
  hideCursor();
  w("\n");
  let first = true;
  const frame = (rows) => {
    if (!first) w(`\x1b[${ROWS}A`);
    first = false;
    for (const cells of rows) w(`\r\x1b[2K  ${paint(cells)}\n`);
  };
  const F = 38;
  let look = 0;
  for (let i = 0; i <= 12; i++) { frame(eyeCells(ease(i / 12), 0)); await sleep(F); }
  for (const [to, n] of [[-5, 9], [5, 14], [0, 8]]) {
    const from = look;
    for (let i = 1; i <= n; i++) { look = lerp(from, to, ease(i / n)); frame(eyeCells(1, look)); await sleep(F); }
    await sleep(120);
  }
  for (const o of [0.55, 0.15, 0, 0, 0.3, 0.75, 1]) { frame(eyeCells(o, 0)); await sleep(F); }
  await sleep(350);
  for (let i = 0; i < 9; i++) { frame(noisy(tear(eyeCells(1, 0), 0.25 + i * 0.08), 0.02 + i * 0.035)); await sleep(F); }

  const th = LOGO.map((line) => [...line].map((_, x) => (x / LW) * 0.55 + Math.random() * 0.45));
  const N = 24;
  for (let i = 0; i <= N; i++) {
    const p = i / N;
    let rows = LOGO.map((line, y) => [...line].map((ch, x) => {
      if (p >= th[y][x]) return { ch, col: grad(x / LW) };
      if (ch === " " && Math.random() > 0.14) return { ch: " ", col: DARK };
      return { ch: pick(NOISE), col: Math.random() < 0.12 ? WHITE : DARK };
    }));
    if (p < 0.6) rows = tear(rows, 0.35 * (1 - p));
    frame(rows);
    await sleep(F);
  }
  for (let s = -10; s <= LW + 14; s += 3) {
    frame(LOGO.map((line, y) => [...line].map((ch, x) => ({
      ch, col: mix(grad(x / LW), WHITE, 1 - Math.abs(x - y * 2 - s) / 5),
    }))));
    await sleep(16);
  }
  frame(LOGO.map((line) => [...line].map((ch, x) => ({ ch, col: grad(x / LW) }))));

  w("\n  ");
  for (const ch of "agent-kit » скиллы и правила для Claude Code и Codex") { w(c(MINT, ch)); await sleep(9); }
  w(`\n  ${c(DARK, "github.com/Justsav1e/agent-kit")}\n`);
}

// ---------- вывод шагов
const plural = (n, [one, few, many]) => {
  const m10 = n % 10, m100 = n % 100;
  return m10 === 1 && m100 !== 11 ? one : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? few : many;
};
const skillsWord = (n) => plural(n, ["скилл", "скилла", "скиллов"]);
const tilde = (p) => (p.startsWith(HOME) ? "~" + p.slice(HOME.length) : p);
const section = (title) => w(`\n  ${c(NEON, "»")} ${BOLD}${title}${RESET}\n`);
const okLine = (text, note = "") => w(`  ${c(NEON, G.ok)} ${text}${note ? `  ${c(DARK, note)}` : ""}\n`);
const failLine = (text, note = "") => w(`  ${c(RED, G.fail)} ${text}${note ? `  ${c(RED, note)}` : ""}\n`);

let live = 0;
function drawLive(lines) {
  if (live) w(`\x1b[${live}A\x1b[0J`);
  for (const l of lines) w(`\r${l}\n`);
  live = lines.length;
}
function clearLive() {
  if (live) { w(`\x1b[${live}A\x1b[0J`); live = 0; }
}

function bar(done, total, tick) {
  const size = Math.max(10, Math.min(32, width() - 34));
  const f = total ? done / total : 1, n = Math.round(f * size);
  const glow = tick % (n + 8);
  let s = "";
  for (let i = 0; i < size; i++) {
    s += i < n ? c(mix(grad(i / size), WHITE, 1 - Math.abs(i - glow) / 2.5), "█") : c(DARK, "░");
  }
  return `  ${s}  ${BOLD}${String(Math.round(f * 100)).padStart(3)}%${RESET}  ${c(DARK, `${done}/${total}`)}`;
}

function fail(msg) {
  showCursor();
  w(`\n  ${c(RED, G.fail)} ${msg}\n\n`);
  process.exit(1);
}

// команда целиком, без вывода на экран; на Windows claude/codex/npx - это .cmd, поэтому через shell одной строкой
function run(cmd, args) {
  const r = WIN ? spawnSync([cmd, ...args].join(" "), { shell: true, encoding: "utf8" })
    : spawnSync(cmd, args, { encoding: "utf8" });
  return r.status === 0;
}

// Context7 - MCP со свежей документацией библиотек, на него опирается скилл context7-docs. Ключ не нужен
const CONTEXT7 = ["context7", "--", "npx", "-y", "@upstash/context7-mcp"];
const CLI = { "claude-code": ["claude", ["--scope", "user"]], codex: ["codex", []] };
function connectContext7(agents) {
  for (const agent of agents) {
    const [cli, scope] = CLI[agent];
    if (DEMO) { okLine(AGENT_NAMES[agent], "демо - не подключено"); continue; }
    if (run(cli, ["mcp", "get", "context7"])) { okLine(AGENT_NAMES[agent], "уже подключён"); continue; }
    if (run(cli, ["mcp", "add", ...scope, ...CONTEXT7])) okLine(AGENT_NAMES[agent]);
    else failLine(AGENT_NAMES[agent], `не вышло, вручную: ${cli} mcp add ${[...scope, ...CONTEXT7].join(" ")}`);
  }
}

function version(cmd) {
  const r = WIN ? spawnSync(`${cmd} --version`, { shell: true, encoding: "utf8" })
    : spawnSync(cmd, ["--version"], { encoding: "utf8" });
  return r.status === 0 ? (r.stdout || "").trim().replace(/^git version /, "") : null;
}

// ---------- установка
const quote = (a) => (/[\s&()^|<>"]/.test(a) ? `"${a}"` : a);

function install(task, agents, log) {
  if (DEMO) return sleep(350 + Math.random() * 900).then(() => true);
  const a = ["-y", "skills", "add", task.src, "-g", ...agents.flatMap((x) => ["-a", x]), "-s", ...task.names, "-y",
    ...(task.copy ? ["--copy"] : [])];
  log.write(`\n$ npx ${a.join(" ")}\n`);
  return new Promise((resolve) => {
    // на Windows npx - это npx.cmd, его запускаем через shell одной строкой (массив + shell Node 24 не любит)
    const opts = { cwd: KIT, stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, DISABLE_TELEMETRY: "1" } };
    child = WIN ? spawn(`npx ${a.map(quote).join(" ")}`, { ...opts, shell: true }) : spawn("npx", a, opts);
    child.stdout.pipe(log, { end: false });
    child.stderr.pipe(log, { end: false });
    child.on("error", (e) => { log.write(`${e}\n`); child = null; resolve(false); });
    child.on("close", (code) => { child = null; resolve(code === 0); });
  });
}

function readTasks() {
  const own = fs.readdirSync(path.join(KIT, "skills"))
    .filter((d) => fs.existsSync(path.join(KIT, "skills", d, "SKILL.md"))).length;
  const tasks = [{ label: "свои скиллы (skills/)", src: "./skills", names: ["*"], count: own, copy: true }];
  for (const raw of fs.readFileSync(path.join(KIT, "skills.txt"), "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const [repo, ...names] = line.split(/\s+/);
    if (names.length) tasks.push({ label: repo, src: repo, names, count: names.length });
  }
  return tasks;
}

function openLog() {
  if (DEMO) return { file: null, stream: fs.createWriteStream(os.devNull) };
  for (const dir of [KIT, os.tmpdir()]) {
    try {
      fs.accessSync(dir, fs.constants.W_OK);
      const file = path.join(dir, dir === KIT ? "install.log" : "agent-kit-install.log");
      return { file, stream: fs.createWriteStream(file) };
    } catch { /* следующая папка */ }
  }
  return { file: null, stream: fs.createWriteStream(os.devNull) };
}

function placeRules(agents) {
  const targets = { "claude-code": [".claude", "CLAUDE.md"], codex: [".codex", "AGENTS.md"] };
  for (const agent of agents) {
    if (!targets[agent]) continue;
    if (DEMO) { okLine(`~/${targets[agent].join("/")}`, "демо - не записано"); continue; }
    const dir = path.join(HOME, targets[agent][0]), file = path.join(dir, targets[agent][1]);
    fs.mkdirSync(dir, { recursive: true });
    if (fs.existsSync(file)) {
      const side = file.replace(/\.md$/, ".agent-kit.md");
      fs.copyFileSync(path.join(KIT, "AGENTS.md"), side);
      w(`  ${c(MINT, "•")} ${tilde(file)} уже есть, не трогаю ${c(DARK, `- правила рядом: ${path.basename(side)}`)}\n`);
    } else {
      fs.copyFileSync(path.join(KIT, "AGENTS.md"), file);
      okLine(tilde(file));
    }
  }
}

function box(lines) {
  const inner = Math.max(...lines.map(visible)) + 4;
  const edge = (l, r) => [...(l + "═".repeat(inner) + r)].map((ch, i) => c(grad(i / (inner + 2)), ch)).join("");
  w(`\n  ${edge("╔", "╗")}\n`);
  for (const l of lines) {
    w(`  ${c(grad(0), "║")}  ${l}${" ".repeat(inner - 4 - visible(l))}  ${c(grad(1), "║")}\n`);
  }
  w(`  ${edge("╚", "╝")}\n`);
}

// ответы в режиме --plain: строки копим в очереди, чтобы не терять ввод, набранный заранее
let lines = null;
const waiters = [];
function readLine() {
  if (!lines) {
    lines = [];
    readline.createInterface({ input: process.stdin, terminal: false })
      .on("line", (l) => (waiters.length ? waiters.shift()(l) : lines.push(l)));
  }
  return lines.length ? Promise.resolve(lines.shift()) : new Promise((r) => waiters.push(r));
}

// ---------- выбор: стрелки или цифра, Enter. Без терминала на входе (CI, перенаправление) - первый пункт по умолчанию
async function choose(title, items, def = 0) {
  section(title);
  const line = (it) => `${it.label}${it.note ? `  ${c(DARK, it.note)}` : ""}`;
  if (!process.stdin.isTTY) { okLine(line(items[def])); return def; }
  if (!TTY) {
    items.forEach((it, i) => w(`    ${i + 1}. ${line(it)}\n`));
    w(`  Номер [${def + 1}]: `);
    const n = parseInt(await readLine(), 10);
    const sel = n >= 1 && n <= items.length ? n - 1 : def;
    okLine(line(items[sel]));
    return sel;
  }
  let cur = def;
  const draw = () => drawLive([
    ...items.map((it, i) => (i === cur ? `  ${c(NEON, "❯")} ${BOLD}${it.label}${RESET}` : `    ${c(DARK, it.label)}`)
      + (it.note ? `  ${c(DARK, it.note)}` : "")),
    c(DARK, "  стрелки или цифра - выбрать, Enter - дальше"),
  ]);
  hideCursor();
  draw();
  const stdin = process.stdin;
  stdin.setRawMode(true);
  stdin.setEncoding("utf8");
  stdin.resume();
  const sel = await new Promise((resolve) => {
    const onKey = (k) => {
      if (k === "\x03") { unraw(); process.emit("SIGINT"); return; }
      if (k === "\x1b[A" || k === "k") cur = (cur + items.length - 1) % items.length;
      else if (k === "\x1b[B" || k === "j") cur = (cur + 1) % items.length;
      else if (/^[1-9]$/.test(k) && +k <= items.length) cur = +k - 1;
      else if (k === "\r" || k === "\n") { stdin.off("data", onKey); resolve(cur); return; }
      else return;
      draw();
    };
    stdin.on("data", onKey);
  });
  unraw();
  stdin.pause();
  clearLive();
  okLine(line(items[sel]));
  return sel;
}

async function main() {
  await intro();

  if (DEMO) w(`\n  ${c(MINT, "Демо: ничего не скачивается и не устанавливается")}\n`);
  section("Проверка");
  const [major] = process.versions.node.split(".").map(Number);
  if (major < 22) fail(`Node.js ${process.versions.node} слишком старый, нужен 22 или новее: https://nodejs.org`);
  okLine(`Node.js ${process.versions.node}`);
  const git = version("git");
  if (!git) fail("Нет git. Поставьте: https://git-scm.com и запустите установщик ещё раз");
  okLine(`git ${git}`);

  const found = { "claude-code": Boolean(version("claude")), codex: Boolean(version("codex")) };
  const mark = (a) => (found[a] ? "найден" : "не найден");
  const where = [
    { label: "Claude Code и Codex", agents: ["claude-code", "codex"] },
    { label: "Только Claude Code", note: mark("claude-code"), agents: ["claude-code"] },
    { label: "Только Codex", note: mark("codex"), agents: ["codex"] },
  ];
  const agents = where[await choose("Куда ставить", where,
    found["claude-code"] && !found.codex ? 1 : found.codex && !found["claude-code"] ? 2 : 0)].agents;
  const all = readTasks();
  const own = all[0].count, others = all.slice(1).reduce((n, t) => n + t.count, 0);
  const ownOnly = (await choose("Что ставить", [
    { label: "Всё", note: `мои ${own} + ${others} сторонних` },
    { label: "Только мои скиллы", note: `${own} ${skillsWord(own)} из skills/` },
  ])) === 1;

  const tasks = ownOnly ? all.slice(0, 1) : all;
  const withCli = agents.filter((a) => found[a]);
  const context7 = withCli.length > 0 && (await choose("Context7 - свежая документация библиотек для агента", [
    { label: "Подключить", note: "бесплатно, без ключа" },
    { label: "Не нужно" },
  ])) === 0;
  const total = tasks.reduce((s, t) => s + t.count, 0);
  const log = openLog();
  section(`Скиллы: ${total} ${skillsWord(total)} из ${tasks.length} ${plural(tasks.length, ["источника", "источников", "источников"])}`);

  const labelW = Math.min(Math.max(...tasks.map((t) => t.label.length)), Math.max(12, width() - 36));
  const label = (t) => (t.label.length > labelW ? t.label.slice(0, labelW - 1) + "…" : t.label.padEnd(labelW));
  const failed = [];
  let done = 0, tick = 0;
  hideCursor();
  for (const task of tasks) {
    const start = Date.now();
    const secs = () => `${((Date.now() - start) / 1000).toFixed(1)}s`;
    let timer = null;
    if (TTY) {
      const render = () => drawLive([
        `  ${c(NEON, G.spin[tick % G.spin.length])} ${label(task)}  ${c(DARK, `${task.count} ${skillsWord(task.count)}  ${secs()}`)}`,
        bar(done, total, tick++),
      ]);
      render();
      timer = setInterval(render, 80);
    } else {
      w(`  … ${task.label}\n`);
    }
    const ok = await install(task, agents, log.stream);
    clearInterval(timer);
    clearLive();
    if (ok) {
      done += task.count;
      okLine(label(task), `${String(task.count).padStart(2)}  ${secs()}`);
    } else {
      failed.push(task.label);
      failLine(label(task), "не поставился");
    }
  }
  if (TTY) {
    drawLive([bar(done, total, -100)]);
    live = 0;
  }
  await new Promise((r) => log.stream.end(r));

  section("Правила для агента");
  placeRules(agents);
  if (context7) {
    section("Context7");
    connectContext7(withCli);
  }

  const who = agents.map((a) => AGENT_NAMES[a]).join(" и ");
  const lines = failed.length
    ? [`${BOLD}${c(RED, "Почти готово")}${RESET}: ${done} из ${total} ${skillsWord(total)}`,
      `Не поставились: ${failed.join(", ")}`,
      `Подробности: ${log.file ? tilde(log.file) : "лог недоступен"}`,
      "Запустите ещё раз - установленное просто обновится"]
    : [`${BOLD}${c(NEON, "Готово")}${RESET}: ${done} ${skillsWord(done)} на месте`,
      `Перезапустите ${who} - скиллы появятся`,
      c(DARK, "Повторный запуск обновит всё до свежих версий")];
  box(lines);
  w(`\n  ${c(DARK, "justsav1e")} ${c(NEON, "♥")}\n\n`);
  showCursor();
  process.exit(failed.length ? 1 : 0);
}

main().catch((e) => fail(e && e.message ? e.message : String(e)));

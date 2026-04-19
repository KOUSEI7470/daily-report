// ==============================
// 作業員名
// ==============================
const workerNames = [
  "藤田大伸",
  "千種克典",
  "木下卓也",
  "山本聖家",
  "前川善次",
  "小野義光",
  "冨山航生",
  "田中大海",
  "稲垣英人",
  "田中昇翔"
];

// ==============================
// 分類（表示順がそのまま画面順）
// ==============================
const categories = [
  { key: "diving", label: "潜水作業員", shortLabel: "潜水" },
  { key: "land", label: "陸上作業員", shortLabel: "陸上" },
  { key: "standby", label: "待機", shortLabel: "待機" },
  { key: "move", label: "移動", shortLabel: "移動" }
];

// ==============================
// 選択状態
// ==============================
const selectedWorkers = {
  diving: new Set(),
  land: new Set(),
  standby: new Set(),
  move: new Set()
};

// ==============================
// 要素取得
// ==============================
const els = {
  workDate: document.getElementById("workDate"),
  datePreview: document.getElementById("datePreview"),
  destinationCompany: document.getElementById("destinationCompany"),
  siteName: document.getElementById("siteName"),
  meetingPlace: document.getElementById("meetingPlace"),
  primeCompany: document.getElementById("primeCompany"),
  startTime: document.getElementById("startTime"),
  endTime: document.getElementById("endTime"),
  otherNote: document.getElementById("otherNote"),
  workerSections: document.getElementById("workerSections"),
  clearButton: document.getElementById("clearButton"),
  summaryButton: document.getElementById("summaryButton"),
  excelButton: document.getElementById("excelButton"),
  summaryArea: document.getElementById("summaryArea")
};

// ==============================
// 日付関連
// ==============================
function setTodayDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  els.workDate.value = `${yyyy}-${mm}-${dd}`;
  updateDatePreview();
}

function formatDateSlash(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}/${m}/${d}`;
}

function getWeekdayShort(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  return weekdays[date.getDay()];
}

function formatDateWithWeekday(dateString) {
  const dateSlash = formatDateSlash(dateString);
  const weekday = getWeekdayShort(dateString);
  if (!dateSlash || !weekday) return "日付を選択してください";
  return `${dateSlash}（${weekday}）`;
}

function updateDatePreview() {
  els.datePreview.textContent = formatDateWithWeekday(els.workDate.value);
}

// ==============================
// 作業員ボタン生成
// ==============================
function createWorkerSections() {
  els.workerSections.innerHTML = "";

  categories.forEach((category) => {
    const block = document.createElement("div");
    block.className = "worker-block";

    const title = document.createElement("h3");
    title.className = "worker-title";
    title.textContent = `${category.label}（10名）`;

    const grid = document.createElement("div");
    grid.className = "worker-grid";

    workerNames.forEach((name) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "worker-button";
      button.textContent = name;
      button.dataset.category = category.key;
      button.dataset.name = name;

      button.addEventListener("click", () => {
        toggleWorker(category.key, name, button);
      });

      grid.appendChild(button);
    });

    block.appendChild(title);
    block.appendChild(grid);
    els.workerSections.appendChild(block);
  });
}

function toggleWorker(categoryKey, workerName, buttonEl) {
  const set = selectedWorkers[categoryKey];

  if (set.has(workerName)) {
    set.delete(workerName);
    buttonEl.classList.remove("active");
  } else {
    set.add(workerName);
    buttonEl.classList.add("active");
  }
}

// ==============================
// 入力値取得
// ==============================
function getInputValue(el) {
  return el.value.trim();
}

function getFormData() {
  return {
    workDate: getInputValue(els.workDate),
    workDateSlash: formatDateSlash(getInputValue(els.workDate)),
    weekday: getWeekdayShort(getInputValue(els.workDate)),
    workDateText: formatDateWithWeekday(getInputValue(els.workDate)),
    destinationCompany: getInputValue(els.destinationCompany),
    siteName: getInputValue(els.siteName),
    meetingPlace: getInputValue(els.meetingPlace),
    primeCompany: getInputValue(els.primeCompany),
    startTime: getInputValue(els.startTime),
    endTime: getInputValue(els.endTime),
    otherNote: getInputValue(els.otherNote),
    diving: Array.from(selectedWorkers.diving),
    land: Array.from(selectedWorkers.land),
    standby: Array.from(selectedWorkers.standby),
    move: Array.from(selectedWorkers.move)
  };
}

function getSelectedCount(data) {
  return data.diving.length + data.land.length + data.standby.length + data.move.length;
}

// ==============================
// 整理表示
// ==============================
function joinWorkerNames(list) {
  return list.length > 0 ? list.join("、") : "なし";
}

function buildSummaryText(data) {
  return [
    "【基本情報】",
    `日付：${data.workDateText}`,
    `行先会社名：${data.destinationCompany || "未入力"}`,
    `現場名：${data.siteName || "未入力"}`,
    `集合場所：${data.meetingPlace || "未入力"}`,
    `元請会社名：${data.primeCompany || "未入力"}`,
    `始業時間：${data.startTime || "未入力"}`,
    `終業時間：${data.endTime || "未入力"}`,
    "",
    "【作業員分類】",
    `潜水作業員：${joinWorkerNames(data.diving)}`,
    `陸上作業員：${joinWorkerNames(data.land)}`,
    `待機：${joinWorkerNames(data.standby)}`,
    `移動：${joinWorkerNames(data.move)}`,
    "",
    "【その他】",
    data.otherNote || "未入力"
  ].join("\n");
}

function showSummary() {
  const data = getFormData();
  els.summaryArea.textContent = buildSummaryText(data);
}

// ==============================
// 全クリア
// ==============================
function clearAll() {
  els.destinationCompany.value = "";
  els.siteName.value = "";
  els.meetingPlace.value = "";
  els.primeCompany.value = "";
  els.startTime.value = "";
  els.endTime.value = "";
  els.otherNote.value = "";

  Object.keys(selectedWorkers).forEach((key) => {
    selectedWorkers[key].clear();
  });

  document.querySelectorAll(".worker-button").forEach((button) => {
    button.classList.remove("active");
  });

  setTodayDate();
  els.summaryArea.textContent = "まだ表示されていません";
}

// ==============================
// Excel出力用
// ※ index.html に SheetJS 読み込みが必要
// ==============================
function buildReportSheetData(data) {
  return [
    ["作業日報"],
    [""],
    ["日付", data.workDateText],
    ["行先会社名", data.destinationCompany || ""],
    ["現場名", data.siteName || ""],
    ["集合場所", data.meetingPlace || ""],
    ["元請会社名", data.primeCompany || ""],
    ["始業時間", data.startTime || ""],
    ["終業時間", data.endTime || ""],
    [""],
    ["潜水作業員", joinWorkerNames(data.diving)],
    ["陸上作業員", joinWorkerNames(data.land)],
    ["待機", joinWorkerNames(data.standby)],
    ["移動", joinWorkerNames(data.move)],
    [""],
    ["その他", data.otherNote || ""]
  ];
}

function buildDatabaseRows(data) {
  const rows = [];
  let number = 1;

  categories.forEach((category) => {
    const workers = data[category.key];

    workers.forEach((workerName) => {
      rows.push({
        "日付": data.workDateSlash,
        "曜日": data.weekday,
        "番号": number,
        "作業員名": workerName,
        "種別": category.shortLabel,
        "始業時間": data.startTime || "",
        "終業時間": data.endTime || "",
        "残業": "",
        "行先会社名": data.destinationCompany || "",
        "集合場所": data.meetingPlace || "",
        "元請名": data.primeCompany || "",
        "現場名": data.siteName || "",
        "作業内容": data.otherNote || "",
        "使用器材": ""
      });
      number += 1;
    });
  });

  return rows;
}

function sanitizeFileName(text) {
  return (text || "現場名未入力")
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "_");
}

function exportExcel() {
  const data = getFormData();

  if (!data.workDate) {
    alert("日付を入力してください。");
    return;
  }

  if (getSelectedCount(data) === 0) {
    alert("作業員を1人以上選択してください。");
    return;
  }

  if (typeof XLSX === "undefined") {
    alert("Excel出力ライブラリが読み込まれていません。index.html を確認してください。");
    return;
  }

  const workbook = XLSX.utils.book_new();

  // 日報シート
  const reportData = buildReportSheetData(data);
  const reportSheet = XLSX.utils.aoa_to_sheet(reportData);
  reportSheet["!cols"] = [
    { wch: 16 },
    { wch: 42 }
  ];
  XLSX.utils.book_append_sheet(workbook, reportSheet, "日報");

  // データベース用シート
  const databaseRows = buildDatabaseRows(data);
  const databaseSheet = XLSX.utils.json_to_sheet(databaseRows);
  databaseSheet["!cols"] = [
    { wch: 12 }, // 日付
    { wch: 8 },  // 曜日
    { wch: 8 },  // 番号
    { wch: 14 }, // 作業員名
    { wch: 10 }, // 種別
    { wch: 10 }, // 始業時間
    { wch: 10 }, // 終業時間
    { wch: 8 },  // 残業
    { wch: 18 }, // 行先会社名
    { wch: 18 }, // 集合場所
    { wch: 18 }, // 元請名
    { wch: 24 }, // 現場名
    { wch: 40 }, // 作業内容
    { wch: 16 }  // 使用器材
  ];
  XLSX.utils.book_append_sheet(workbook, databaseSheet, "データベース用");

  const fileDate = data.workDateSlash.replace(/\//g, "-");
  const fileSite = sanitizeFileName(data.siteName);
  const fileName = `${fileDate}_${fileSite}_作業日報.xlsx`;

  XLSX.writeFile(workbook, fileName);
}

// ==============================
// イベント登録
// ==============================
function bindEvents() {
  els.workDate.addEventListener("change", updateDatePreview);
  els.summaryButton.addEventListener("click", showSummary);
  els.clearButton.addEventListener("click", clearAll);
  els.excelButton.addEventListener("click", exportExcel);
}

// ==============================
// 初期化
// ==============================
function init() {
  createWorkerSections();
  setTodayDate();
  bindEvents();
}

init();
// ==============================
// EmailJS 設定（config.js 参照）
// ==============================
const EMAILJS_PUBLIC_KEY = EMAILJS_CONFIG.publicKey;
const EMAILJS_SERVICE_ID = EMAILJS_CONFIG.serviceId;
const EMAILJS_TEMPLATE_ID = EMAILJS_CONFIG.templateId;

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

function buildSummaryHTML(data) {
  return `
    <div><strong>【基本情報】</strong></div>
    <div>日付：${data.workDateText}</div>
    <div>行先会社名：${data.destinationCompany || "未入力"}</div>
    <div>現場名：${data.siteName || "未入力"}</div>
    <div>集合場所：${data.meetingPlace || "未入力"}</div>
    <div>元請会社名：${data.primeCompany || "未入力"}</div>
    <div>始業時間：${data.startTime || "未入力"}</div>
    <div>終業時間：${data.endTime || "未入力"}</div>
    <br>
    <div><strong>【作業員分類】</strong></div>
    <div>潜水作業員：${joinWorkerNames(data.diving)}</div>
    <div>陸上作業員：${joinWorkerNames(data.land)}</div>
    <div>待機：${joinWorkerNames(data.standby)}</div>
    <div>移動：${joinWorkerNames(data.move)}</div>
    <br>
    <div><strong>【その他】</strong></div>
    <div>${data.otherNote || "未入力"}</div>
  `;
}

function showSummary() {
  const data = getFormData();
  els.summaryArea.innerHTML = buildSummaryHTML(data);
}

// ==============================
// メール送信用テキスト
// ==============================
function buildMailBody(data) {
  return [
    "【作業日報テスト999】",
    "",
    `日付：${data.workDateText || "未入力"}`,
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

// ==============================
// 送信
// ==============================
async function sendReport() {
  const data = getFormData();

  if (!data.workDate) {
    alert("日付を入力してください。");
    return;
  }

  if (!data.destinationCompany) {
    alert("行先会社名を入力してください。");
    return;
  }

  if (!data.siteName) {
    alert("現場名を入力してください。");
    return;
  }

  if (!data.startTime) {
    alert("始業時間を入力してください。");
    return;
  }

  if (!data.endTime) {
    alert("終業時間を入力してください。");
    return;
  }

  if (getSelectedCount(data) === 0) {
    alert("作業員を1人以上選択してください。");
    return;
  }

  if (typeof emailjs === "undefined") {
    alert("EmailJSが読み込まれていません。index.html を確認してください。");
    return;
  }

  const originalText = els.excelButton.textContent;
  const mailBody = buildMailBody(data);

  try {
    els.excelButton.disabled = true;
    els.excelButton.textContent = "送信中...";

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        message: mailBody
      }
    );

    els.summaryArea.innerHTML =
      buildSummaryHTML(data) + "<br><br><strong>送信完了しました。</strong>";
    alert("送信が完了しました。");
  } catch (error) {
    console.error("送信エラー:", error);
    alert("送信に失敗しました。EmailJSの設定を確認してください。");
  } finally {
    els.excelButton.disabled = false;
    els.excelButton.textContent = originalText;
  }
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
  els.summaryArea.textContent = "ここに表示";
}

function roundTimeStringToStep(timeString, stepSeconds = 300) {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return timeString;

  const totalSeconds = hours * 3600 + minutes * 60;
  const steppedSeconds = Math.round(totalSeconds / stepSeconds) * stepSeconds;
  const steppedHours = Math.floor((steppedSeconds % 86400) / 3600);
  const steppedMinutes = Math.floor((steppedSeconds % 3600) / 60);
  return `${String(steppedHours).padStart(2, "0")}:${String(steppedMinutes).padStart(2, "0")}`;
}

// ==============================
// イベント登録
// ==============================
function bindEvents() {
  els.workDate.addEventListener("change", updateDatePreview);
  els.summaryButton.addEventListener("click", showSummary);
  els.clearButton.addEventListener("click", clearAll);
  els.excelButton.addEventListener("click", sendReport);

  if (els.startTime) {
    els.startTime.setAttribute("step", "300");
    const snapStartTime = () => {
      els.startTime.value = roundTimeStringToStep(els.startTime.value, 300);
    };
    els.startTime.addEventListener("input", snapStartTime);
    els.startTime.addEventListener("change", snapStartTime);
    els.startTime.addEventListener("blur", snapStartTime);
  }

  if (els.endTime) {
    els.endTime.setAttribute("step", "300");
    const snapEndTime = () => {
      els.endTime.value = roundTimeStringToStep(els.endTime.value, 300);
    };
    els.endTime.addEventListener("input", snapEndTime);
    els.endTime.addEventListener("change", snapEndTime);
    els.endTime.addEventListener("blur", snapEndTime);
  }
}

// ==============================
// 初期化
// ==============================
function init() {
  emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY
  });

  createWorkerSections();
  setTodayDate();
  bindEvents();
}

init();
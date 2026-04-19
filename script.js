// ==============================
// EmailJS 設定
// ==============================
const EMAILJS_PUBLIC_KEY = "ここにPublic Key";
const EMAILJS_SERVICE_ID = "ここにService ID";
const EMAILJS_TEMPLATE_ID = "ここにTemplate ID";

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

function buildSummaryHTML(data) {
  return `
    <div class="summary-section">
      <h3>基本情報</h3>
      <div class="summary-row"><span class="summary-label">日付</span><span>${data.workDateText}</span></div>
      <div class="summary-row"><span class="summary-label">行先会社名</span><span>${data.destinationCompany || "未入力"}</span></div>
      <div class="summary-row"><span class="summary-label">現場名</span><span>${data.siteName || "未入力"}</span></div>
      <div class="summary-row"><span class="summary-label">集合場所</span><span>${data.meetingPlace || "未入力"}</span></div>
      <div class="summary-row"><span class="summary-label">元請会社名</span><span>${data.primeCompany || "未入力"}</span></div>
      <div class="summary-row"><span class="summary-label">始業時間</span><span>${data.startTime || "未入力"}</span></div>
      <div class="summary-row"><span class="summary-label">終業時間</span><span>${data.endTime || "未入力"}</span></div>
    </div>
    <div class="summary-section">
      <h3>作業員分類</h3>
      <div class="summary-row"><span class="summary-label">潜水作業員</span><span>${joinWorkerNames(data.diving)}</span></div>
      <div class="summary-row"><span class="summary-label">陸上作業員</span><span>${joinWorkerNames(data.land)}</span></div>
      <div class="summary-row"><span class="summary-label">待機</span><span>${joinWorkerNames(data.standby)}</span></div>
      <div class="summary-row"><span class="summary-label">移動</span><span>${joinWorkerNames(data.move)}</span></div>
    </div>
    <div class="summary-section">
      <h3>その他</h3>
      <div class="summary-row summary-note">${data.otherNote || "未入力"}</div>
    </div>
  `;
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
  els.summaryArea.innerHTML = buildSummaryHTML(data);
}

// ==============================
// メール送信用テキスト
// ==============================
function buildMailBody(data) {
  return [
    "【作業日報】",
    "",
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

// ==============================
// 送信
// ==============================
async function sendReport() {
  const data = getFormData();

  if (!data.workDate) {
    alert("日付を入力してください。");
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

  try {
    els.excelButton.disabled = true;
    els.excelButton.textContent = "送信中...";

    const templateParams = {
      work_date: data.workDateText,
      destination_company: data.destinationCompany || "未入力",
      site_name: data.siteName || "未入力",
      meeting_place: data.meetingPlace || "未入力",
      prime_company: data.primeCompany || "未入力",
      start_time: data.startTime || "未入力",
      end_time: data.endTime || "未入力",
      diving_workers: joinWorkerNames(data.diving),
      land_workers: joinWorkerNames(data.land),
      standby_workers: joinWorkerNames(data.standby),
      move_workers: joinWorkerNames(data.move),
      other_note: data.otherNote || "未入力",
      message: buildMailBody(data)
    };

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    els.summaryArea.textContent = `${buildSummaryText(data)}\n\n送信完了しました。`;
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
  els.summaryArea.textContent = "まだ表示されていません";
}

// ==============================
// イベント登録
// ==============================
function bindEvents() {
  els.workDate.addEventListener("change", updateDatePreview);
  els.summaryButton.addEventListener("click", showSummary);
  els.clearButton.addEventListener("click", clearAll);
  els.excelButton.addEventListener("click", sendReport);
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
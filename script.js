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

const categories = [
  { key: "diving", label: "潜水" },
  { key: "land", label: "陸上" },
  { key: "standby", label: "待機" },
  { key: "move", label: "移動" }
];

const selectedWorkers = {
  diving: new Set(),
  land: new Set(),
  standby: new Set(),
  move: new Set()
};

const workDate = document.getElementById("workDate");
const workerSections = document.getElementById("workerSections");
const summaryButton = document.getElementById("summaryButton");
const clearButton = document.getElementById("clearButton");
const excelButton = document.getElementById("excelButton");
const summaryArea = document.getElementById("summaryArea");

function setTodayDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  workDate.value = `${yyyy}-${mm}-${dd}`;
}

function formatDateWithWeekday(dateString) {
  if (!dateString) return "日付を選択してください";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "日付を選択してください";

  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const w = weekdays[date.getDay()];

  return `${y}/${m}/${d}（${w}）`;
}

function formatDateSlash(dateString) {
  if (!dateString) return "";
  const datePart = dateString.split('（')[0]; // 曜日部分を除去
  const date = new Date(datePart);
  if (isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}/${m}/${d}`;
}

function getWeekdayShort(dateString) {
  if (!dateString) return "";
  const datePart = dateString.split('（')[0]; // 曜日部分を除去
  const date = new Date(datePart);
  if (isNaN(date.getTime())) return "";
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  return weekdays[date.getDay()];
}

function createWorkerSections() {
  workerSections.innerHTML = "";

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
    workerSections.appendChild(block);
  });
}

function toggleWorker(categoryKey, name, button) {
  const targetSet = selectedWorkers[categoryKey];

  if (targetSet.has(name)) {
    targetSet.delete(name);
    button.classList.remove("active");
  } else {
    targetSet.add(name);
    button.classList.add("active");
  }
}

function getInputValue(id) {
  return document.getElementById(id).value.trim();
}

function formatWorkerList(setObject) {
  const list = Array.from(setObject);
  return list.length > 0 ? list.join("、") : "なし";
}

function buildSummaryText() {
  const dateText = formatDateWithWeekday(workDate.value);
  const destinationCompany = getInputValue("destinationCompany");
  const siteName = getInputValue("siteName");
  const meetingPlace = getInputValue("meetingPlace");
  const primeCompany = getInputValue("primeCompany");
  const startTime = getInputValue("startTime");
  const endTime = getInputValue("endTime");
  const otherNote = getInputValue("otherNote");

  return [
    "【基本情報】",
    `日付：${dateText}`,
    `行先会社名：${destinationCompany || "未入力"}`,
    `現場名：${siteName || "未入力"}`,
    `集合場所：${meetingPlace || "未入力"}`,
    `元請会社名：${primeCompany || "未入力"}`,
    `始業時間：${startTime || "未入力"}`,
    `終業時間：${endTime || "未入力"}`,
    "",
    "【作業員分類】",
    `潜水：${formatWorkerList(selectedWorkers.diving)}`,
    `陸上：${formatWorkerList(selectedWorkers.land)}`,
    `待機：${formatWorkerList(selectedWorkers.standby)}`,
    `移動：${formatWorkerList(selectedWorkers.move)}`,
    "",
    "【その他】",
    `${otherNote || "未入力"}`
  ].join("\n");
}

function showSummary() {
  summaryArea.textContent = buildSummaryText();
}

function clearAll() {
  document.getElementById("destinationCompany").value = "";
  document.getElementById("siteName").value = "";
  document.getElementById("meetingPlace").value = "";
  document.getElementById("primeCompany").value = "";
  document.getElementById("startTime").value = "";
  document.getElementById("endTime").value = "";
  document.getElementById("otherNote").value = "";

  categories.forEach((category) => {
    selectedWorkers[category.key].clear();
  });

  document.querySelectorAll(".worker-button").forEach((button) => {
    button.classList.remove("active");
  });

  workDate.type = "date";
  setTodayDate();
  summaryArea.textContent = "まだ表示されていません";
}

function getFormData() {
  return {
    workDate: getInputValue("workDate"),
    workDateText: formatDateWithWeekday(getInputValue("workDate")),
    workDateSlash: formatDateSlash(getInputValue("workDate")),
    weekday: getWeekdayShort(getInputValue("workDate")),
    destinationCompany: getInputValue("destinationCompany"),
    siteName: getInputValue("siteName"),
    meetingPlace: getInputValue("meetingPlace"),
    primeCompany: getInputValue("primeCompany"),
    startTime: getInputValue("startTime"),
    endTime: getInputValue("endTime"),
    otherNote: getInputValue("otherNote"),
    diving: Array.from(selectedWorkers.diving),
    land: Array.from(selectedWorkers.land),
    standby: Array.from(selectedWorkers.standby),
    move: Array.from(selectedWorkers.move)
  };
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
        "種別": category.label,
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
    ["潜水", data.diving.length ? data.diving.join("、") : "なし"],
    ["陸上", data.land.length ? data.land.join("、") : "なし"],
    ["待機", data.standby.length ? data.standby.join("、") : "なし"],
    ["移動", data.move.length ? data.move.join("、") : "なし"],
    [""],
    ["その他", data.otherNote || ""]
  ];
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

  const selectedCount =
    data.diving.length +
    data.land.length +
    data.standby.length +
    data.move.length;

  if (selectedCount === 0) {
    alert("作業員を1人以上選択してください。");
    return;
  }

  const workbook = XLSX.utils.book_new();

  // 日報シート
  const reportData = buildReportSheetData(data);
  const reportSheet = XLSX.utils.aoa_to_sheet(reportData);

  reportSheet["!cols"] = [
    { wch: 16 },
    { wch: 45 }
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
    { wch: 22 }, // 現場名
    { wch: 40 }, // 作業内容
    { wch: 16 }  // 使用器材
  ];

  XLSX.utils.book_append_sheet(workbook, databaseSheet, "データベース用");

  const fileDate = data.workDateSlash.replace(/\//g, "-");
  const fileSite = sanitizeFileName(data.siteName);
  const fileName = `${fileDate}_${fileSite}_作業日報.xlsx`;

  XLSX.writeFile(workbook, fileName);
workDate.addEventListener("change", () => {
  if (workDate.value) {
    workDate.type = "text";
    workDate.value = formatDateWithWeekday(workDate.value);
  }
});
summaryButton.addEventListener("click", showSummary);
clearButton.addEventListener("click", clearAll);
excelButton.addEventListener("click", exportExcel);

createWorkerSections();
setTodayDate();
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
  { key: "diving", label: "潜水作業員" },
  { key: "land", label: "陸上作業員" },
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
const datePreview = document.getElementById("datePreview");
const workerSections = document.getElementById("workerSections");
const summaryButton = document.getElementById("summaryButton");
const clearButton = document.getElementById("clearButton");
const summaryArea = document.getElementById("summaryArea");

function setTodayDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  workDate.value = `${yyyy}-${mm}-${dd}`;
  updateDatePreview();
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

function updateDatePreview() {
  datePreview.textContent = formatDateWithWeekday(workDate.value);
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
    `潜水作業員：${formatWorkerList(selectedWorkers.diving)}`,
    `陸上作業員：${formatWorkerList(selectedWorkers.land)}`,
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

  setTodayDate();
  summaryArea.textContent = "まだ表示されていません";
}

workDate.addEventListener("change", updateDatePreview);
summaryButton.addEventListener("click", showSummary);
clearButton.addEventListener("click", clearAll);

createWorkerSections();
setTodayDate();
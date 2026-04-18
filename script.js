const workerNames = [
  "藤田大伸",
  "千種克典",
  "木下卓也",
  "山本聖家",
  "前川義次",
  "小野義光",
  "富山航生",
  "田中大海",
  "稲垣英人",
  "田中昇翔"
];

const sectionData = [
  { title: "潜水作業員", names: workerNames },
  { title: "陸上作業員", names: workerNames },
  { title: "待機", names: workerNames },
  { title: "移動", names: workerNames }
];

function createSections() {
  const sections = document.getElementById("sections");

  sectionData.forEach((section, sectionIndex) => {
    const div = document.createElement("div");
    div.className = "section";

    const title = document.createElement("div");
    title.className = "section-title";
    title.textContent = section.title;

    const grid = document.createElement("div");
    grid.className = "name-grid";

    section.names.forEach(name => {
      const button = document.createElement("button");
      button.className = "name-button";
      button.textContent = name;

      button.addEventListener("click", () => {
        // 同じ名前を全部OFF
        document.querySelectorAll(".name-button").forEach(b => {
          if (b.textContent === name) {
            b.classList.remove("selected");
          }
        });

        // 今押したのだけON
        button.classList.add("selected");
      });

      grid.appendChild(button);
    });

    div.appendChild(title);
    div.appendChild(grid);
    sections.appendChild(div);
  });
}

createSections();
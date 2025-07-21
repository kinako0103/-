const form = document.getElementById("entryForm");
const amountInput = document.getElementById("amount");
const typeSelect = document.getElementById("type");
const categorySelect = document.getElementById("category");
const summary = document.getElementById("summary");

let data = JSON.parse(localStorage.getItem("kakeiboData")) || [];

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const entry = {
    amount: parseInt(amountInput.value),
    type: typeSelect.value,
    category: categorySelect.value,
    date: new Date().toISOString(),
  };
  data.push(entry);
  localStorage.setItem("kakeiboData", JSON.stringify(data));
  form.reset();
  updateSummary();
});

function updateSummary() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const monthlyData = data.filter(
    (entry) => new Date(entry.date).getMonth() === currentMonth
  );

  const totalIncome = monthlyData
    .filter((e) => e.type === "収入")
    .reduce((sum, e) => sum + e.amount, 0);
  const totalExpense = monthlyData
    .filter((e) => e.type === "支出")
    .reduce((sum, e) => sum + e.amount, 0);

  summary.textContent = `収入: ¥${totalIncome} ／ 支出: ¥${totalExpense} ／ 残高: ¥${
    totalIncome - totalExpense
  }`;

  // グラフ描画
  const categoryTotals = {};
  monthlyData
    .filter((e) => e.type === "支出")
    .forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });

  const ctx = document.getElementById("summaryChart").getContext("2d");
  if (window.summaryChart) {
    window.summaryChart.destroy();
  }
  window.summaryChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          data: Object.values(categoryTotals),
          backgroundColor: [
            "#ff6384",
            "#36a2eb",
            "#cc65fe",
            "#ffce56",
            "#66cc99",
            "#9999ff",
            "#ff9966",
          ],
        },
      ],
    },
  });
}

updateSummary();

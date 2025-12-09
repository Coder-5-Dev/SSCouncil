let balance = 0;

document.getElementById("cashForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const description = document.getElementById("description").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const type = document.getElementById("type").value;

  if (!description || isNaN(amount)) return;

  if (type === "income") {
    balance += amount;
  } else {
    balance -= amount;
  }

  const table = document.getElementById("reportTable").querySelector("tbody");
  const row = table.insertRow();

  row.innerHTML = `
    <td>${description}</td>
    <td style="color:${type === 'income' ? '#2e7d32' : '#d50000'}">${type.toUpperCase()}</td>
    <td>${type === 'income' ? "+" : "-"} $${amount.toFixed(2)}</td>
    <td>$${balance.toFixed(2)}</td>
  `;

  document.getElementById("cashForm").reset();
});

document.getElementById("cashflowForm").addEventListener("submit", function(e) {
  e.preventDefault();

  // Get values
  let membership = parseFloat(document.getElementById("membership").value) || 0;
  let lockers = parseFloat(document.getElementById("lockers").value) || 0;
  let thinkboard = parseFloat(document.getElementById("thinkboard").value) || 0;
  let brainfreeze = parseFloat(document.getElementById("brainfreeze").value) || 0;
  let supplies = parseFloat(document.getElementById("supplies").value) || 0;
  let internet = parseFloat(document.getElementById("internet").value) || 0;
  let office = parseFloat(document.getElementById("office").value) || 0;
  let cleaning = parseFloat(document.getElementById("cleaning").value) || 0;
  let misc = parseFloat(document.getElementById("misc").value) || 0;
  let beginning = parseFloat(document.getElementById("beginning").value) || 0;

  // Compute totals
  let totalCashIn = membership + lockers;
  let totalCashOut = thinkboard + brainfreeze + supplies + internet + office + cleaning + misc;
  let netOperating = totalCashIn - totalCashOut;

  let netIncrease = netOperating; // no investing/financing in this example
  let endingBalance = beginning + netIncrease;

  // Generate Report
  let reportHTML = `
    <h3>Statement of Cash Flows</h3>
    <p><strong>For the Month Ended:</strong> June 30, 2025</p>
    <table>
      <tr><th colspan="2">Cash Flows from Operating Activities</th></tr>
      <tr><td>Cash Received from Membership Fees</td><td>${membership.toFixed(2)}</td></tr>
      <tr><td>Cash Received from Locker Rentals</td><td>${lockers.toFixed(2)}</td></tr>
      <tr><td>Cash Payments (Projects, Supplies, etc.)</td><td>(${totalCashOut.toFixed(2)})</td></tr>
      <tr><td><strong>Net Cash from Operating Activities</strong></td><td><strong>${netOperating.toFixed(2)}</strong></td></tr>
      <tr><td colspan="2"><strong>Cash Flows from Investing Activities</strong> - None</td></tr>
      <tr><td colspan="2"><strong>Cash Flows from Financing Activities</strong> - None</td></tr>
      <tr><td>Net Increase in Cash</td><td>${netIncrease.toFixed(2)}</td></tr>
      <tr><td>Cash at Beginning</td><td>${beginning.toFixed(2)}</td></tr>
      <tr><td><strong>Cash at End of Period</strong></td><td><strong>${endingBalance.toFixed(2)}</strong></td></tr>
    </table>
  `;

  document.getElementById("report").innerHTML = reportHTML;
});

// --- JS Date Labels ---
function updateFinanceDates() {
  const today = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const monthOptions = { month: 'long', year: 'numeric' };

  document.getElementById("today-date").textContent = today.toLocaleDateString('en-US', options);

  const first = today.getDate() - today.getDay() + 1;
  const last = first + 6;
  const startOfWeek = new Date(today.setDate(first));
  const endOfWeek = new Date(today.setDate(last));
  document.getElementById("week-range").textContent =
    `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

  document.getElementById("month-name").textContent = new Date().toLocaleDateString('en-US', monthOptions);
  document.getElementById("generated-date").textContent = new Date().toLocaleString();
}

// --- JS Table Filter & Search ---
function filterTable() {
  const filterDate = document.getElementById("dateFilter").value;
  const rows = document.querySelectorAll("#transactionTable tbody tr");
  rows.forEach(row => {
    const date = row.cells[1].textContent.trim();
    row.style.display = !filterDate || date.includes(filterDate) ? "" : "none";
  });
}

document.getElementById("searchInput").addEventListener("keyup", function() {
  const query = this.value.toLowerCase();
  const rows = document.querySelectorAll("#transactionTable tbody tr");
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(query) ? "" : "none";
  });
});

document.addEventListener("DOMContentLoaded", updateFinanceDates);
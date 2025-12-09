// ------------------------- AUTO DATE SETUP -------------------------
document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById('report-week');
    const savedDate = localStorage.getItem('selectedReportDate'); // keep user’s manual choice

    if (dateInput) {
        // If user previously picked a date, use that. Otherwise, set today's date.
        if (savedDate) {
            dateInput.value = savedDate;
        } else {
            const today = new Date();
            const formattedToday = today.toISOString().split('T')[0]; // YYYY-MM-DD
            dateInput.value = formattedToday;
        }

        // Update displayed report date
        updateReportDate();

        // Start the live clock
        startClock();

        // Listen for manual changes
        dateInput.addEventListener('change', () => {
            localStorage.setItem('selectedReportDate', dateInput.value); // save user choice
            updateReportDate();
        });
    }
});

// ------------------------- UPDATE REPORT DATE -------------------------
function updateReportDate() {
    const dateInput = document.getElementById('report-week');
    const reportDate = document.getElementById('report-date');
    if (!dateInput || !reportDate) return;

    const dateValue = dateInput.value;
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];

    // If the input date is today, always show today's report label
    if (dateValue === formattedToday) {
        const formattedTodayText = today.toLocaleDateString('default', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
        reportDate.textContent = `For the Date of ${formattedTodayText}`;
        return;
    }

    if (dateValue) {
        const selectedDate = new Date(dateValue);
        const lastDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

        // Determine if the selected date falls in the last week of the month
        const weekEnd = new Date(selectedDate);
        weekEnd.setDate(selectedDate.getDate() + 6);
        const isLastWeekOfMonth = weekEnd >= lastDayOfMonth;

        // Format the selected date
        const formattedDate = selectedDate.toLocaleDateString('default', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });

        // Decide whether to show week or month ended
        if (isLastWeekOfMonth) {
            const endDate = lastDayOfMonth.toLocaleDateString('default', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
            reportDate.textContent = `For the Month Ended of ${endDate}`;
        } else {
            reportDate.textContent = `For the Week Ended of ${formattedDate}`;
        }
    } else {
        reportDate.textContent = "For the Week/Month Ended of ...";
    }
}

// ------------------------- REALTIME DATE & TIME -------------------------
function updateDateTime() {
    const now = new Date();

    const date = now.getFullYear() + "-" +
        String(now.getMonth() + 1).padStart(2, "0") + "-" +
        String(now.getDate()).padStart(2, "0");

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const time = `${hours}:${minutes}:${seconds}`;

    const dateTime = `${date} ${time}`;
    const realtimeInput = document.getElementById("realtime");
    if (realtimeInput) realtimeInput.value = dateTime;
}

// ------------------------- START CLOCK (SYNCED) -------------------------
function startClock() {
    updateDateTime(); // Initial update
    const now = new Date();
    const msUntilNextSecond = 1000 - now.getMilliseconds();

    setTimeout(() => {
        updateDateTime();
        setInterval(updateDateTime, 1000);
    }, msUntilNextSecond);
}

// ------------------------- CLOCK INITIALIZATION -------------------------
document.addEventListener("DOMContentLoaded", startClock);


// ------------------------- MAIN CASH FLOW SCRIPT -------------------------
document.addEventListener("DOMContentLoaded", function () {
    const forms = document.querySelectorAll("#addItemForm");
    const tables = document.querySelectorAll("#miscTable");
    const totalRows = document.querySelectorAll("#totalRow");
    const saveBtns = document.querySelectorAll("#saveBtn"); // Save buttons for each section

    forms.forEach((form, index) => {
        const addBtn = form.querySelector("#addBtn");
        const clearBtn = form.querySelector("#clearBtn");
        const clearTableBtn = form.querySelector("#clearTableBtn");
        const itemName = form.querySelector("#itemName");
        const itemPrice = form.querySelector("#itemPrice");
        const table = tables[index].querySelector("tbody");
        const totalRow = totalRows[index];

        // Load saved items for this table
        loadTable(index);

        // ------------------ Add Item ------------------
        addBtn.addEventListener("click", addItem);
        clearBtn.addEventListener("click", () => {
            itemName.value = "";
            itemPrice.value = "";
        });

        [itemName, itemPrice].forEach(input => {
            input.addEventListener("keypress", function (e) {
                if (e.key === "Enter") {
                    e.preventDefault();
                    addItem();
                }
            });
        });

        function addItem() {
            const name = itemName.value.trim();
            const price = parseFloat(itemPrice.value);

            if (!name || isNaN(price)) {
                alert("Please enter valid description and total collection.");
                return;
            }

            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>${name}</td>
                <td style="text-align:right;">${Math.abs(price).toFixed(2)}</td>
            `;
            table.insertBefore(newRow, totalRow);

            saveTable(index);
            updateTotal(totalRow, table);
            updateNetOperatingCash();

            itemName.value = "";
            itemPrice.value = "";
            itemName.focus();
        }

        // ------------------ Clear Table ------------------
        clearTableBtn.addEventListener("click", () => {
            Array.from(table.querySelectorAll("tr")).forEach(r => {
                if (r !== totalRow) r.remove();
            });
            totalRow.cells[1].innerText = "0.00";
            saveTable(index);
            updateNetOperatingCash();
        });

        // ------------------ Save Table to Database ------------------
        if (saveBtns[index]) {
            saveBtns[index].addEventListener("click", () => {
                if (index === 0) {
                    saveReceivedItems(index); // first table = received
                } else if (index === 1) {
                    savePaymentItems(index); // second table = payments
                }
            });
        }

        // ------------------ Local Storage ------------------
        function saveTable(idx) {
            const rows = Array.from(table.querySelectorAll("tr")).filter(r => r !== totalRow);
            const items = rows.map(row => ({
                description: row.cells[0].innerText,
                total_collection: parseFloat(row.cells[1].innerText)
            }));
            localStorage.setItem("table_" + idx, JSON.stringify(items));
        }

        function loadTable(idx) {
            const saved = localStorage.getItem("table_" + idx);
            if (!saved) return;
            const items = JSON.parse(saved);
            items.forEach(item => {
                const newRow = document.createElement("tr");
                newRow.innerHTML = `
                    <td>${item.description}</td>
                    <td style="text-align:right;">${Math.abs(item.total_collection).toFixed(2)}</td>
                `;
                table.insertBefore(newRow, totalRow);
            });
            updateTotal(totalRow, table);
            updateNetOperatingCash();
        }
    });

    // ------------------ Update Total for Each Table ------------------
    function updateTotal(totalRow, table) {
        let total = 0;
        Array.from(table.querySelectorAll("tr")).forEach(row => {
            if (row !== totalRow) {
                const cell = row.cells[1];
                if (cell) total += parseFloat(cell.innerText);
            }
        });
        totalRow.cells[1].innerText = Math.abs(total).toFixed(2);
    }

    // ------------------ Net Cash from Operating Activities ------------------
    function updateNetOperatingCash() {
        const totalRows = document.querySelectorAll("#totalRow");
        if (totalRows.length < 3) return;

        const totalReceived = parseFloat(totalRows[0].cells[1].textContent) || 0;
        const totalPayments = parseFloat(totalRows[1].cells[1].textContent) || 0;
        const netOperatingCash = totalReceived - totalPayments;

        const netRow = totalRows[2];
        netRow.cells[1].textContent = Math.abs(netOperatingCash).toFixed(2);

        localStorage.setItem("net_operating_total", netOperatingCash.toFixed(2));
    }

    // ------------------ Load Net Operating Cash on Page Load ------------------
    window.addEventListener("load", function() {
        const savedOperating = parseFloat(localStorage.getItem("net_operating_total")) || 0;
        const totalRows = document.querySelectorAll("#totalRow");
        if (totalRows.length >= 3) {
            totalRows[2].cells[1].textContent = Math.abs(savedOperating).toFixed(2);
        }
    });
});

// ------------------ Save Received Items to Database ------------------
function saveReceivedItems(tableIndex) {
    const tables = document.querySelectorAll("#miscTable");
    const totalRows = document.querySelectorAll("#totalRow");
    const table = tables[tableIndex].querySelector("tbody");
    const totalRow = totalRows[tableIndex];

    const rows = Array.from(table.querySelectorAll("tr")).filter(r => r !== totalRow);
    if (rows.length === 0) {
        alert("No received items to save!");
        return;
    }

    const items = rows.map(row => ({
        description_received: row.cells[0].innerText,
        total_collection_received: parseFloat(row.cells[1].innerText)
    }));

    fetch("/statement_cash_flow/add_received", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: items })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Received items saved successfully!");
        } else {
            alert("Failed to save received items: " + data.error);
        }
    })
    .catch(err => console.error("Error saving received items:", err));
}

// ------------------ Save Payment Items to Database ------------------
function savePaymentItems(tableIndex) {
    const tables = document.querySelectorAll("#miscTable");
    const totalRows = document.querySelectorAll("#totalRow");
    const table = tables[tableIndex].querySelector("tbody");
    const totalRow = totalRows[tableIndex];

    const rows = Array.from(table.querySelectorAll("tr")).filter(r => r !== totalRow);
    if (rows.length === 0) {
        alert("No payment items to save!");
        return;
    }

    const items = rows.map(row => ({
        description_payments: row.cells[0].innerText,
        total_payment_payments: parseFloat(row.cells[1].innerText)
    }));

    fetch("/statement_cash_flow/add_payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: items })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Payment items saved successfully!");
        } else {
            alert("Failed to save payment items: " + data.error);
        }
    })
    .catch(err => console.error("Error saving payment items:", err));
}

// ------------------ Update Net Cash Flow Table (Independent) ------------------
function updateFinalNetCash(totalOperatingCash) {
    const netCashTable = document.querySelector("table:last-of-type");
    if (!netCashTable) return;

    const rows = netCashTable.querySelectorAll("tr");
    const netIncreaseCell = rows[0].cells[1];
    const beginningCashCell = rows[1].cells[1];
    const endCashCell = rows[2].cells[1];

    let beginningCash = parseFloat(localStorage.getItem("beginning_cash")) || 0;

    const displayNetIncrease = Math.abs(totalOperatingCash);
    const endCash = beginningCash + totalOperatingCash;

    netIncreaseCell.textContent = displayNetIncrease.toFixed(2);
    beginningCashCell.textContent = beginningCash.toFixed(2);
    endCashCell.textContent = Math.abs(endCash).toFixed(2);
}

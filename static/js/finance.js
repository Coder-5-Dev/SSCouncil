// ✅ Display current report date
function updateReportDate() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById("report-date").textContent =
        `For the Week Ended ${now.toLocaleDateString('en-PH', options)}`;
}
updateReportDate();

// ✅ Parse numbers safely
function parseValue(text) {
    text = text.replace(/[₱,]/g, '').trim();
    if (text.startsWith('(') && text.endsWith(')')) {
        return parseFloat(text.slice(1, -1)) || 0;
    }
    return parseFloat(text) || 0;
}

// ✅ Live time updater (synchronized)
function updateDateTime() {
    const now = new Date();

    // Format date
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(now.getDate()).padStart(2, '0');

    // Format time
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    document.getElementById("realtime").value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Update every second
setInterval(updateDateTime, 1000);
updateDateTime();

document.addEventListener("DOMContentLoaded", function () {
    const STORAGE_KEY = "finance_cache";
    const RESET_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in ms

    // --- Get values from table ---
    const cashStartElem = document.querySelector("td:has(b:contains('Cash at the Beginning of the Period')) + .amount");
    const cashEndElem = document.querySelector("td:has(b:contains('Cash at the End of the Period')) + .amount");

    // Utility to parse ₱ formatted values (keeps negative for logic)
    function parsePeso(value) {
        return parseFloat(value.replace(/[₱,]/g, "")) || 0;
    }

    // Utility to format ₱ currency (removes "-" sign from display only)
    function formatPeso(value) {
        const cleaned = Math.abs(value); // <- this only affects display, not logic
        return "₱" + cleaned.toLocaleString("en-PH", { minimumFractionDigits: 2 });
    }

    // --- Load or initialize cache ---
    let savedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
        lastReset: Date.now(),
        startCash: 0,
    };

    const now = Date.now();

    // --- If more than 24 hours passed, reset records ---
    if (now - savedData.lastReset >= RESET_INTERVAL) {
        console.log("🕒 24 hours passed — resetting cash flow data...");

        // Get yesterday’s end cash as new starting point
        const yesterdayEnd = parsePeso(cashEndElem.textContent);
        savedData.startCash = yesterdayEnd;
        savedData.lastReset = now;

        // ✅ Clear table lists dynamically (keep headers + totals)
        const table = document.querySelector("#cashFlowTable tbody");
        const rows = table.querySelectorAll("tr");
        rows.forEach((row) => {
            if (
                !row.classList.contains("highlight") &&
                !row.classList.contains("highlight-total") &&
                !row.classList.contains("total") &&
                !row.querySelector("b")
            ) {
                row.remove(); // remove only regular list items
            }
        });

        // Update displayed starting cash (remove negative visually)
        cashStartElem.textContent = formatPeso(savedData.startCash);

        // Save updated data
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));
        location.reload(); // refresh to reflect reset state
    } else {
        console.log("⏳ Cash flow data still within 24-hour window.");
    }

    // --- Always update cache with latest end cash ---
    savedData.lastEndCash = parsePeso(cashEndElem.textContent);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));
});

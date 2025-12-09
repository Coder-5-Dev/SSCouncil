document.addEventListener("DOMContentLoaded", function() {
    const addBtn = document.getElementById("addBtn");
    const clearBtn = document.getElementById("clearBtn");
    const clearTableBtn = document.getElementById("clearTableBtn");
    const itemName = document.getElementById("itemName");
    const itemPrice = document.getElementById("itemPrice");
    const saveBtn = document.getElementById("saveBtn");

    // ---------------- BUTTON ACTIONS ----------------
    addBtn.addEventListener("click", addItem);
    clearBtn.addEventListener("click", clearItem);
    clearTableBtn.addEventListener("click", clearTable);
    saveBtn.addEventListener("click", saveTotalExpense);

    // Press Enter in input fields to add item
    [itemName, itemPrice].forEach(input => {
        input.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                e.preventDefault();
                addItem();
            }
        });
    });

    // ---------------- LOAD SAVED DATA ----------------
    loadTable();

    // ---------------- FUNCTIONS ----------------
    function addItem() {
        const name = itemName.value.trim();
        const price = parseFloat(itemPrice.value);

        if (name === "" || isNaN(price)) {
            alert("Please enter a valid item name and price.");
            return;
        }

        const table = document.getElementById("miscTable").getElementsByTagName('tbody')[0];
        const row = table.insertRow(table.rows.length - 1); // Insert before total row

        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);

        cell1.textContent = name;
        cell2.textContent = price.toFixed(2);
        cell2.style.textAlign = "right";

        updateTotal();
        saveTable(); // Save to localStorage
        clearItem();
    }

    function clearItem() {
        itemName.value = "";
        itemPrice.value = "";
        itemName.focus();
    }

    function clearTable() {
        const table = document.getElementById("miscTable").getElementsByTagName('tbody')[0];
        while (table.rows.length > 1) {
            table.deleteRow(0);
        }
        updateTotal();
        localStorage.removeItem("miscTableData");
    }

    function updateTotal() {
        const table = document.getElementById("miscTable").getElementsByTagName('tbody')[0];
        let total = 0;
        for (let i = 0; i < table.rows.length - 1; i++) {
            total += parseFloat(table.rows[i].cells[1].textContent);
        }
        document.getElementById("totalRow").cells[1].textContent = total.toFixed(2);
    }

    // ---------------- LOCAL STORAGE ----------------
    function saveTable() {
        const table = document.getElementById("miscTable").getElementsByTagName('tbody')[0];
        const data = [];
        for (let i = 0; i < table.rows.length - 1; i++) {
            const row = table.rows[i];
            data.push({
                name: row.cells[0].textContent,
                price: row.cells[1].textContent
            });
        }
        localStorage.setItem("miscTableData", JSON.stringify(data));
    }

    function loadTable() {
        const savedData = JSON.parse(localStorage.getItem("miscTableData"));
        if (!savedData) return;

        const table = document.getElementById("miscTable").getElementsByTagName('tbody')[0];
        savedData.forEach(item => {
            const row = table.insertRow(table.rows.length - 1);
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            cell1.textContent = item.name;
            cell2.textContent = parseFloat(item.price).toFixed(2);
            cell2.style.textAlign = "right";
        });
        updateTotal();
    }

    // ---------------- SAVE TO DATABASE ----------------
    function saveTotalExpense() {
        const totalRow = document.getElementById("totalRow");
        const total = parseFloat(totalRow.cells[1].textContent);

        if (isNaN(total) || total === 0) {
            alert("Invalid total amount — cannot be empty or zero.");
            return;
        }

        fetch("/save_total_expense", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ total: total })
        })
        .then(response => {
            if (response.redirected) {
                // Flask redirects (page refresh)
                window.location.href = response.url;
            } else {
                return response.text();
            }
        })
        .then(() => {
            console.log("Total expense sent to server.");
        })
        .catch(err => {
            console.error("Error saving total expense:", err);
            alert("An error occurred while saving total expense.");
        });
    }
});

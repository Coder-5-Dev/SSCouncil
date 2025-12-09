// ------------------------- MAIN EXPENSE SCRIPT -------------------------
document.addEventListener("DOMContentLoaded", function () {
    const forms = document.querySelectorAll("#addItemForm");
    const tables = document.querySelectorAll("#miscTable");
    const totalRows = document.querySelectorAll("#totalRow");
    const saveBtns = document.querySelectorAll("#saveBtn");

    forms.forEach((form, index) => {
        const addBtn = form.querySelector("#addBtn");
        const clearBtn = form.querySelector("#clearBtn");
        const clearTableBtn = form.querySelector("#clearTableBtn");
        const itemName = form.querySelector("#itemName");
        const itemPrice = form.querySelector("#itemPrice");
        const table = tables[index].querySelector("tbody");
        const totalRow = totalRows[index];

        // Load saved items from localStorage
        loadTable(index);

        // --- Add Item ---
        addBtn.addEventListener("click", addItem);
        clearBtn.addEventListener("click", () => {
            itemName.value = "";
            itemPrice.value = "";
        });

        [itemName, itemPrice].forEach(input => {
            input.addEventListener("keypress", e => {
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
                alert("Please enter valid description and amount.");
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

            itemName.value = "";
            itemPrice.value = "";
            itemName.focus();
        }

        // --- Clear Table ---
        clearTableBtn.addEventListener("click", () => {
            Array.from(table.querySelectorAll("tr")).forEach(r => {
                if (r !== totalRow) r.remove();
            });
            totalRow.cells[1].innerText = "0.00";
            saveTable(index);
        });

        // --- Save to Flask ---
        saveBtns[index].addEventListener("click", () => {
            const total = parseFloat(totalRow.cells[1].textContent) || 0;
            if (total <= 0) {
                alert("No expenses to save!");
                return;
            }

            const rows = Array.from(table.querySelectorAll("tr")).filter(r => r !== totalRow);
            const items = rows.map(r => ({
                description: r.cells[0].innerText,
                amount: parseFloat(r.cells[1].innerText)
            }));

            if (index === 0) {
                saveToDatabase("/save_total_expense", total, items, "Miscellaneous expenses");
            } else if (index === 1) {
                saveToDatabase("/save_other_expense", total, items, "Other expenses");
            }
        });

        // --- LocalStorage Save/Load ---
        function saveTable(idx) {
            const rows = Array.from(table.querySelectorAll("tr")).filter(r => r !== totalRow);
            const items = rows.map(r => ({
                description: r.cells[0].innerText,
                amount: parseFloat(r.cells[1].innerText)
            }));
            localStorage.setItem("expense_table_" + idx, JSON.stringify(items));
            localStorage.setItem("expense_total_" + idx, totalRow.cells[1].innerText);
        }

        function loadTable(idx) {
            const saved = localStorage.getItem("expense_table_" + idx);
            if (!saved) return;
            const items = JSON.parse(saved);
            items.forEach(item => {
                const newRow = document.createElement("tr");
                newRow.innerHTML = `
                    <td>${item.description}</td>
                    <td style="text-align:right;">${item.amount.toFixed(2)}</td>
                `;
                table.insertBefore(newRow, totalRow);
            });
            updateTotal(totalRow, table);
        }
    });

    // --- Utility: Update Total ---
    function updateTotal(totalRow, table) {
        let total = 0;
        Array.from(table.querySelectorAll("tr")).forEach(row => {
            if (row !== totalRow) {
                total += parseFloat(row.cells[1].innerText);
            }
        });
        totalRow.cells[1].innerText = Math.abs(total).toFixed(2);
    }

    // --- Utility: Save to Flask ---
    function saveToDatabase(endpoint, total, items, label) {
        fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ total: total, items: items })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert(`${label} saved successfully!`);
            } else {
                alert(`Failed to save ${label}: ${data.error}`);
            }
        })
        .catch(err => console.error(`Error saving ${label}:`, err));
    }
});

// --- Department items (cleaned & grouped) ---
const departmentBoxes = {
    "College of Information Technology and Engineering Department": [
        {
            type: "stats",
            course: "Bachelor in Science of Information Technology",
            students: "Total Students",
            icon: "people",
            value: '....',
            color: "blue"
        },
        {
            type: "stats",
            course: "Bachelor in Science of Computer Engineering",
            students: "Total Students",
            icon: "people",
            value: '....',
            color: "orange"
        },
    ],
};

// --- Open department (with animation + dynamic boxes) ---
function openDepartment(name) {
    document.querySelector(".main-cards").style.display = "none";
    const expanded = document.getElementById("expanded-view");
    const title = document.getElementById("dept-title");
    const inner = document.getElementById("inner-boxes");

    // Set department title
    title.textContent = name;

    // Clear and insert new inner boxes
    inner.innerHTML = "";
    if (departmentBoxes[name]) {
        departmentBoxes[name].forEach(item => {
            let div = document.createElement("div");

            if (item.type === "stats") {
                // Stats card (colored)
                div.classList.add("stat-card", item.color || "blue"); // fallback to blue
                div.innerHTML = `
                    <div class="card-inner">
                        <h3>${item.course}</h3>                       
                    </div>
                    <div class="card-inner">
                        <h3>${item.students}</h3>
                        <span class="material-icons-outlined">${item.icon}</span>
                    </div>
                    <h1>${item.value}</h1>
                `;
            } else if (item.type === "programs") {
                // Programs card
                div.classList.add("program-card");
                let listItems = item.list.map(p => `<li>${p}</li>`).join("");
                div.innerHTML = `
                    <h3>${item.title}</h3>
                    <ul>${listItems}</ul>
                `;
            }

            inner.appendChild(div);
        });
    } else {
        inner.innerHTML = `<div class="program-card"><h3>No items available.</h3></div>`;
    }

    // Show with fadeIn animation
    expanded.style.display = "block";
    expanded.classList.remove("hide");
    expanded.classList.add("show");
}

// --- Close department (with fadeOut) ---
function closeDepartment() {
    const expanded = document.getElementById("expanded-view");
    expanded.classList.remove("show");
    expanded.classList.add("hide");

    expanded.addEventListener("animationend", function handler() {
        if (expanded.classList.contains("hide")) {
            expanded.style.display = "none";
            document.querySelector(".main-cards").style.display = "grid";
        }
        expanded.removeEventListener("animationend", handler);
    });
}

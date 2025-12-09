async function loadDepartments() {
    const response = await fetch("/department/data");
    const departmentBoxes = await response.json();

    const container = document.getElementById("departments-container");
    container.innerHTML = ""; // clear

    // Loop over each department
    for (const [deptName, courses] of Object.entries(departmentBoxes)) {
        // Create department section
        const deptSection = document.createElement("div");
        deptSection.classList.add("department-section");

        // Department Title
        const title = document.createElement("h3");
        title.textContent = deptName;
        deptSection.appendChild(title);

        // Course Cards Container
        const cardContainer = document.createElement("div");
        cardContainer.classList.add("card-container");

        // Loop through courses in this department
        courses.forEach(box => {
            const card = document.createElement("div");
            card.classList.add("card", box.color);

            card.innerHTML = `
                <div class="card-inner">
                    <span class="material-icons-outlined">${box.icon}</span>
                    <h3>${box.course}</h3>
                    <p>${box.students}</p>
                    <h1>${box.value}</h1>
                </div>
            `;
            cardContainer.appendChild(card);
        });

        deptSection.appendChild(cardContainer);
        container.appendChild(deptSection);
    }
}

document.addEventListener("DOMContentLoaded", loadDepartments);

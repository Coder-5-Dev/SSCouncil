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


// function dueDateTime() {
//   const now = new Date();

//   // Format as YYYY-MM-DD HH:MM:SS
//   const date = now.toISOString().split("T")[0];
//   const time = now.toLocaleTimeString("en-US", { hour12: false });
//   const duedate = `${date} ${time}`;

//   document.getElementById("rentalPeriod").value = duedate;
// }

// // Run immediately and keep updating
// setInterval(dueDateTime, 1000);
// dueDateTime();

  // Fixed default payment value
  const defaultPayment = 150;
  const paymentInput = document.getElementById("payment");
  const errorMessage = document.getElementById("paymentError");

  // On form submit → validate
  document.getElementById("membershipForm").addEventListener("submit", function(event) {
    if (!paymentInput.value || parseFloat(paymentInput.value) <= 0) {
      event.preventDefault(); // stop form submission
      errorMessage.style.display = "block";
      paymentInput.focus();
    } else {
      errorMessage.style.display = "none";
    }
  });

  // On form reset → restore default value
  document.getElementById("membershipForm").addEventListener("reset", function() {
    setTimeout(() => {
      paymentInput.value = defaultPayment;
      errorMessage.style.display = "none";
    }, 0); // small delay so reset finishes first
  });

  // Set default on page load
  window.addEventListener("DOMContentLoaded", () => {
    paymentInput.value = defaultPayment;
  });

document.getElementById("lockerSelect").addEventListener("change", function() {
    const selectedLocker = this.value;

    if (selectedLocker) {
        fetch("/occupy_locker", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ locker_number: selectedLocker })
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if (data.status === "success") {
                location.reload(); // refresh to disable occupied locker
            }
        });
    }
});

    // ✅ Simple payment validation before submit
    document.getElementById('membershipForm').addEventListener('submit', function(e) {
        const payment = document.getElementById('payment').value;
        const error = document.getElementById('paymentError');

        if (payment <= 0) {
            e.preventDefault();
            error.style.display = 'inline';
        } else {
            error.style.display = 'none';
        }
  });

function loadLockerStatus() {
    fetch("/locker_status")
    .then(res => res.json())
    .then(data => {
        const grid = document.getElementById("lockerGrid");
        grid.innerHTML = ""; // clear old grid

        data.forEach(locker => {
            const div = document.createElement("div");
            div.classList.add("locker");

            // Apply class based on status
            if (locker.status === "Available") {
                div.classList.add("available");
            } else {
                div.classList.add("occupied");
            }

            div.textContent = locker.locker_number;
            grid.appendChild(div);
        });
    });
}

// Load once and refresh every 5s
loadLockerStatus();
setInterval(loadLockerStatus, 5000);
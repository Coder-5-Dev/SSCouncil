
// function showForm(formId) {
//         document.getElementById('login-form').classList.remove('active');
//         document.getElementById('register-form').classList.remove('active');
//         document.getElementById(formId).classList.add('active');
// }

// // Open the About Us modal
//  document.querySelector('.nav-links a[href="#about"]').addEventListener('click', function(e){
//         e.preventDefault(); // prevent default anchor scroll
//         document.getElementById('aboutModal').style.display = 'block';
//     });

//     // Close modal function
//     function closeAbout() {
//         document.getElementById('aboutModal').style.display = 'none';
//     }

//     // Close modal when clicking outside content
//     window.onclick = function(event) {
//         var modal = document.getElementById('aboutModal');
//         if (event.target == modal) {
//             modal.style.display = 'none';
//         }
//     }

// Switch between login/register forms
function showForm(formId) {
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('register-form').classList.remove('active');
    document.getElementById(formId).classList.add('active');
}

// Modal open/close
function openAbout() {
    document.getElementById('aboutModal').style.display = 'block';
}
function closeAbout() {
    document.getElementById('aboutModal').style.display = 'none';
}
window.onclick = function(event) {
    if (event.target == document.getElementById('aboutModal')) {
        closeAbout();
    }
}
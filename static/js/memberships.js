// ===================== GLOBAL VARIABLES =====================
const deptDropdown = document.getElementById('department');
const courseDropdown = document.getElementById('course');
const levelDropdown = document.getElementById('level');
const memberTypeDropdown = document.getElementById('member_type');
const transactionDropdown = document.getElementById('transaction_id');
const actionTypeDropdown = document.getElementById('action_type');
const addBtn = document.getElementById('addStudentBtn');
const saveBtn = document.getElementById('saveBtn');

const departmentCourses = {
  COA: ["BSA", "BSAIS"],
  CTED: ["BEEd", "BSEd"],
  CITE: ["BSIT", "BSCpE"],
  CBA: ["BSBA-FM", "BSBA-MM"],
  CNM: ["BSCrim"],
  CHM: ["BSHM"],
  COC: ["Other Course"]
};

let nextSerial = parseInt("{{ next_serial_formatted }}", 10) || 1;
let studentList = [];

// ===================== HELPER FUNCTIONS =====================
function formatSerial(num){ return num.toString().padStart(4,'0'); }

function updateCourseOptions(){
  const courses = departmentCourses[deptDropdown.value] || [];
  courseDropdown.innerHTML = '';
  courses.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = c;
    courseDropdown.appendChild(opt);
  });
}

function updateYearLevelOptions(){
  Array.from(levelDropdown.options).forEach(o => { o.disabled = false; o.style.color = ''; });

  if(actionTypeDropdown.value === 'payment'){
    // Payment: disable level selection
    Array.from(levelDropdown.options).forEach(o => { o.disabled = true; o.style.color = 'gray'; });
    levelDropdown.value = 'N/A';
    return;
  }

  const type = memberTypeDropdown.value;
  if(type==='Freshmen'){
    for(let i=1;i<levelDropdown.options.length;i++){
      levelDropdown.options[i].disabled=true;
      levelDropdown.options[i].style.color='gray';
    }
    levelDropdown.value='1st Year';
  } else if(type==='Old Student'){
    levelDropdown.options[0].disabled=true;
    levelDropdown.options[0].style.color='gray';
    if(levelDropdown.value==='1st Year') levelDropdown.value='2nd Year';
  }
}

function updateSerialField(){
  document.getElementById('serial').value = actionTypeDropdown.value==='payment'?'N/A':formatSerial(nextSerial);
}

function updateDescriptionFee(){
  const selOpt = transactionDropdown.options[transactionDropdown.selectedIndex];
  document.getElementById('description_fee').value = selOpt ? selOpt.textContent.split('- ₱')[0].trim() : '';
}

// ===================== AUTO SELECT TRANSACTION FOR PAYMENT =====================
function autoSelectPaymentTransaction(){
  if(actionTypeDropdown.value !== 'payment') return;

  let firstPaymentOption = null;
  Array.from(transactionDropdown.options).forEach(opt => {
    const isMembershipFee = opt.textContent.toLowerCase().includes('membership fee');
    if(isMembershipFee){
      opt.disabled = true;
      opt.style.color = 'gray';
    } else {
      opt.disabled = false;
      opt.style.color = '';
      if(!firstPaymentOption) firstPaymentOption = opt;
    }
  });

  if(firstPaymentOption) transactionDropdown.value = firstPaymentOption.value;
  updateDescriptionFee();
}

// ===================== HANDLE TRANSACTION SELECTION =====================
function handleTransactionSelection(){
  if(actionTypeDropdown.value==='payment'){
    autoSelectPaymentTransaction();
    return;
  }

  const isMembership = actionTypeDropdown.value==='membership';
  Array.from(transactionDropdown.options).forEach(opt => {
    const desc = opt.textContent.toLowerCase();
    const isMembershipFee = desc.includes("membership fee");
    opt.disabled = isMembership ? !isMembershipFee : isMembershipFee;
    opt.style.color = opt.disabled ? 'gray' : '';
  });

  const firstEnabled = Array.from(transactionDropdown.options).find(o=>!o.disabled);
  if(firstEnabled) transactionDropdown.value = firstEnabled.value;
  updateDescriptionFee();
  updateSerialField();
}

// ===================== TABLE MANAGEMENT =====================
function renderTable(){
  const tbody = document.querySelector('#studentTable tbody'); 
  tbody.innerHTML = '';
  studentList.forEach((s,i) => {
    const mid = s.middlename ? ' ' + s.middlename : '';
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${s.serial_number===null?'N/A':formatSerial(s.serial_number)}</td>
      <td>${s.student_number}</td>
      <td>${s.surname}, ${s.firstname}${mid}</td>
      <td>${s.member_type}</td>
      <td>${s.department}</td>
      <td>${s.course}</td>
      <td>${s.level}</td>
      <td>${s.description_fee}</td>
      <td>${s.transaction_name}</td>
      <td><button class="btn-cancel" type="button" onclick="removeStudent(${i})"><i class="fa-solid fa-trash"></i> Remove</button></td>
    `;
    tbody.appendChild(row);
  });
}

window.removeStudent = function(index){
  if(!confirm('Remove this student?')) return;
  studentList.splice(index,1);
  renderTable();
  const maxSerial = studentList.filter(s=>s.serial_number!==null)
                               .reduce((max,s)=>Math.max(max,s.serial_number),0);
  nextSerial = Math.max(parseInt("{{ next_serial_formatted }}",10)||1,maxSerial+1);
  updateSerialField();
}

// ===================== ADD STUDENT =====================
function addToList(){
  const sn = document.getElementById('student_number').value.trim();
  if(!sn){ alert("Enter student number."); return; }
  const selOpt = transactionDropdown.options[transactionDropdown.selectedIndex];
  if(!selOpt||!selOpt.value){ alert("Select transaction."); return; }
  const serialVal = actionTypeDropdown.value==='payment'?null:nextSerial;

  const student = {
    serial_number: serialVal,
    date: document.getElementById('member_date').value,
    student_number: sn,
    surname: document.getElementById('surname').value.trim(),
    firstname: document.getElementById('firstname').value.trim(),
    middlename: document.getElementById('middlename').value.trim(),
    transferee: memberTypeDropdown.value==='Transferee'?'Yes':'No',
    department: deptDropdown.value || 'N/A',
    course: courseDropdown.value || 'N/A',
    level: actionTypeDropdown.value==='payment'?'N/A':levelDropdown.value,
    member_type: memberTypeDropdown.value,
    transaction_id: transactionDropdown.value,
    transaction_name: selOpt.textContent,
    description_fee: document.getElementById('description_fee').value,
    action_type: actionTypeDropdown.value
  };

  studentList.push(student);
  renderTable();
  if(actionTypeDropdown.value==='membership') nextSerial++;
  updateSerialField();
  ['student_number','surname','firstname','middlename'].forEach(id=>document.getElementById(id).value='');
}

// ===================== SAVE MEMBERSHIP / PAYMENT =====================
async function saveAll() {
    if (!studentList.length) { alert("No students to save."); return; }

    try {
        const membershipPayload = studentList.filter(s => s.action_type === 'membership');
        const paymentPayload = studentList.filter(s => s.action_type === 'payment');

        // Save memberships
        if (membershipPayload.length > 0) {
            await fetch("{{ url_for('membership_page') }}", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({students: membershipPayload})
            });
        }

        // Save payments
        if (paymentPayload.length > 0) {
            await fetch("{{ url_for('payment_page_post') }}", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({students: paymentPayload})
            });
        }

        alert("Students and payments saved successfully!");
        studentList = [];
        renderTable();
        ['student_number','surname','firstname','middlename'].forEach(id => document.getElementById(id).value='');
        nextSerial = parseInt("{{ next_serial_formatted }}", 10) || 1;
        updateSerialField();

    } catch (err) {
        console.error(err);
        alert("Error saving students: " + err.message);
    }
}

// ===================== FETCH STUDENT =====================
async function fetchStudentData(){
  const sn=document.getElementById('student_number').value.trim();
  if(!sn) return;
  try{
    const res=await fetch(`/api/get_student/${sn}`);
    const data=await res.json();
    if(data.success && data.student){
      const s=data.student;
      document.getElementById('surname').value=s.surname||'';
      document.getElementById('firstname').value=s.first_name||'';
      document.getElementById('middlename').value=s.middle_name||'';
      deptDropdown.value = s.department && s.department!=='N/A'? s.department : '';
      updateCourseOptions();
      courseDropdown.value = s.course && s.course!=='N/A'? s.course : '';
      memberTypeDropdown.value = s.member_type && s.member_type!=='N/A'? s.member_type : 'Freshmen';
      updateYearLevelOptions();
      levelDropdown.value = s.level && s.level!=='N/A'? s.level : '1st Year';
      actionTypeDropdown.value = (s.serial_number && s.serial_number!=='N/A')?'payment':'membership';
    } else {
      ['surname','firstname','middlename'].forEach(id=>document.getElementById(id).value='');
      deptDropdown.value=''; courseDropdown.innerHTML=''; memberTypeDropdown.value='Freshmen';
      updateYearLevelOptions(); actionTypeDropdown.value='membership';
    }
    handleTransactionSelection(); updateSerialField();
  } catch(err){ console.error("Error fetching student data:",err); }
}

// ===================== LIVE DATE =====================
function updateDateTime(){
  const now=new Date();
  document.getElementById('member_date').value=now.toLocaleString('en-US',{
    year:'numeric',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit'
  });
}
updateDateTime(); setInterval(updateDateTime,1000);

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded',()=>{
  if(deptDropdown.value) updateCourseOptions();
  updateYearLevelOptions();
  handleTransactionSelection();
  renderTable();
});

// ===================== EVENTS =====================
deptDropdown.addEventListener('change',updateCourseOptions);
memberTypeDropdown.addEventListener('change',updateYearLevelOptions);
actionTypeDropdown.addEventListener('change',()=>{
  handleTransactionSelection();
  updateYearLevelOptions();
});
transactionDropdown.addEventListener('change',updateDescriptionFee);
addBtn.addEventListener('click',addToList);
saveBtn.addEventListener('click',saveAll);
document.getElementById('student_number').addEventListener('blur',fetchStudentData);
document.getElementById('student_number').addEventListener('keypress',e=>{
  if(e.key==='Enter'){ e.preventDefault(); fetchStudentData(); }
});

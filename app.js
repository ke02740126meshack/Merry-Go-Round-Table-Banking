let members = ['Alice','Bob','Charlie','David','Eva','Frank','Grace','Hannah','Ian','Jack','Karen','Leo'];
let contributions = [];

function getCurrentMonth() {
    const now = new Date();
    return now.toLocaleString('default',{month:'long'}) + " " + now.getFullYear();
}

function getCurrentReceiver() {
    const month = getCurrentMonth();
    const monthContributions = contributions.filter(c => c.month === month);
    const index = monthContributions.length % members.length;
    return members[index];
}

function initDashboard(){
    const month = getCurrentMonth();
    const receiver = getCurrentReceiver();

    const receiverEl = document.getElementById('currentReceiver');
    if(receiverEl) receiverEl.innerText = receiver;

    const progressEl = document.getElementById('progressBar');
    if(progressEl){
        const monthContributions = contributions.filter(c => c.month === month);
        const progress = (monthContributions.length / members.length) * 100;
        progressEl.style.width = progress + "%";
        progressEl.innerText = Math.floor(progress) + "%";
    }

    const cal = document.getElementById('receiverCalendar');
    if(cal){
        cal.innerHTML = '';
        members.forEach((m)=>{
            const div = document.createElement('div');
            div.innerText = m;
            if(m === receiver) div.classList.add('current');
            cal.appendChild(div);
        });
    }

    const ms = document.getElementById('membersStatus');
    if(ms){
        ms.innerHTML = '';
        members.forEach(m=>{
            const div = document.createElement('div');
            div.innerText = m;
            if(m === receiver) div.classList.add('receiver');
            if(contributions.find(c=>c.contributor===m && c.month===month)) div.classList.add('paid');
            ms.appendChild(div);
        });
    }

    const hist = document.querySelector('#historyTable tbody');
    if(hist){
        hist.innerHTML = '';
        contributions.forEach(c=>{
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${c.month}</td><td>${c.receiver}</td><td>${c.contributor}</td>`;
            hist.appendChild(tr);
        });
    }
}

// Contribute
if(document.getElementById('contributeForm')){
    const sel = document.getElementById('memberSelect');
    members.forEach(m=>{
        let opt = document.createElement('option'); opt.value = m; opt.innerText = m; sel.appendChild(opt);
    });
    document.getElementById('contributeForm').addEventListener('submit', e=>{
        e.preventDefault();
        const val = sel.value;
        if(!val) return alert('Select a member');
        const month = getCurrentMonth();
        const receiver = getCurrentReceiver();
        if(val === receiver) return alert('Receiver cannot contribute this month!');
        if(contributions.find(c=>c.contributor===val && c.month===month)) return alert('You already contributed this month!');
        contributions.push({month:month, contributor:val, receiver:receiver});
        alert(`Contribution successful! ${receiver} will receive this month.`);
        initDashboard();
    });
}

// Add Members
if(document.getElementById('addMemberForm')){
    const memberList = document.getElementById('memberList');
    function renderMembers(){
        memberList.innerHTML='';
        members.forEach((m,i)=>{
            const div = document.createElement('div');
            div.innerHTML = `<span>${m}</span><button data-index="${i}">Remove</button>`;
            memberList.appendChild(div);
        });
        memberList.querySelectorAll('button').forEach(b=>{
            b.onclick = ()=>{
                members.splice(b.dataset.index,1); renderMembers(); initDashboard();
            };
        });
    }
    renderMembers();
    document.getElementById('addMemberForm').addEventListener('submit', e=>{
        e.preventDefault();
        const name = document.getElementById('newMember').value.trim();
        if(name && !members.includes(name)){ members.push(name); renderMembers(); initDashboard(); document.getElementById('newMember').value=''; }
    });
}

// Admin login
if(document.getElementById('adminLoginForm')){
    const form = document.getElementById('adminLoginForm');
    const panel = document.getElementById('adminPanel');
    form.addEventListener('submit', e=>{
        e.preventDefault();
        const user = document.getElementById('adminUser').value;
        const pass = document.getElementById('adminPass').value;
        if(user==='admin' && pass==='admin123'){ form.style.display='none'; panel.style.display='block'; drawChart(); }
        else alert('Invalid login');
    });
}

// Admin Chart
function drawChart(){
    const ctx = document.getElementById('contributionChart');
    if(!ctx) return;
    const data = {labels:members,datasets:[{label:'Contributions',data:members.map(m=>contributions.filter(c=>c.contributor===m).length),backgroundColor:'rgba(0,204,204,0.7)'}]};
    new Chart(ctx,{type:'bar',data:data,options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,precision:0}}}});
}

document.addEventListener('DOMContentLoaded', initDashboard);

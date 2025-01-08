const today = new Date();
const oneYearLater = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());

let currentYear = today.getFullYear();
let currentMonth = today.getMonth(); // 0부터 시작

// 달력 만들기
async function createCalendar(year, month) {
    const viewMonth = month+1; // 1부터 시작
    const calendarTable = document.querySelector("#calendarTable");
    const calendarMonth = document.querySelector("#calendarMonth");

    // Table 초기화 & 제목 변경
    calendarTable.innerHTML = "";
    calendarMonth.textContent = `${year}년 ${viewMonth}월`;
    // 일정 menu hidden & 초기화
    document.querySelector("#scheduleMenu").style.display="none"
    document.querySelector("#scheduleMenu #scheduleText").value=""
    document.querySelector("#scheduleArea").innerHTML=""
    
    // 월별 일정 가져오기
    const {schedules} = await fetch("/calendar/MonthSchedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dateFormat: `${year}${viewMonth.toString().padStart(2, '0')}` })
    }).then(response => response.json())

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, viewMonth, 0);

    let day = 1;
    for (let week = 0; week < 6; week++) {
        const row = document.createElement("tr");
        for (let weekCnt = 0; weekCnt < 7; weekCnt++) { // 7일씩 반복
            const currentDate = new Date(year, month, day);
            const dateFormat = `${year}${viewMonth.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`
            if ((week === 0 && weekCnt < firstDay.getDay()) || day > lastDay.getDate()) { row.innerHTML += `<td class="disabled"></td>` } // 날짜가 없으면 빈값
            else if(currentDate < today || currentDate > oneYearLater){ row.innerHTML += `<td class="${currentDate < today || currentDate > oneYearLater ? 'disabled' : ''}"><span>${day++}</span></td>` } // 날짜가 지났으면 disable 이벤트
            else { row.innerHTML += `<td dateFormat="${dateFormat}"><span>${day++}</span></td>` } // 날짜 작성
        }
        calendarTable.appendChild(row); // Table에 1주 추가
        if (day > lastDay.getDate()) { break }
    }

    // 날짜 클릭 이벤트
    document.querySelectorAll("td").forEach(element => { 
        element.addEventListener("click", function(){  generateSchedule(element) }) 
    })
    // 일정있는 날짜 색상 추가
    schedules.forEach(element => { document.querySelector(`td[dateFormat="${element.scheduleDate}"]`).style.backgroundColor="red" })
}

// 달력 만들기
createCalendar(currentYear, currentMonth);


// 이전달로 달력 전환
document.querySelector("#prevMonth").addEventListener("click", () => {
    if (currentYear > today.getFullYear() || currentMonth > today.getMonth()) {
        currentMonth = (currentMonth - 1 + 12) % 12;
        currentYear -= currentMonth === 11 ? 1 : 0;
        createCalendar(currentYear, currentMonth);
    }
});

// 다음달로 달력 전환
document.querySelector("#nextMonth").addEventListener("click", () => {
    if (new Date(currentYear, currentMonth + 1) <= oneYearLater) {
        currentMonth = (currentMonth + 1) % 12;
        currentYear += currentMonth === 0 ? 1 : 0;
        createCalendar(currentYear, currentMonth);
    }
});

// 일정 메뉴 hidden 해제
async function generateSchedule(element){
    const dateFormat = element.getAttribute("dateFormat")

    // dataFormat 저장 & 날짜 작성 & scheduleArea 초기화
    document.querySelector("#scheduleMenu").setAttribute("dateFormat", dateFormat)
    document.querySelector("#scheduleMenu #scheduleDate").textContent = `${dateFormat.toString().slice(0, 4)}년 ${dateFormat.toString().slice(4, 6)}월 ${dateFormat.toString().slice(6, 8)}일`;
    document.querySelector("#scheduleArea").innerHTML=""
    
    // 일정 가져오기
    const {schedules} = await fetch("/calendar/DaySchedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dateFormat: dateFormat.toString() })
    }).then(response => response.json())

    schedules.forEach(element=>{
        const {id, schedule, scheduleDate} = element;
        document.querySelector("#scheduleArea").innerHTML+=`
            <div class="scheduleContainer" id="${id}" dateformat="${scheduleDate}">
                <span>${schedule}</span>
                <button onclick="deleteSchedule(this)">X</button>
            </div>
    `})
    
    // hidden 해제
    document.querySelector("#scheduleMenu").style.display="block"
} 

// 일정 추가하기
async function addSchedule() {
    const schedule = document.querySelector("#scheduleMenu #scheduleText").value;
    const dateformat = document.querySelector("#scheduleMenu").getAttribute("dateformat")
    if(!schedule || !dateformat){ return alert("일정을 입력해주세요.") }
        
    const response = await fetch("/calendar/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schedule, scheduleDate: dateformat })
    })

    if (response.status === 500) { return alert("나중에 다시 시도해주세요") }
    const {id} = await response.json()

    // 날짜에 색상 추가 & input 초기화 & 일정 추가
    document.querySelector(`td[dateformat="${dateformat}"]`).style.backgroundColor="red"
    document.querySelector("#scheduleMenu #scheduleText").value=""
    document.querySelector("#scheduleArea").innerHTML+=`
        <div class="scheduleContainer" id="${id}" dateformat="${dateformat}">
            <span>${schedule}</span>
            <button onclick="deleteSchedule(this)">X</button>
        </div>
    `
}

// 일정 삭제하기
async function deleteSchedule(element){
    const id = element.closest(".scheduleContainer").getAttribute("id");
    const dateformat = element.closest(".scheduleContainer").getAttribute("dateformat");

    await fetch("/calendar/schedule", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
    })
    // 일정 지우기
    document.querySelector(`.scheduleContainer[id="${id}"]`).remove()
    // 일정 없으면 날짜에 색상 제거
    if(document.querySelectorAll(".scheduleContainer").length==0){ document.querySelector(`td[dateformat="${dateformat}"]`).style.backgroundColor="white" }
}
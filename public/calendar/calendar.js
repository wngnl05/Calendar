const today = new Date();
const oneYearLater = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());

let currentYear = today.getFullYear();
let currentMonth = today.getMonth();

const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");

// 달력 만들기
function createCalendar(year, month) {
    const calendarTable = document.querySelector("#calendarTable");
    const calendarMonth = document.querySelector("#calendarMonth");

    // Table 초기화 & 제목 변경
    calendarTable.innerHTML = "";
    calendarMonth.textContent = `${year}년 ${month+1}월`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month+1, 0);

    let date = 1;
    for (let week = 0; week < 6; week++) {
        const row = document.createElement("tr");

        for (let day = 0; day < 7; day++) {
            const currentDate = new Date(year, month, date);
            if ((week === 0 && day < firstDay.getDay()) || date > lastDay.getDate()) { row.innerHTML += `<td></td>` } // 날짜가 없으면 빈값
            else if(currentDate < today || currentDate > oneYearLater){ row.innerHTML += `<td class="${currentDate < today || currentDate > oneYearLater ? 'disabled' : ''}"><span>${date++}</span></td>` } // 날짜가 지났으면 disable 이벤트
            else { row.innerHTML += `<td onclick="calendarModal(${month+1}, ${date})"><span>${date++}</span></td>` } // 날짜 작성
        }

        calendarTable.appendChild(row); // Table에 1주 추가
        if (date > lastDay.getDate()) { break }
    }
}

// 달력 만들기
createCalendar(currentYear, currentMonth);



prevMonthButton.addEventListener("click", () => {
    if (currentYear > today.getFullYear() || currentMonth > today.getMonth()) {
        currentMonth = (currentMonth - 1 + 12) % 12;
        currentYear -= currentMonth === 11 ? 1 : 0;
        createCalendar(currentYear, currentMonth);
    }
});

nextMonthButton.addEventListener("click", () => {
    if (new Date(currentYear, currentMonth + 1) <= oneYearLater) {
        currentMonth = (currentMonth + 1) % 12;
        currentYear += currentMonth === 0 ? 1 : 0;
        createCalendar(currentYear, currentMonth);
    }
});



async function calendarModal(month, day){
    document.querySelector("#calendarModal").innerHTML=`
        <span>${month}월 ${day}일<span>
        <div class="eventContainer">
            <input type="text">
            <button onclick="setEvent(this)">+</button>
        </div>
    `;
} 


async function getEvent(){
    
}

function setEvent(element) {
    const event = element.closest(".eventContainer").querySelector("input").value;
    if(!event){ return alert("일정을 입력해주세요.") }

    console.log(event);
}
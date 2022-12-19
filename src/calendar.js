import $ from "jquery";

const initCalendar = () => {
  // Get the modal
  let modal = $("#test-modal");

  // Get the button that opens the modal
  let button = $("#modal-button");

  // When the user clicks the button, open the modal
  button.on("click", () => {
    modal.css("display", "block");
  })

  for (let i = 0; i < 5; i++) {
    $("table").append(
      `<tr>
            <td id="${i * 7}"></td>
            <td id="${i * 7 + 1}"></td>
            <td id="${i * 7 + 2}"></td>
            <td id="${i * 7 + 3}"></td>
            <td id="${i * 7 + 4}"></td>
            <td id="${i * 7 + 5}"></td>
            <td id="${i * 7 + 6}"></td>
        </tr>`
    );
  }

  let days = getDaysInMonthUTC(10, 2022);

  let offset = days[0].getDay();

  console.log(offset);

  for (let i = 0; i < offset; i++) {
    $(`#${i}`).append(
      `<div class="card" style="width: 12rem; height: 18rem;">
                <div class="card-body"></div>
            </div>`
    );
  }

  for (let i in days) {
    $(`#${parseInt(i) + offset}`).append(cardElement(days[i]));
  }
};

const cardElement = (day) => {
  return `<div class="card" style="width: 12rem; height: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">${day.getUTCDate()}</h5>
                    <p class="card-text"></p>
                </div>
            </div>`;
};

const getDaysInMonthUTC = (month, year) => {
  var date = new Date(Date.UTC(year, month, 1));
  var days = [];
  while (date.getUTCMonth() === month) {
    days.push(new Date(date));
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return days;
};

export { initCalendar };

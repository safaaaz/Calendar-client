import $ from "jquery";

import { serverAddress } from "./constants";
import { updateEvent } from "./eventApi";
import { DateSingleton } from "./dateSingleton";

var events;

const initGrid = async () => {
  await fetch(serverAddress + `/event/myEventsByMonth/${ DateSingleton.getInstance().getMonth() + 1 }`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    }
  ).then((response) => {
    if (response.ok) {
      response.text().then((text) => {
        events = JSON.parse(text);
      });
    } else {
      alert(response.message);
    }
  });

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

  let days = getDaysInMonthUTC(
    DateSingleton.getInstance().getMonth(),
    DateSingleton.getInstance().getYear()
  );

  let offset = days[0].getDay();

  for (let i = 0; i < offset; i++) {
    $(`#${i}`).append(emptyCardElement());
  }

  for (let i in days) {
    $(`#${parseInt(i) + offset}`).append(cardElement(days[i]));
  }

  // for each event we have to activate a listener for update modal
  let updateModal = $("#update-modal");

  for (let event of events) {
    $(`#event${event.id}`).on("click", () => {
      updateModal.show();
      let id = event.id;
        
      $("#update-event-button").on("click", () => {
        const updateEventData = {
            id: id,
            title: $("#update-title").val(),
            date: $("#update-date").val(),
            time: $("#update-time").val(),
            duration: $("#update-duration").val(),
            location: $("#update-location").val(),
            description: $("#update-description").val(),
            isPrivate: $("#update-isPrivate").is(":checked") ? true : false,
          };

          updateEvent(updateEventData)
      })
    });
  }

  $(".closeModalBtn").on("click", () => {
    updateModal.hide();
  });
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

const emptyCardElement = () => {
  return `<div class="card" style="width: 12rem; height: 18rem;">
              <div class="card-body"></div>
            </div>`;
};

const cardElement = (day) => {
  let htmlString = `<div class="card" style="width: 12rem; height: 18rem;">
      <div class="card-body">
      <h5 class="card-title">${day.getUTCDate()}</h5>
      <p class="card-text">`;
  if (events != undefined) {
    events.forEach((element) => {
      let date = new Date(element.dateTime);
      if (date.getDate() == day.getUTCDate()) {
        //  && date.getMonth() == day.getUTCMonth() && date.getYear() == day.getYear()
        htmlString += `<button id="event${element.id}">${element.title}</button><br>`;
      }
    });
  }
  htmlString += `</p>
        </div>
    </div>`;

  return htmlString;

};

export { initGrid };

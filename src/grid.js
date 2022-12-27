import $ from "jquery";

import { serverAddress } from "./constants";
import { updateEvent ,getEvent} from "./eventApi";
import { DateSingleton } from "./dateSingleton";

let events;
const initGrid = async () => {
  
  await fetch(
    serverAddress +
      `/event/myEventsByMonth/${DateSingleton.getInstance().getMonth() + 1}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    }
  )
    .then((response) => {
      return response.status == 200 ? response.json() : null;
    })
    .then((data) => {
      events = data;
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
  const guestsElements =async (roles,statuses)=>{
    console.log("arrive to guest elements");
    //console.log(guests.data);
    const list = document.createDocumentFragment();
    let li;
    for(let i in roles){
      li = document.createElement(`li`);
      let div = document.createElement(`div`);
      let email = document.createElement(`span`);
      email.innerHTML=`${roles[i].user.email} `;
      div.appendChild(email);
      if(roles[i].role=="GUEST"){
        let button = document.createElement(`button`);
        button.innerHTML=`make admin`;
        button.addEventListener('click', function (e) {
          console.log("clickeeeeeeeeeeed");
          updateModal.show();
        });
        div.appendChild(button);
      } else{
        let admin = document.createElement('u');
        admin.innerHTML=`admin`;
        div.appendChild(admin);
      }
      li.appendChild(div);
      console.log(roles[i].user.email,roles[i].role);
      console.log(statuses[i].user.email,statuses[i].status);
      list.appendChild(li);
    }
    return list;
    }
  
  // for each event we have to activate a listener for update modal
  let updateModal = $("#update-modal");
  const getEventGuests=async (eventId)=>{
    let guests;
    await fetch(
      serverAddress +
        `/event/getEventGuests/${eventId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
      }
    )    
    .then((response) => {
      return response.json();
    })
      .then((response) => {
        
          console.log("okkkkkkkkkkkkkkkkkkkkkkkk");
        
        console.log(response);
        guests = response;
      });
      return guests;
  }
  const setEventDetails=async (event)=>{
    $("#update-title").val(event.title);
    const eventDate = new Date(event.dateTime);
    var eventTime = eventDate.toTimeString().split(' ')[0];
    const eventDay = eventDate.toISOString().split('T')[0];
    $("#update-date").val(eventDay),
    $("#update-time").val(eventTime),
    $("#update-duration").val(event.duration),
    $("#update-location").val(event.location),
    $("#update-description").val(event.description),
    $("#update-isPrivate").prop("checked", event.private);
    $("#event-guest").append(await guestsElements(event.userRoles,event.userStatuses));
  }
  for (let event of events) {
    $(`#event${event.id}`).on("click",async (button) => {
      console.log(button.target.getAttribute('eventId'));
      let id = button.target.getAttribute('eventId');
      let event =await getEvent(id);
      setEventDetails(event);
      updateModal.show();

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
      var eventsByDay=[];
      events.forEach((element) => {
        let date = new Date(element.dateTime);
        if (date.getDate() == day.getUTCDate()) {
          eventsByDay.push(element);
        }
      });
      if(eventsByDay.length !=0){      
        eventsByDay=eventsByDay.sort(function(b,a){
        return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime();
      });
      eventsByDay.forEach((element)=>{
        htmlString += `<button id="event${element.id}" eventId="${element.id}">${element.title}</button><br>`;
      });
    }
    }
  htmlString += `</p>
    </div>
  </div>`;

  return htmlString;
};

export { initGrid };

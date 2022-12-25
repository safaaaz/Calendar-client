import { serverAddress } from "./constants";

const createEvent = (data) => {
  console.log("Calling localhost:8080/event/add");
  fetch(serverAddress + "/event/add", {
    method: "POST",
    body: JSON.stringify({
      title: data.title,
      dateTime: data.date + "T" + calendarEvent.time,
      duration: data.duration,
      description: data.description,
      isPrivate: data.isPrivate,
      location: data.location,
    }),
    headers: {
      token: localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      if (response.status == 200) {
        alert("Event " + response.title + " added successfully");
        //todo: close modal
        console.log(response);
        window.history.pushState({}, "", "/calendar");
      } else {
        alert(response.message);
      }
    })
    .catch((error) => {
      console.error(`ERROR: ${error}`);
    });
};

const updateEvent = (data) => {
  fetch(serverAddress + "/event/update", {
    method: "POST",
    body: JSON.stringify({
      id: data.id,
      title: data.title,
      dateTime: data.date + "T" + data.time,
      duration: data.duration,
      description: data.description,
      isPrivate: data.isPrivate,
      location: data.location,
    }),
    headers: {
      token: localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      if (response.status == 200) {
        alert("Event " + response.title + " added successfully");
        //todo: close modal
        console.log(response);
        window.history.pushState({}, "", "/calendar");
      } else {
        alert(response.message);
      }
    })
    .catch((error) => {
      console.error(`ERROR: ${error}`);
    });
};

export { createEvent, updateEvent };

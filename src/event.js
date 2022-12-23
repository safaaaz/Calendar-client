import { serverAddress } from "./constants";

const updateCalendarEvent = (updateEventData) => {
  fetch(serverAddress + "/event/update", {
    method: "POST",
    body: JSON.stringify({
      id: updateEventData.id,
      title: updateEventData.title,
      dateTime: updateEventData.date + "T" + updateEventData.time,
      duration: updateEventData.duration,
      description: updateEventData.description,
      isPrivate: updateEventData.isPrivate,
      location: updateEventData.location,
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

export { updateCalendarEvent };

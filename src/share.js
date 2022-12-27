import $ from "jquery";
import { serverAddress } from "./constants";
import { validateEmail } from "./validations";

const initShareBtn = () => {
  $("#share-button").on("click", () => {
    let email = $("#invite-friend").val();
    console.log("About to share my calendar with: ", email);
    fetch(serverAddress + "/user/share", {
      method: "POST",
      body: JSON.stringify({ email: email }),
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    })
      .then((response) => {
        console.log(response.status);
        return Promise.all([response.status, response.json()]);
      })
      .then(([status, body]) => {
        console.log(status, body);
        if (status == 200) {
          alert(`calendar successfully shared!`);
        } else {
          alert(body.message);
        }
      });
  });
};

export { initShareBtn };

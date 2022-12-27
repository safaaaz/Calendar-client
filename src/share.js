import $ from "jquery";
import { serverAddress } from "./constants";
import { validateEmail } from "./validations";

const initShareBtn = () => {
  $("#share-button").on("click", () => {
    let email = $("#invite-friend").val();

    if (validateEmail(email)) {
      fetch(serverAddress + "/user/share", {
        method: "POST",
        body: JSON.stringify({ email: email }),
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token")
        },
      }).then((response) => {
        return response.status == 200
          ? console.log("invite has been sent")
          : console.log("invite has not been sent");
      });
    }
  });
};

export { initShareBtn };

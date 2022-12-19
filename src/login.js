import $ from "jquery";
import { serverAddress } from "./constants";
import { urlLocationHandler } from "./router";
import { validateEmail, validatePassword } from "./validations";

const initLogin = (key) => {
  $("#login-button").on("click", async () => {
    const user = {
      email: $("#email").val(),
      password: $("#password").val(),
    };

    // validateEmail(user.email) && validatePassword(user.password)
    if (true) {
      await fetch(serverAddress + "/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: user.email, password: user.password }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.status == 200 ? response.json() : null;
        })
        .then(async (data) => {
          if (data != null) {
            window.history.pushState({}, "", "/calendar");
            await urlLocationHandler();
          }
        });
    }
  });
};

export { initLogin };

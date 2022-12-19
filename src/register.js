import $ from "jquery";
import { validateEmail, validatePassword } from "./validations";
import { serverAddress } from "./constants";

const initRegister = () => {
  $(document).on("click", "#register-button", async () => {
    const user = {
      email: $("#email").val(),
      password: $("#password").val(),
    };

    if (validateEmail(user.email) && validatePassword(user.password)) {
      fetch(serverAddress + "/auth/register", {
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
          console.log(data);
          if (data != null) {
            key.token = data.token;
            window.history.pushState({}, "", "/login");
            await urlLocationHandler();
          }
        });
    }
  });
};


export { initRegister };

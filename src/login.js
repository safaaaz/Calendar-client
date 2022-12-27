import $ from "jquery";
import { serverAddress } from "./constants";
import { urlLocationHandler } from "./router";
import { validateEmail, validatePassword } from "./validations";

const loginUsingGithub=(code)=>{
  fetch(serverAddress + "/auth/registerUsingGitHub?code="+code, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
  .then((response) => {
    return response.status == 200 ? response.json() : null;
  })
    .then(async (token) => {
      if (token != null) {
          localStorage.setItem("token", token);
          window.history.pushState({}, "", "/calendar");
          await urlLocationHandler();
      }});
};
const initLogin = () => {
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
        .then(async (token) => {
          console.log(token);
          if (token != null) {
            localStorage.setItem("token", token);
            localStorage.setItem("email", user.email);
            window.history.pushState({}, "", "/calendar");
            await urlLocationHandler();
          }
        });
    }
  });
 
};


export { initLogin , loginUsingGithub };

import { initRegister } from "./register";
import { initLogin } from "./login";
import { initCalendar } from "./calendar";
import { initSettings} from "./settings"

const initRouter = () => {
  // create document click that watches the nav links only
  document.addEventListener("click", (event) => {
    const { target } = event;
    if (!target.matches("nav a")) {
      return;
    }
    event.preventDefault();
    urlRoute();
  });

  // add an event listener to the window that watches for url changes
  window.onpopstate = urlLocationHandler;
  // call the urlLocationHandler function to handle the initial url
  window.route = urlRoute;
  // call the urlLocationHandler function to handle the initial url
  urlLocationHandler();
};

const urlPageTitle = "Calendar Application";

let key = { token: "" };

// create an object that maps the url to the template, title, and description
const urlRoutes = {
  404: {
    template: "templates/404.html",
    title: "404 | " + urlPageTitle,
    description: "Page not found",
  },
  "/": {
    template: "templates/home.html",
    title: "Home | " + urlPageTitle,
    description: "This is the home page",
  },
  "/register": {
    template: "templates/register.html",
    title: "Register | " + urlPageTitle,
    description: "This is the register page",
    init: () => {
      initRegister();
    },
  },
  "/login": {
    template: "templates/login.html",
    title: "Login | " + urlPageTitle,
    description: "This is the login page",
    init: () => {
      initLogin();
    },
  },
  "/calendar": {
    template: "templates/calendar.html",
    title: "Calendar | " + urlPageTitle,
    description: "This is the calendar page",
    init: () => {
      initCalendar();
    },
  },
  "/settings": {
    template: "templates/settings.html",
    title: "Settings | " + urlPageTitle,
    description: "This is the settings page",
    init: () => {
      initSettings();
    },
  },
};

// create a function that watches the url and calls the urlLocationHandler
const urlRoute = async (event) => {
  event = event || window.event; // get window.event if event argument not provided
  event.preventDefault();
  // window.history.pushState(state, unused, target link);
  window.history.pushState({}, "", event.target.href);
  await urlLocationHandler();
};

// create a function that handles the url location
const urlLocationHandler = async () => {
  const location = window.location.pathname; // get the url path
  // if the path length is 0, set it to primary page route
  if (location.length == 0) {
    location = "/";
  }
  // get the route object from the urlRoutes object
  const route = urlRoutes[location] || urlRoutes["404"];
  // get the html from the template

  console.log(route.template);

  const html = await fetch(route.template).then((response) => response.text());
  // set the content of the content div to the html
  document.getElementById("content").innerHTML = html;
  route.init();
  // set the title of the document to the title of the route
  document.title = route.title;
  // set the description of the document to the description of the route
  document
    .querySelector('meta[name="description"]')
    .setAttribute("content", route.description);
};

export { initRouter, urlLocationHandler };

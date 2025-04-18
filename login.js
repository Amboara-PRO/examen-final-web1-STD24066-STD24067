const form = document.querySelector("#form");
const button = document.querySelector("button");
const icon_lock = document.querySelector(".icon_lock");
const input_username_or_email = document.querySelector(
  "#input_username_or_password"
);
const input_password = document.querySelector("#input_password");
const error_message = document.querySelectorAll(".error_message");
const loading_dots = document.querySelector(".loading_dots");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  button.classList.add("button_none");
  loading_dots.classList.remove("loading_dots_none");
  setTimeout(() => {
    if (
      input_username_or_email.value === "amboara" &&
      input_password.value === "faneva"
    ) {
      location.href = "index.html";
    } else {
      error_message.forEach((element) => {
        element.classList.add("error_message_added");
      });
      loading_dots.classList.add("loading_dots_none");
      button.classList.remove("button_none");
      setTimeout(() => {
        error_message.forEach(element => {
          element.classList.remove("error_message_added")
        });
      }, 4000);
    }
  }, 6000);
});
import { login as config } from "./config.js";


export const form = document.getElementById("login");

form.addEventListener("submit", () => {
  const password = form.elements.password.value;
  const remember = form.elements.remember.checked;

  if (remember) {
    const cookie = `password=${password}; Max-Age=${config.rememberDuration / 1000}; Secure; SameSite=Strict`; // Max-Age in seconds
    document.cookie = cookie;
  }
});


export default {
  config,
  form
};

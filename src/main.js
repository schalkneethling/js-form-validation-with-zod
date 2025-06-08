import { validateContactForm } from "./utils/validation";

import "./style.css";
import "./form.css";

const form = document.querySelector("form");

if (!form.hasAttribute("novalidate")) {
  form.setAttribute("novalidate", "");
}

const postFormData = async (data) => {
  const fetchBase = ".netlify/functions/sendmail";
  const response = await fetch(fetchBase, {
    method: "POST",
    body: JSON.stringify(data),
  });

  return await response.json();
};

const clearErrorMessages = () => {
  const errorMessages = form.querySelectorAll(".error-message");
  errorMessages.forEach((errorMessage) => {
    errorMessage.hidden = true;
  });
};

const showErrorMessages = (errors) => {
  errors.forEach((error) => {
    const errorMessageContainer = form.querySelector(
      `#${error.path[0]}`,
    ).nextElementSibling;
    const errorMessage = document.createElement("p");
    errorMessage.textContent = error.message;

    errorMessageContainer.replaceChildren(errorMessage);
    errorMessageContainer.hidden = false;
  });
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  const successMessage = document.querySelector(".success-message");
  const validation = validateContactForm(data);

  if (successMessage.hidden === false) {
    successMessage.hidden = true;
  }

  clearErrorMessages();

  if (!validation.success) {
    const errors = validation.error.issues;
    showErrorMessages(errors);
  } else {
    const response = await postFormData(data);

    if (response.status === "success") {
      successMessage.hidden = false;
    } else {
      successMessage.hidden = true;
    }
  }
});

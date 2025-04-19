function copyCode(button) {
  const block = button.previousElementSibling;
  const codeElement = block.querySelectorAll("code")[0];
  let code = codeElement.innerText;

  // The <span> elements on each line have a trailing newline, so we need to replace double
  // newlines with a single one to accurately copy the code block.
  if ("lang" in codeElement.dataset) {
    code = code.replace(/\n\n/g, "\n");
  }

  navigator.clipboard
    .writeText(code)
    .then(() => {
      // Change icon to checkmark
      const icon = button.querySelector("i");
      icon.classList.remove("fa-copy");
      icon.classList.add("fa-check");
      setTimeout(() => {
        icon.classList.remove("fa-check");
        icon.classList.add("fa-copy");
      }, 1000);
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const copyCodeButtons = document.querySelectorAll(".copy-code-button");
  copyCodeButtons.forEach((button) => {
    button.addEventListener("click", () => copyCode(button));
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const codeBlocks = document.querySelectorAll("pre.highlight");
  codeBlocks.forEach((block) => {
    const copyButton = document.createElement("button");
    copyButton.innerText = "Copy";
    copyButton.className = "copy-button";

    copyButton.addEventListener("click", () => {
      const code = block.querySelector("code").innerText;
      navigator.clipboard.writeText(code).then(() => {
        copyButton.innerText = "Copied!";
        setTimeout(() => {
          copyButton.innerText = "Copy";
        }, 2000);
      });
    });

    block.style.position = "relative"; // Ensure the button aligns correctly
    block.appendChild(copyButton);
  });
});
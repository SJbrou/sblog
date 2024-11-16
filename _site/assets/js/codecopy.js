// Function to copy code to the clipboard
function copyCode(button) {
  // Get the code block to copy
  var code = button.parentElement.querySelector('code');
  
  // Create a temporary textarea element to copy the code text
  var textArea = document.createElement('textarea');
  textArea.value = code.textContent;  // Get the text from the code block
  document.body.appendChild(textArea);
  
  // Select the text and execute the copy command
  textArea.select();
  document.execCommand('copy');
  
  // Remove the temporary textarea
  document.body.removeChild(textArea);
  
  // Change the button text to indicate the code is copied
  button.innerText = 'Copied!';
  
  // Reset the button text after 2 seconds
  setTimeout(function() {
      button.innerText = 'Copy';
  }, 2000);
}

// Add the copy button dynamically to each code block on page load
document.addEventListener('DOMContentLoaded', function() {
  // Select all pre/code blocks
  var codeBlocks = document.querySelectorAll('pre');
  
  codeBlocks.forEach(function(block) {
      // Create a copy button and add it to the block
      var button = document.createElement('button');
      button.className = 'copy-btn';
      button.innerText = 'Copy';
      button.onclick = function() { copyCode(button); };

      // Insert the button at the top of the code block
      block.insertBefore(button, block.firstChild);
  });
});

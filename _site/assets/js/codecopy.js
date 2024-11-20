document.addEventListener('DOMContentLoaded', function () {
  var codeBlocks = document.querySelectorAll('pre');

  codeBlocks.forEach(function (block) {
    var button = document.createElement('button');
    button.className = 'copy-btn';
    button.innerText = 'Copy';
    button.onclick = function () {
      copyCode(button);
    };
    block.appendChild(button);
  });
});

function copyCode(button) {
  var code = button.parentElement.querySelector('code');
  var textArea = document.createElement('textarea');
  textArea.value = code.textContent;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
  button.innerText = 'Copied!';
  setTimeout(() => {
    button.innerText = 'Copy';
  }, 2000);
}



console.log("hello world");

function getResultsBlock() {
  return new Promise((resolve, reject) => {
    const checkInterval = 1000;
    const maxAttempts = 30;

    let attempts = 0;

    const checkExistence = () => {
      const resultBlocks = document.getElementsByClassName("react-results--main");
      if (resultBlocks.length > 0) {
        resolve(resultBlocks[0]);
      } else {
        attempts++;
        if (attempts >= maxAttempts) {
          reject(new Error("Results block not found within the timeout period."));
        } else {
          setTimeout(checkExistence, checkInterval);
        }
      }
    };

    checkExistence();
  });
}

getResultsBlock()
  .then(resultsBlock => {
    const organicItems = resultsBlock.querySelectorAll('li[data-layout="organic"]');
    organicItems.forEach(item => {
      insertButton(item);
    });
  })
  .catch(error => {
    console.error(error.message);
  });

function createSearchButton() {
  const button = document.createElement('button');
  button.textContent = 'Search this site';
  button.style.backgroundColor = 'blue';
  button.style.color = 'white';
  button.style.padding = '8px 16px';
  button.style.margin = '4px 0';
  button.style.border = 'none';
  button.style.borderRadius = '4px';
  button.style.cursor = 'pointer';
  return button
}

function insertButton(liElement) {
  const h2Element = liElement.querySelector('h2');
  if (h2Element) {
    const domainUrl = getDomainUrl(h2Element);
    if (domainUrl) {
      const button = createSearchButton();
      button.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent event bubbling
        event.preventDefault(); // Prevent default button behavior
        searchModifiedResult(domainUrl);
      });
      h2Element.parentNode.insertBefore(button, h2Element.nextSibling);
    }
  }
}

function getDomainUrl(h2Element) {
  const anchorElement = h2Element.querySelector('a');
  if (anchorElement) {
    const href = anchorElement.getAttribute('href');
    const url = new URL(href);
    return url?.hostname;
  }
  return null;
}

function searchModifiedResult(domainUrl) {
  const { input, button } = findSearchElements();
  if (input && button) {
    const currentInputValue = input.value;
    const newValue = domainUrl + ' '+ currentInputValue;
    input.value = newValue;
    button.click();
  }
}

function findSearchElements() {
  const input = document.getElementById("search_form_input");
  const button = document.getElementById("search_button");
  if (input && button) {
    return { input, button };
  }
  return {};
}
// find searched elements functionality
let previousItemCount = 0;
let checkInterval = 1000;
let timeout = null;
let moreResultsEventListenerAdded = false;

function getResultsBlock() {
  return new Promise((resolve, reject) => {
    const resultBlocks = document.getElementsByClassName("react-results--main");
    if (resultBlocks.length > 0) {
      resolve(resultBlocks[0]);
    } else {
      reject(new Error("Results block not found."));
    }
  });
}

function waitForChanges() {
  clearTimeout(timeout);

  getResultsBlock()
    .then(resultsBlock => {
      const organicItems = resultsBlock.querySelectorAll('li[data-layout="organic"]');
      const currentItemCount = organicItems.length;
      if(!moreResultsEventListenerAdded) {
        spyMoreResultsButton();
      }
      if (currentItemCount !== previousItemCount) {
        if (checkInterval === 1000) {
          checkInterval = 5000; // change the interval to a larger one to handle new elements appearing for an unknown reason
        }
        previousItemCount = currentItemCount;
        organicItems.forEach(item => {
          insertButton(item);
        });
      }
      timeout = setTimeout(waitForChanges, checkInterval);
    })
    .catch(() => {
      timeout = setTimeout(waitForChanges, checkInterval);
    });
}

waitForChanges();

// Handle waitForChange when clicking on More Results button
function spyMoreResultsButton() {
  const moreResultsButton = document.getElementById('more-results');
  if (moreResultsButton) {
    moreResultsEventListenerAdded = true;
    moreResultsButton.addEventListener('click', function() {
      clearTimeout(timeout);
      checkInterval = 1000;
      waitForChanges();
    });
  }
}

// Add button with functionality
function createSearchButton() {
  const button = document.createElement('button');
  button.textContent = 'Search this site';
  button.className = 'search-button';
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
  if(!h2Element) return null;
  const existingButton = liElement.querySelector('.search-button');
  const domainUrl = getDomainUrl(h2Element);
  if(existingButton || !domainUrl) return null;
  const button = createSearchButton();
  button.addEventListener('click', function(event) {
    event.stopPropagation();
    event.preventDefault();
    searchModifiedResult(domainUrl);
  });
  h2Element.parentNode.insertBefore(button, h2Element.nextSibling);
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
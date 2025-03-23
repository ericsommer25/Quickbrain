// Web Tab Functions
function newTab() {
  const tabIndex = tabs.length;
  tabs.push({ url: 'about:blank', title: `Tab ${tabIndex + 1}` });
  renderTabs();
  switchTab(tabIndex);
}

function switchTab(index) {
  activeTabIndex = index;
  renderTabs();
  updateWebview();
}

function closeTab(event, index) {
  event.stopPropagation();
  if (index >= 3) { // Only allow closing tabs beyond the first three
    tabs.splice(index, 1);
    if (activeTabIndex >= index) {
      activeTabIndex = Math.max(0, activeTabIndex - 1);
    }
    renderTabs();
    updateWebview();
  }
}

function renderTabs() {
  const webTabs = document.getElementById('web-tabs');
  webTabs.innerHTML = '';
  tabs.forEach((tab, index) => {
    const tabElement = document.createElement('div');
    tabElement.classList.add('web-tab');
    if (index === activeTabIndex) {
      tabElement.classList.add('active');
    }
    tabElement.innerHTML = `${tab.title} ${index >= 3 ? '<span class="web-tab-close" onclick="closeTab(event, ' + index + ')">×</span>' : ''}`;
    tabElement.onclick = () => switchTab(index);
    webTabs.appendChild(tabElement);
  });
}

function updateWebview() {
  const webview = document.getElementById('webview');
  webview.src = tabs[activeTabIndex].url;
  document.getElementById('web-address-bar').value = tabs[activeTabIndex].url;
}

// Navigate to the URL entered in the address bar
function goToUrl() {
  const input = document.getElementById('web-address-bar').value.trim();
  if (input) {
    if (!input.startsWith('http://') && !input.startsWith('https://')) {
      tabs[activeTabIndex].url = 'https://' + input; // Auto-prepend https:// if missing
    } else {
      tabs[activeTabIndex].url = input;
    }
    updateWebview();
  }
}

// Handle "Enter" key in the address bar
function handleAddressBar(event) {
  if (event.key === 'Enter') {
    goToUrl();
  }
}

// Go back in history
function goBack() {
  const webview = document.getElementById('webview');
  if (webview.contentWindow.history.length > 1) {
    webview.contentWindow.history.back();
  }
}

// Go forward in history
function goForward() {
  const webview = document.getElementById('webview');
  if (webview.contentWindow.history.length > 1) {
    webview.contentWindow.history.forward();
  }
}

// Reload the current page
function reloadPage() {
  const webview = document.getElementById('webview');
  webview.contentWindow.location.reload();
}

// Function to toggle full screen for panels
function toggleFullScreen(panel) {
  const outliner = document.getElementById('outliner-container');
  const pages = document.getElementById('pages-container');
  const ai = document.getElementById('ai-container');
  const web = document.getElementById('web-container');

  if (panel === 'outliner') {
    if (outliner.style.width === '100%') {
      outliner.style.width = '33.33%';
      pages.style.display = 'block';
      web.style.display = 'block';
    } else {
      outliner.style.width = '100%';
      pages.style.display = 'none';
      web.style.display = 'none';
    }
  } else if (panel === 'pages') {
    if (pages.style.width === '100%') {
      pages.style.width = '33.33%';
      outliner.style.display = 'block';
      web.style.display = 'block';
    } else {
      pages.style.width = '100%';
      outliner.style.display = 'none';
      web.style.display = 'none';
    }
  } else if (panel === 'web') {
    if (web.style.width === '100%') {
      web.style.width = '33.33%';
      outliner.style.display = 'block';
      pages.style.display = 'block';
    } else {
      web.style.width = '100%';
      outliner.style.display = 'none';
      pages.style.display = 'none';
    }
  }

  adjustLayout();
}

// Function to generate 200 words of text related to the selected topic
async function generateAgentText() {
  // Show a popup alert
  const alertMessage = "The Agent is preparing text for your selected topic. Please wait a moment.";
  const alertDiv = document.createElement('div');
  alertDiv.style.position = 'fixed';
  alertDiv.style.top = '50%';
  alertDiv.style.left = '50%';
  alertDiv.style.transform = 'translate(-50%, -50%)';
  alertDiv.style.backgroundColor = '#fff';
  alertDiv.style.padding = '20px';
  alertDiv.style.border = '1px solid #ccc';
  alertDiv.style.borderRadius = '5px';
  alertDiv.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
  alertDiv.style.zIndex = '10000';
  alertDiv.innerHTML = `
    <p>${alertMessage}</p>
    <button onclick="this.parentElement.remove()" style="margin-top: 10px; padding: 5px 10px; cursor: pointer;">Close</button>
  `;
  document.body.appendChild(alertDiv);

  if (!selectedItem) {
    alert('Please select a topic first.');
    return;
  }

  const topicText = selectedItem.querySelector('span:not(.topic-number)').textContent;

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-8d8e2b1f5ea7467f80e3d4e28a63be2a', // Use the provided API key
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: `Generate 200 words of text related to: ${topicText}` }],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    // Populate the selected topic's page with the generated text
    quill.root.innerHTML = generatedText;
    selectedItem.dataset.content = generatedText;
  } catch (error) {
    console.error('Error generating text:', error);
    alert('Failed to generate text. Please try again.');
  }
} 
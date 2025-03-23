// Function to toggle the instructions panel
function toggleInstructions() {
  const instructionsPanel = document.getElementById('instructions-panel');
  instructionsPanel.classList.toggle('visible');
}

// Function to toggle child levels
function toggleChildLevel(event) {
  const topicNumber = event.currentTarget;
  const li = topicNumber.parentElement;
  const ul = li.querySelector('ul');
  if (ul) {
    ul.classList.toggle('hidden');
  }
}

// Function to add toggle listener to topic numbers
function addToggleListener(li) {
  const topicNumber = li.querySelector('.topic-number');
  if (topicNumber) {
    topicNumber.addEventListener('click', toggleChildLevel);
  }
}

// Function to update topic numbers and add orange ball for topics with children
function updateTopicNumbers() {
  const topics = document.querySelectorAll('#outliner li');
  topics.forEach((li, index) => {
    const topicNumber = li.querySelector('.topic-number');
    if (topicNumber) {
      topicNumber.textContent = index + 1;
      if (li.querySelector('ul')) {
        topicNumber.classList.add('has-children');
      } else {
        topicNumber.classList.remove('has-children');
      }
    }
  });
}

// Function to toggle focus mode
function toggleFocus() {
  const focusButton = document.getElementById('focus-button');
  isFocusMode = !isFocusMode;
  focusButton.classList.toggle('active', isFocusMode);

  const topics = document.querySelectorAll('#outliner li');
  topics.forEach(li => {
    if (isFocusMode) {
      if (li !== selectedItem && !li.contains(selectedItem) && !selectedItem.contains(li)) {
        li.classList.add('hidden');
      } else {
        li.classList.remove('hidden');
        // Ensure child levels of the selected topic are visible
        const childUl = li.querySelector('ul');
        if (childUl) {
          childUl.classList.remove('hidden');
        }
      }
    } else {
      li.classList.remove('hidden');
    }
  });
}

// Function to edit the selected topic
function editSelectedTopic() {
  if (selectedItem) {
    editItem({ currentTarget: selectedItem });
  }
}

// Function to copy a topic
function copyTopic() {
  if (selectedItem) {
    // Serialize the selected topic and its children
    const topicData = {
      html: selectedItem.outerHTML,
      content: selectedItem.dataset.content || ""
    };
    localStorage.setItem('copiedTopic', JSON.stringify(topicData));
  }
}

// Function to paste a topic
function pasteTopic() {
  const copiedTopicData = localStorage.getItem('copiedTopic');
  if (copiedTopicData) {
    const topicData = JSON.parse(copiedTopicData);
    const newTopic = document.createElement('li');
    newTopic.innerHTML = topicData.html;
    newTopic.dataset.content = topicData.content;

    // Add event listeners to the new topic and its children
    newTopic.addEventListener('click', selectItem);
    newTopic.addEventListener('dblclick', editItem);
    addToggleListener(newTopic);

    // Add event listeners to any child topics
    const childTopics = newTopic.querySelectorAll('li');
    childTopics.forEach(child => {
      child.addEventListener('click', selectItem);
      child.addEventListener('dblclick', editItem);
      addToggleListener(child);
    });

    if (selectedItem) {
      // Insert the new topic below the selected topic and at the same level
      const parentUl = selectedItem.parentNode;
      parentUl.insertBefore(newTopic, selectedItem.nextSibling);
    } else {
      // If no topic is selected, add it to the top level
      document.getElementById('outliner').appendChild(newTopic);
    }

    updateTopicNumbers();
  }
}

// Function to send a chat message
async function sendChatMessage() {
  const input = document.getElementById('chatbot-input');
  const text = input.value.trim();

  if (!text) return;

  // Add user message
  const messages = document.getElementById('chatbot-messages');
  const userMessage = document.createElement('div');
  userMessage.classList.add('message', 'user-message');
  userMessage.innerHTML = `<p>${text}</p><p class="timestamp">${new Date().toLocaleTimeString()}</p>`;
  messages.appendChild(userMessage);

  // Clear input
  input.value = '';

  // Simulate bot response
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-8d8e2b1f5ea7467f80e3d4e28a63be2a', // Use the provided API key
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: text }],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const botMessage = data.choices[0].message.content;

    // Add bot message
    const botMessageElement = document.createElement('div');
    botMessageElement.classList.add('message', 'bot-message');
    botMessageElement.innerHTML = `<p>${botMessage}</p><p class="timestamp">${new Date().toLocaleTimeString()}</p>`;
    messages.appendChild(botMessageElement);

    // Add copy button to bot message
    const copyButton = document.createElement('button');
    copyButton.classList.add('copy-button');
    copyButton.innerHTML = '📋';
    copyButton.onclick = () => copyToClipboard(botMessage);
    botMessageElement.appendChild(copyButton);
  } catch (error) {
    console.error('Error sending message:', error);
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('message', 'bot-message');
    errorMessage.innerHTML = `<p>Failed to send message. Please try again.</p><p class="timestamp">${new Date().toLocaleTimeString()}</p>`;
    messages.appendChild(errorMessage);
  }

  // Scroll to the bottom
  messages.scrollTop = messages.scrollHeight;
}

// Function to copy text to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Copied to clipboard!');
  });
}

// Function to clear the chat
function clearChat() {
  const messages = document.getElementById('chatbot-messages');
  messages.innerHTML = '';
}

// Deep Think function
function deepThink() {
  const input = document.getElementById('chatbot-input');
  const text = input.value.trim();

  if (!text) {
    alert('Please enter a message to Deep Think.');
    return;
  }

  // Simulate a "deep thinking" response
  const messages = document.getElementById('chatbot-messages');
  const botMessage = document.createElement('div');
  botMessage.classList.add('message', 'bot-message');
  botMessage.innerHTML = `<p>🤔 Deep Thinking about: "${text}"...</p><p class="timestamp">${new Date().toLocaleTimeString()}</p>`;
  messages.appendChild(botMessage);

  // Scroll to the bottom
  messages.scrollTop = messages.scrollHeight;
}

// Function to save the outline to a local file
async function saveOutline() {
  const outliner = document.getElementById('outliner');
  const data = JSON.stringify(outliner.innerHTML);

  if ('showSaveFilePicker' in window) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: `Quickbrain${currentFileIndex}.json`,
        types: [{
          description: 'Quickbrain Files',
          accept: { 'application/json': ['.json'] },
        }],
      });

      const writable = await handle.createWritable();
      await writable.write(data);
      await writable.close();

      alert('File saved successfully!');
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Failed to save file. Please try again.');
    }
  } else {
    // Fallback for older browsers
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Quickbrain${currentFileIndex}.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert('File saved to your Downloads folder.');
  }
  currentFileIndex++;
  localStorage.setItem('currentFileIndex', currentFileIndex);
}

// Function to load the outline from a local file
function loadOutline() {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json';
  fileInput.style.display = 'none';
  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const outliner = document.getElementById('outliner');
      outliner.innerHTML = JSON.parse(e.target.result);
      updateTopicNumbers();
      document.querySelectorAll('#outliner li').forEach(li => {
        li.addEventListener('click', selectItem);
        li.addEventListener('dblclick', editItem);
        addToggleListener(li);
      });
    };
    reader.readAsText(file);
  });
  fileInput.click();
}

// Automatically load the last saved file
function loadLastSavedFile() {
  const lastFileIndex = localStorage.getItem('currentFileIndex') || 0;
  if (lastFileIndex > 0) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (e) {
        const outliner = document.getElementById('outliner');
        outliner.innerHTML = JSON.parse(e.target.result);
        updateTopicNumbers();
        document.querySelectorAll('#outliner li').forEach(li => {
          li.addEventListener('click', selectItem);
          li.addEventListener('dblclick', editItem);
          addToggleListener(li);
        });
      };
      reader.readAsText(file);
    });
    fileInput.click();
  }
}

// Function to open a .docx file
function openDocx() {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.docx';
  fileInput.style.display = 'none';
  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      mammoth.extractRawText({ arrayBuffer: e.target.result })
        .then(result => {
          quill.setText(result.value);
        })
        .catch(err => {
          console.error('Error reading .docx file:', err);
          alert('Failed to read .docx file. Please try again.');
        });
    };
    reader.readAsArrayBuffer(file);
  });
  fileInput.click();
}

// Function to save the current content as a .docx file using a file picker
async function saveHtmlAsDocx() {
  const content = quill.root.innerHTML;

  if ('showSaveFilePicker' in window) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: 'document.docx',
        types: [{
          description: 'Word Documents',
          accept: { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
        }],
      });

      const writable = await handle.createWritable();
      const docx = htmlDocx.asBlob(content);
      await writable.write(docx);
      await writable.close();

      alert('File saved successfully!');
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Failed to save file. Please try again.');
    }
  } else {
    // Fallback for older browsers
    const docx = htmlDocx.asBlob(content);
    const url = URL.createObjectURL(docx);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.docx';
    a.click();
    URL.revokeObjectURL(url);
    alert('File saved to your Downloads folder.');
  }
}

// Optimize topic-to-topic navigation for long documents
function optimizeNavigation() {
  const topics = document.querySelectorAll('#outliner li');
  topics.forEach(li => {
    li.addEventListener('click', (e) => {
      if (selectedItem) {
        selectedItem.dataset.content = quill.root.innerHTML;
        selectedItem.classList.remove('selected');
      }
      selectedItem = e.currentTarget;
      selectedItem.classList.add('selected');
      quill.root.innerHTML = selectedItem.dataset.content || "";
      quill.enable();
      e.stopPropagation();
    });
  });
} 
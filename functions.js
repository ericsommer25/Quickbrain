// Function to add a folder
function addFolder() {
  const folderNameInput = document.getElementById('folder-name');
  const folderName = folderNameInput.value.trim();
  if (folderName) {
    folders.push(folderName);
    localStorage.setItem('folders', JSON.stringify(folders));
    updateFolderDropdown();
    folderNameInput.value = '';
  }
}

// Function to update the folder dropdown
function updateFolderDropdown() {
  const folderSelect = document.getElementById('folder-select');
  folderSelect.innerHTML = '<option value="">Select a folder</option>';
  folders.forEach(folder => {
    const option = document.createElement('option');
    option.value = folder;
    option.textContent = folder;
    folderSelect.appendChild(option);
  });
}

// Function to toggle the files menu
function toggleFilesMenu() {
  const filesMenu = document.getElementById('files-menu');
  filesMenu.style.display = filesMenu.style.display === 'block' ? 'none' : 'block';
}

// Function to close the files menu
function closeFilesMenu() {
  const filesMenu = document.getElementById('files-menu');
  filesMenu.style.display = 'none';
}

// Function to toggle the shortcuts menu
function toggleShortcutsMenu() {
  const shortcutsMenu = document.getElementById('shortcuts-menu');
  shortcutsMenu.style.display = shortcutsMenu.style.display === 'block' ? 'none' : 'block';
}

// Function to close the shortcuts menu
function closeShortcutsMenu() {
  const shortcutsMenu = document.getElementById('shortcuts-menu');
  shortcutsMenu.style.display = 'none';
}

// Function to show the file dialog
function showFileDialog(action) {
  currentAction = action;
  const fileDialog = document.getElementById('file-dialog');
  fileDialog.style.display = 'block';
  updateFolderDropdown();
}

// Function to close the file dialog
function closeFileDialog() {
  const fileDialog = document.getElementById('file-dialog');
  fileDialog.style.display = 'none';
}

// Function to handle the file action
function handleFileAction() {
  const folderSelect = document.getElementById('folder-select');
  const fileNameInput = document.getElementById('file-name');
  const selectedFolder = folderSelect.value;
  const fileName = fileNameInput.value.trim();

  if (!selectedFolder || !fileName) {
    alert('Please select a folder and enter a file name.');
    return;
  }

  saveFolder = selectedFolder;
  localStorage.setItem('saveFolder', saveFolder);

  switch (currentAction) {
    case 'create':
      createQuickbrainFile(fileName);
      break;
  }

  closeFileDialog();
}

// Function to create a new Quickbrain file
async function createQuickbrainFile(fileName) {
  const outliner = document.getElementById('outliner');
  const data = JSON.stringify(outliner.innerHTML);

  if ('showSaveFilePicker' in window) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: `${fileName}.json`,
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
    a.download = `${fileName}.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert('File saved to your Downloads folder.');
  }
}

// Function to open a Quickbrain file
function openQuickbrainFile() {
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

// Function to save the current Quickbrain file
async function saveQuickbrainFile() {
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
}

// Function to save the current Quickbrain file with a new name
async function saveQuickbrainFileAs() {
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
}

// Function to save the current Quickbrain file as a backup
async function saveQuickbrainFileAsBackup() {
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
}

// Function to select a topic
function selectItem(event) {
  if (selectedItem) {
    selectedItem.dataset.content = quill.root.innerHTML;
    selectedItem.classList.remove('selected');
  }
  selectedItem = event.currentTarget;
  selectedItem.classList.add('selected');
  updateWordProcessor();
  event.stopPropagation();
}

// Function to update the word processor with the selected topic's content
function updateWordProcessor() {
  if (selectedItem) {
    quill.root.innerHTML = selectedItem.dataset.content || "";
    quill.enable();
  } else {
    quill.root.innerHTML = "";
    quill.disable();
  }
}

// Function to edit a topic
function editItem(event) {
  const li = event.currentTarget;
  const span = li.querySelector('span:not(.topic-number)');
  const text = span.textContent;
  li.classList.add('editing');
  span.innerHTML = `<input type="text" value="${text}">`;
  const input = span.querySelector('input');
  input.focus();
  input.addEventListener('blur', () => saveEdit(li, span, text));
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') saveEdit(li, span, text);
  });
  event.stopPropagation();
}

// Function to save the edited topic
function saveEdit(li, span, originalText) {
  const input = span.querySelector('input');
  const newText = input.value.trim();
  if (newText) {
    span.textContent = newText;
  } else {
    span.textContent = originalText;
  }
  li.classList.remove('editing');
}

// Function to add a new topic
function addTopic() {
  const newTopic = document.createElement('li');
  newTopic.innerHTML = '<span class="topic-number">1</span><span>New Topic</span>';
  newTopic.addEventListener('click', selectItem);
  newTopic.addEventListener('dblclick', editItem);

  if (selectedItem) {
    // Insert the new topic below the selected topic and at the same level
    const parentUl = selectedItem.parentNode;
    parentUl.insertBefore(newTopic, selectedItem.nextSibling);
  } else {
    // If no topic is selected, add it to the top level
    document.getElementById('outliner').appendChild(newTopic);
  }

  addToggleListener(newTopic);
  updateTopicNumbers();
}

// Function to add a child topic
function addChild() {
  if (selectedItem) {
    const newChild = document.createElement('li');
    newChild.innerHTML = '<span class="topic-number">1</span><span>New Child</span>';
    newChild.addEventListener('click', selectItem);
    newChild.addEventListener('dblclick', editItem);

    if (!selectedItem.querySelector('ul')) {
      const ul = document.createElement('ul');
      selectedItem.appendChild(ul);
    }

    selectedItem.querySelector('ul').appendChild(newChild);
    addToggleListener(newChild);
    updateTopicNumbers();
    selectItem({ currentTarget: newChild });
  } else {
    alert('Please select a topic to add a child.');
  }
}

// Function to delete a topic
function deleteTopic() {
  if (selectedItem) {
    selectedItem.remove();
    selectedItem = null;
    updateWordProcessor();
  }
}

// Function to move a topic up
function moveUp() {
  if (selectedItem && selectedItem.previousElementSibling) {
    const parentUl = selectedItem.parentNode;
    parentUl.insertBefore(selectedItem, selectedItem.previousElementSibling);
  }
}

// Function to move a topic down
function moveDown() {
  if (selectedItem && selectedItem.nextElementSibling) {
    const parentUl = selectedItem.parentNode;
    parentUl.insertBefore(selectedItem.nextElementSibling, selectedItem);
  }
}

// Function to move a topic left
function moveLeft() {
  if (selectedItem && selectedItem.parentNode.parentNode.tagName === 'LI') {
    const parentLi = selectedItem.parentNode.parentNode;
    const grandparentUl = parentLi.parentNode;
    grandparentUl.insertBefore(selectedItem, parentLi.nextSibling);
  }
}

// Function to move a topic right
function moveRight() {
  if (selectedItem && selectedItem.previousElementSibling) {
    const prevLi = selectedItem.previousElementSibling;
    if (!prevLi.querySelector('ul')) {
      const ul = document.createElement('ul');
      prevLi.appendChild(ul);
    }
    prevLi.querySelector('ul').appendChild(selectedItem);
  }
}

// Function to navigate between topics
function navigate(direction) {
  if (!selectedItem) return;

  let target = null;
  switch (direction) {
    case 'up':
      target = selectedItem.previousElementSibling;
      break;
    case 'down':
      target = selectedItem.nextElementSibling;
      break;
    case 'left':
      target = selectedItem.parentNode.parentNode;
      if (target.tagName !== 'LI') target = null;
      break;
    case 'right':
      target = selectedItem.querySelector('li');
      break;
  }

  if (target) {
    selectItem({ currentTarget: target });
  }
}

// Function to toggle sections
function toggleSection(section) {
  const outliner = document.getElementById('outliner-container');
  const pages = document.getElementById('pages-container');
  const ai = document.getElementById('ai-container');
  const web = document.getElementById('web-container');

  if (section === 'outliner') {
    outliner.style.display = outliner.style.display === 'block' ? 'none' : 'block';
  } else if (section === 'pages') {
    pages.style.display = pages.style.display === 'block' ? 'none' : 'block';
  } else if (section === 'ai') {
    ai.style.display = ai.style.display === 'flex' ? 'none' : 'flex';
  } else if (section === 'web') {
    web.style.display = web.style.display === 'block' ? 'none' : 'block';
  }

  adjustLayout();
}

// Function to adjust the layout
function adjustLayout() {
  const outliner = document.getElementById('outliner-container');
  const pages = document.getElementById('pages-container');
  const ai = document.getElementById('ai-container');
  const web = document.getElementById('web-container');
  const splitter1 = document.getElementById('splitter');
  const splitter2 = document.getElementById('chatbot-splitter');

  const visibleSections = [outliner, pages, ai, web].filter(section => section.style.display !== 'none');

  if (visibleSections.length === 1) {
    visibleSections[0].style.width = '100%';
    splitter1.style.display = 'none';
    splitter2.style.display = 'none';
  } else if (visibleSections.length === 2) {
    visibleSections[0].style.width = '50%';
    visibleSections[1].style.width = '50%';
    splitter1.style.display = 'block';
    splitter2.style.display = 'none';
  } else if (visibleSections.length === 3) {
    visibleSections[0].style.width = '33.33%';
    visibleSections[1].style.width = '33.33%';
    visibleSections[2].style.width = '33.33%';
    splitter1.style.display = 'block';
    splitter2.style.display = 'block';
  } else if (visibleSections.length === 4) {
    visibleSections[0].style.width = '25%';
    visibleSections[1].style.width = '25%';
    visibleSections[2].style.width = '25%';
    visibleSections[3].style.width = '25%';
    splitter1.style.display = 'block';
    splitter2.style.display = 'block';
  }
} 
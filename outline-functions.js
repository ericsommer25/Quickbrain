// Function to collapse all topics
function collapseAll() {
  const topics = document.querySelectorAll('#outliner li ul');
  topics.forEach(ul => {
    ul.classList.add('hidden');
  });
}

// Function to expand all topics
function expandAll() {
  const topics = document.querySelectorAll('#outliner li ul');
  topics.forEach(ul => {
    ul.classList.remove('hidden');
  });
}

// Function to undo the last action
function undo() {
  if (historyIndex > 0) {
    historyIndex--;
    const outliner = document.getElementById('outliner');
    outliner.innerHTML = history[historyIndex];
    document.querySelectorAll('#outliner li').forEach(li => {
      li.addEventListener('click', selectItem);
      li.addEventListener('dblclick', editItem);
      addToggleListener(li);
    });
    updateTopicNumbers();
  }
}

// Function to redo the last undone action
function redo() {
  if (historyIndex < history.length - 1) {
    historyIndex++;
    const outliner = document.getElementById('outliner');
    outliner.innerHTML = history[historyIndex];
    document.querySelectorAll('#outliner li').forEach(li => {
      li.addEventListener('click', selectItem);
      li.addEventListener('dblclick', editItem);
      addToggleListener(li);
    });
    updateTopicNumbers();
  }
}

// Function to add to history
function addToHistory() {
  const outliner = document.getElementById('outliner');
  if (historyIndex < history.length - 1) {
    history.splice(historyIndex + 1);
  }
  history.push(outliner.innerHTML);
  historyIndex = history.length - 1;
}

// Add history capture to all actions that modify the outline
document.addEventListener('DOMContentLoaded', function() {
  // Add to history before any modification
  const actions = [addTopic, addChild, deleteTopic, moveUp, moveDown, moveLeft, moveRight];
  actions.forEach(action => {
    const originalAction = action;
    window[action.name] = function() {
      addToHistory();
      originalAction.apply(this, arguments);
    };
  });
}); 
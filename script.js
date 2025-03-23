// Language packs for English and Chinese
const languagePacks = {
  en: {
    files: "Files",
    shortcuts: "Shortcuts",
    outliner: "Outliner",
    pages: "Pages",
    deepThink: "Deep Think",
    aiWeb: "AI & Web",
    focus: "Focus",
    instructions: "?",
    newTopic: "New Topic",
    addChild: "Add Child",
    delete: "Delete",
    moveUp: "Move Up",
    moveDown: "Move Down",
    moveLeft: "Move Left",
    moveRight: "Move Right",
    collapseAll: "Collapse All",
    expandAll: "Expand All",
    undo: "Undo",
    redo: "Redo",
    uploadDocx: "Upload .docx",
    downloadDocx: "Download .docx",
    chatbotHeader: "Chatbot",
    deepThinkButton: "Deep Think",
    clearChat: "🗑️",
    closeChatbot: "Close Chatbot",
    attachFile: "Attach File",
    prompts: "Prompts",
    typeMessage: "Type a message...",
    createQuickbrainFile: "Create Quickbrain file",
    openQuickbrainFile: "Open Quickbrain file",
    saveQuickbrainFile: "Save Quickbrain file",
    saveQuickbrainFileAs: "Save Quickbrain file as",
    saveQuickbrainFileAsBackup: "Save Quickbrain file as backup",
    closeFilesMenu: "Close",
    addTopicShortcut: "Add topic: ctrl + enter or insert key",
    addChildShortcut: "Add child: alt + enter or insert key",
    editTopicShortcut: "Edit topic: alt + e",
    deleteTopicShortcut: "Delete topic: ctrl + x",
    copyTopicShortcut: "Copy topic: ctrl + c",
    pasteTopicShortcut: "Paste topic: ctrl + v",
    toggleFocusShortcut: "Focus/Defocus: ctrl + f",
    closeShortcutsMenu: "Close",
    navigateTopics: "Use keyboard arrow keys to move among topics.",
    moveTopics: "Use ctrl + arrow key to move a topic up, down, left, or right.",
    selectEditTopic: "Single click to select a topic; double click to edit it.",
  },
  zh: {
    files: "文件",
    shortcuts: "快捷键",
    outliner: "大纲",
    pages: "页面",
    deepThink: "深度思考",
    aiWeb: "AI & 网页",
    focus: "专注模式",
    instructions: "？",
    newTopic: "新主题",
    addChild: "添加子主题",
    delete: "删除",
    moveUp: "上移",
    moveDown: "下移",
    moveLeft: "左移",
    moveRight: "右移",
    collapseAll: "全部折叠",
    expandAll: "全部展开",
    undo: "撤销",
    redo: "重做",
    uploadDocx: "上传 .docx",
    downloadDocx: "下载 .docx",
    chatbotHeader: "聊天机器人",
    deepThinkButton: "深度思考",
    clearChat: "🗑️",
    closeChatbot: "关闭聊天机器人",
    attachFile: "附加文件",
    prompts: "提示",
    typeMessage: "输入消息...",
    createQuickbrainFile: "创建 Quickbrain 文件",
    openQuickbrainFile: "打开 Quickbrain 文件",
    saveQuickbrainFile: "保存 Quickbrain 文件",
    saveQuickbrainFileAs: "另存为 Quickbrain 文件",
    saveQuickbrainFileAsBackup: "备份 Quickbrain 文件",
    closeFilesMenu: "关闭",
    addTopicShortcut: "添加主题: ctrl + enter 或 insert 键",
    addChildShortcut: "添加子主题: alt + enter 或 insert 键",
    editTopicShortcut: "编辑主题: alt + e",
    deleteTopicShortcut: "删除主题: ctrl + x",
    copyTopicShortcut: "复制主题: ctrl + c",
    pasteTopicShortcut: "粘贴主题: ctrl + v",
    toggleFocusShortcut: "专注/取消专注: ctrl + f",
    closeShortcutsMenu: "关闭",
    navigateTopics: "使用键盘箭头键在主题之间移动。",
    moveTopics: "使用 ctrl + 箭头键将主题上移、下移、左移或右移。",
    selectEditTopic: "单击选择主题；双击编辑主题。",
  }
};

let currentLanguage = 'en'; // Default language is English
let selectedItem = null;
let history = [];
let historyIndex = -1;
let isFocusMode = false;
let currentFileIndex = localStorage.getItem('currentFileIndex') || 0;
let saveFolder = localStorage.getItem('saveFolder') || '';
let folders = JSON.parse(localStorage.getItem('folders')) || [];
let copiedTopic = null;
let isHoisted = false;
let originalOutline = null;
let currentAction = '';

// Web Tabs
let tabs = [
  { url: 'https://kimi.ai', title: 'Kimi.ai' },
  { url: 'https://qwenlm.ai', title: 'qwenlm.ai' },
  { url: 'https://deepseek.ai', title: 'Deepseek.ai' }
];
let activeTabIndex = 0;

// Initialize Quill editor with URL recognition
let quill;

// Document ready function
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Quill
  quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean']
      ],
      clipboard: {
        matchVisual: false, // Ensure URLs are recognized and made clickable
      }
    }
  });

  // Add event listeners to existing topics
  document.querySelectorAll('#outliner li').forEach(li => {
    li.addEventListener('click', selectItem);
    li.addEventListener('dblclick', editItem);
    addToggleListener(li);
  });

  // Splitter functionality
  const splitter = document.getElementById('splitter');
  const chatbotSplitter = document.getElementById('chatbot-splitter');
  const outlinerContainer = document.querySelector('.outliner-container');
  const wordProcessorContainer = document.querySelector('.word-processor-container');
  const chatbotPanel = document.getElementById('ai-container');
  const webPanel = document.getElementById('web-container');
  let isDragging = false;
  let activeSplitter = null;

  splitter.addEventListener('mousedown', () => {
    isDragging = true;
    activeSplitter = splitter;
  });

  chatbotSplitter.addEventListener('mousedown', () => {
    isDragging = true;
    activeSplitter = chatbotSplitter;
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const newWidth = e.clientX;
      const minWidth = 200;
      const maxWidth = window.innerWidth - 200;

      if (activeSplitter === splitter) {
        outlinerContainer.style.width = `${Math.min(Math.max(newWidth, minWidth), maxWidth)}px`;
        wordProcessorContainer.style.width = `${window.innerWidth - newWidth - 8}px`;
      } else if (activeSplitter === chatbotSplitter) {
        wordProcessorContainer.style.width = `${Math.min(Math.max(newWidth, minWidth), maxWidth)}px`;
        chatbotPanel.style.width = `${window.innerWidth - newWidth - 8}px`;
      }
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    activeSplitter = null;
  });

  // Initial update of topic numbers
  updateTopicNumbers();

  // Set default layout to show all three panels
  document.getElementById('outliner-container').style.display = 'block';
  document.getElementById('pages-container').style.display = 'block';
  document.getElementById('web-container').style.display = 'block';
  document.getElementById('ai-container').style.display = 'none';
  adjustLayout();

  // Add Enter key functionality to send chat message
  document.getElementById('chatbot-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent new line in textarea
      sendChatMessage();
    }
  });

  // Handle AI selection in dropdown
  document.getElementById('chatbot-select').addEventListener('change', (e) => {
    const selectedAI = e.target.value;
    if (selectedAI !== 'Deepseek') {
      alert('This AI not available here yet. Try DeepSeek.');
      e.target.value = 'Deepseek'; // Reset to Deepseek
    }
  });

  // Keyboard event listener
  document.addEventListener('keydown', (event) => {
    const isEditorFocused = document.activeElement === quill.root;

    if (isEditorFocused) {
      // Allow arrow keys to work in the editor
      return;
    }

    if (event.ctrlKey) {
      switch (event.key) {
        case 'Enter':
        case 'Insert':
          addTopic();
          break;
        case 'e':
          editSelectedTopic();
          break;
        case 'x':
          deleteTopic();
          break;
        case 'c':
          copyTopic();
          break;
        case 'v':
          pasteTopic();
          break;
        case 'ArrowUp': moveUp(); break;
        case 'ArrowDown': moveDown(); break;
        case 'ArrowLeft': moveLeft(); break;
        case 'ArrowRight': moveRight(); break;
      }
    } else if (event.altKey) {
      switch (event.key) {
        case 'Enter':
        case 'Insert':
          addChild();
          break;
      }
    } else {
      switch (event.key) {
        case 'ArrowUp': navigate('up'); break;
        case 'ArrowDown': navigate('down'); break;
        case 'ArrowLeft': navigate('left'); break;
        case 'ArrowRight': navigate('right'); break;
      }
    }
  });

  // Optimize topic-to-topic navigation for long documents
  optimizeNavigation();

  // Call the function to set the initial language
  updateInterfaceLanguage();
});

// Function to toggle between English and Chinese
function toggleLanguage() {
  currentLanguage = currentLanguage === 'en' ? 'zh' : 'en';
  updateInterfaceLanguage();
}

// Function to update the interface language
function updateInterfaceLanguage() {
  const lang = languagePacks[currentLanguage];

  // Update toolbar buttons
  document.querySelector('button[onclick="toggleFilesMenu()"]').textContent = lang.files;
  document.querySelector('button[onclick="toggleShortcutsMenu()"]').textContent = lang.shortcuts;
  document.querySelector('button[onclick="toggleSection(\'outliner\')"]').textContent = lang.outliner;
  document.querySelector('button[onclick="toggleSection(\'pages\')"]').textContent = lang.pages;
  document.querySelector('button[onclick="toggleSection(\'ai\')"]').textContent = lang.deepThink;
  document.querySelector('button[onclick="toggleSection(\'web\')"]').textContent = lang.aiWeb;
  document.querySelector('button[onclick="toggleInstructions()"]').textContent = lang.instructions;
  document.getElementById('focus-button').textContent = lang.focus;

  // Update outliner icons
  document.querySelector('.fa-plus').title = lang.newTopic;
  document.querySelector('.fa-level-down-alt').title = lang.addChild;
  document.querySelector('.fa-trash').title = lang.delete;
  document.querySelector('.fa-arrow-up').title = lang.moveUp;
  document.querySelector('.fa-arrow-down').title = lang.moveDown;
  document.querySelector('.fa-arrow-left').title = lang.moveLeft;
  document.querySelector('.fa-arrow-right').title = lang.moveRight;
  document.querySelector('.fa-compress').title = lang.collapseAll;
  document.querySelector('.fa-expand').title = lang.expandAll;
  document.querySelector('.fa-undo').title = lang.undo;
  document.querySelector('.fa-redo').title = lang.redo;

  // Update word processor icons
  document.querySelector('.fa-upload').title = lang.uploadDocx;
  document.querySelector('.fa-download').title = lang.downloadDocx;

  // Update chatbot panel
  document.querySelector('.chatbot-header select').innerHTML = `
    <option value="Deepseek">${lang.chatbotHeader}</option>
    <option value="Kimi">Kimi</option>
    <option value="Ernie Bot">Ernie Bot</option>
    <option value="Qwen">Qwen</option>
  `;
  document.querySelector('.deep-think-button').textContent = lang.deepThinkButton;
  document.querySelector('.clear-button').title = lang.clearChat;
  document.querySelector('.chatbot-input textarea').placeholder = lang.typeMessage;
  document.querySelector('.fa-paperclip').title = lang.attachFile;
  document.querySelector('.fa-comment-dots').title = lang.prompts;

  // Update files menu
  const filesMenu = document.getElementById('files-menu');
  filesMenu.innerHTML = `
    <button onclick="showFileDialog('create')">${lang.createQuickbrainFile}</button>
    <button onclick="openQuickbrainFile()">${lang.openQuickbrainFile}</button>
    <button onclick="saveQuickbrainFile()">${lang.saveQuickbrainFile}</button>
    <button onclick="saveQuickbrainFileAs()">${lang.saveQuickbrainFileAs}</button>
    <button onclick="saveQuickbrainFileAsBackup()">${lang.saveQuickbrainFileAsBackup}</button>
    <button onclick="closeFilesMenu()">${lang.closeFilesMenu}</button>
  `;

  // Update shortcuts menu
  const shortcutsMenu = document.getElementById('shortcuts-menu');
  shortcutsMenu.innerHTML = `
    <button onclick="addTopic()">${lang.addTopicShortcut}</button>
    <button onclick="addChild()">${lang.addChildShortcut}</button>
    <button onclick="editSelectedTopic()">${lang.editTopicShortcut}</button>
    <button onclick="deleteTopic()">${lang.deleteTopicShortcut}</button>
    <button onclick="copyTopic()">${lang.copyTopicShortcut}</button>
    <button onclick="pasteTopic()">${lang.pasteTopicShortcut}</button>
    <button onclick="toggleFocus()">${lang.toggleFocusShortcut}</button>
    <button onclick="closeShortcutsMenu()">${lang.closeShortcutsMenu}</button>
    <p style="margin-top: 10px; font-size: 12px; color: #666;">
      ${lang.navigateTopics}<br>
      ${lang.moveTopics}<br>
      ${lang.selectEditTopic}
    </p>
  `;

  // Update the language toggle button text
  document.getElementById('language-toggle').textContent = currentLanguage === 'en' ? '中文' : 'English';
} 
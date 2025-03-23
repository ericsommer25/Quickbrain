# Quickbrain

Quickbrain is an all-in-one outlining, note-taking, and AI-assisted writing application with a built-in web browser.

## File Structure

The application uses a modular architecture with separate files for different functionalities:

### Core Files

- **index.html** - Main HTML file that brings everything together, including the UI structure and external dependencies
- **styles.css** - Contains all CSS styling for the application

### JavaScript Files

- **script.js** - Core initialization and language handling (English/Chinese)
- **functions.js** - Basic functionality, file operations, and topic management
- **ui-functions.js** - User interface related functions and chat integration
- **web-functions.js** - Web browser panel functions and tab management
- **outline-functions.js** - Outliner-specific functions like collapsing/expanding topics

## Features

### Outliner

The outliner is the heart of Quickbrain, allowing you to create a hierarchical structure of topics and subtopics. Think of it like a table of contents for your thoughts:

- Create unlimited topics and nested subtopics
- Easily rearrange topics by dragging or using keyboard shortcuts
- Collapse and expand sections to focus on specific parts
- Navigate quickly between related ideas
- Focus mode hides everything except the topic you're working on

### Word Processor

Each topic in your outline has its own dedicated content area:

- Rich text editor with formatting options (bold, italic, lists, etc.)
- Content is automatically saved with each topic
- Switch between topics to instantly see their associated content
- Import and export Word documents (.docx)
- Format your text with headings, lists, and other styles

### AI Integration

Get help with your writing and thinking:

- Chat with Deepseek AI directly within the application
- Ask questions about your content
- Generate new content based on your topics with the "Agent" feature
- Use "Deep Think" mode for more comprehensive AI assistance
- Copy AI responses directly to your document

### Web Browser

Research without leaving the app:

- Built-in web browser with tabbed navigation
- Pre-configured tabs for AI tools (Kimi, Qwenlm, Deepseek)
- Add unlimited new tabs for research
- Full navigation controls (back, forward, reload)
- Copy and paste content directly from web pages to your document

### Multilingual Support

Work in your preferred language:

- Toggle between English and Chinese interfaces
- All buttons, menus, and instructions are translated
- Switch languages instantly without losing your work
- Complete translations for all UI elements

### File Management

Keep your work organized and accessible:

- Save outlines as JSON files for future editing
- Create folder structures to organize your projects
- Multiple saving options (save, save as, backup)
- Open previously saved files
- Automatic backup options

### DOCX Support

Work with Microsoft Word documents:

- Import .docx files directly into the editor
- Export your work as .docx files
- Maintain formatting when importing/exporting
- Compatible with most word processors

## External Dependencies

- Quill - Rich text editor
- Font Awesome - Icons
- Mammoth - DOCX conversion
- Docxtemplater - Document templating
- JSZip - File compression
- FileSaver - Save files locally

## API Integration

The application connects to the Deepseek AI API for chat functionality and automatic content generation.

---

Created with ❤️ by Quickbrain

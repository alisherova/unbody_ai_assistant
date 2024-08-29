# Study AI assistant implementation

## Overview

This README covers the implementation of document filtering functionality and the saving/loading of chat sessions using local storage in a React-based chat application.

## Implementation Steps

### 1. Document Filtering Functionality

1. **Filter Documents Based on Type**
   - Implement filtering logic within the search functionality to allow users to filter documents by type.

    ```javascript
    const filteredFiles = fileList.filter(file => selectedFileTypes.includes(file.type));
    ```

2. **Update UI Based on Filters**
   - Update the UI to display only the documents that match the selected filters.


### 2. Local Storage Management

1. **Define Storage Key Prefix**
   - Use a constant `LOCAL_STORAGE_KEY_PREFIX` to uniquely identify each chat session.

    ```javascript
    const LOCAL_STORAGE_KEY_PREFIX = 'chatMessages_';
    ```

2. **Save Messages to Local Storage**
   - Implement a function to save chat messages to local storage using a session-specific key.

    ```javascript
    const saveMessagesToLocalStorage = (messages, selectedFileId) => {
        localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${selectedFileId}`, JSON.stringify(messages));
    };
    ```

3. **Load Messages from Local Storage**
   - Create a function to retrieve messages from local storage based on the session ID.

    ```javascript
    const loadMessagesFromLocalStorage = (selectedFileId) => {
        const storedMessages = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${selectedFileId}`);
        return storedMessages ? JSON.parse(storedMessages) : [];
    };
    ```

### 3. Managing Chat Sessions

1. **Load Chat History on Selection**
   - Load the corresponding chat history when a user selects a session from the sidebar.

    ```javascript
    const handleChatSelection = (id: string) => {
    const newId = id.slice(13, id.length)
    setSelectedFiles([newId])
    const savedMessages = loadMessagesFromLocalStorage(id);
    setMessages(savedMessages);
  };
    ```

2. **Update and Persist Chats**
   - Update the chat history after each interaction and save the updated messages to local storage.

    ```javascript
    const onPrompt = async (prompt) => {
        setMessages(prevMessages => {
            const updatedMessages = [...prevMessages, { role: 'user', message: prompt }];
            saveMessagesToLocalStorage(updatedMessages, selectedFiles[0]);
            return updatedMessages;
        }); 
    };
    ```

3. **Integrate Sidebar with Sessions**
   - Populate the sidebar with the saved session titles and enable session switching.

    ```javascript
    <Sidebar
        chats={savedSessions}
        onSessionSelect={handleChatSelection}
    />
    ```

## Usage

1. **Filtering Documents**
   - Use the filtering options in the UI to display documents based on their type (PDF, audio, video, etc.).

2. **Saving and Loading Chats**
   - Chats are automatically saved to local storage after each user interaction, and can be reloaded by selecting the session from the sidebar.

3. **Running the Application**
   - Start the development server and access the application in your browser to utilize the document filtering and local storage features.

## Conclusion

This guide provides the steps to implement document filtering and chat session management using local storage in a React-based chat application, ensuring a smooth user experience with persistent data and refined search capabilities.

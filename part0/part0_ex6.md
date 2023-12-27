```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: The browser executes the Javascript code to add the new note to the notes array and rerenders the note list on the page

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    Note right of server: The server executes the Javascript code to add the new note to the notes array
    server-->>browser: {"message":"note created"}
    deactivate server
```

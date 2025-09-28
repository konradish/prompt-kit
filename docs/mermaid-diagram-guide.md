# Mermaid Diagram Guide

A reference for crafting complex Mermaid diagrams with ready-to-paste examples and failure modes for LLMs and humans.

This document serves as a comprehensive reference guide and a collection of advanced examples for generating diagrams using Mermaid syntax. It is designed to be a foundational resource for Large Language Models (LLMs) to learn the patterns, complexities, and nuances of each diagram type. It also includes a critical section on common syntax errors and how to avoid them.

### Part 1: Critical Syntax Rules and Error Avoidance

Before exploring the examples, it is crucial to understand the most common source of errors when writing Mermaid code: syntax violations. A Mermaid parser is strict and expects only valid diagram syntax within its designated code block.

#### How to Avoid Syntax Errors

**1. Isolate the Code Block: The "Sacred Space" Rule**
All explanations, titles, and commentary must live outside the fenced ```mermaid ...``` block. These fences define the boundaries of the code that will be parsed.

**2. Use Mermaid's Official Comment Syntax (`%%`)**
If you need to leave notes *inside* the code for clarity or debugging, use the `%%` syntax. The parser will ignore any text on a line following a double percentage sign. This is the only safe way to add comments inside the code block.

- **Correct Usage of Comments:**
    ```mermaid
    sequenceDiagram
        %% This is a valid comment and will be ignored.
        autonumber
        Client->>Server: Request data
    ```

**3. Case Study: The Unterminated Code Block Error**
A frequent and critical error is forgetting the closing triple-backtick fence. If the block is not closed, the parser will continue to read the rest of the document, trying to interpret Markdown headings or even other code blocks as part of the initial diagram. This leads to confusing error messages about "unexpected characters" or "expecting X, got Y," as the parser finds text that doesn't match the diagram's grammar. **Always ensure every ```mermaid``` opener has a matching closing triple-backtick.**

**4. Build and Validate Incrementally**
When creating a complex diagram, write and validate it in small parts. Use a live tool, such as the **[Mermaid Live Editor](https://mermaid.live)**, to paste your code as you write it. This allows you to catch errors immediately.

---

### Part 2: Advanced Diagram Examples

This section contains a library of corrected and validated examples for various Mermaid diagram types.

#### 1. Flowchart
Represents workflows with subgraphs, varied node shapes, styling, and interactive links.

```mermaid
graph TD
    subgraph "Data Ingestion"
        A[Start] --> B(Read Data from API);
        B --> C{Data Valid?};
        C -- Yes --> D[Process Data];
        C -- No --> E[Log Error];
    end

    subgraph "Data Processing & Storage"
        D --> F[[Store in Staging]];
        F --> G((Analyze Data));
        G --> H{Needs Enrichment?};
        H -- Yes --> I(Fetch External Data);
        I --> J(Merge Data);
        H -- No --> J;
        J --> K[(Save to Database)];
    end

    subgraph "Reporting & Visualization"
        K --> L((Generate Reports));
        L --> M[/Display on Dashboard/];
        M --> N((End));
    end

    %% Styling and Interaction
    classDef error fill:#f9f,stroke:#333,stroke-width:4px;
    class E error;
    click A "https://mermaid.js.org/" "Go to Mermaid Docs" _blank;
    click K "callbackFunction" "Click to run callback";
```

#### 2. Sequence Diagram
Illustrates object interactions over time with aliases, activation, parallel actions, loops, and conditional alternatives.

```mermaid
sequenceDiagram
    autonumber
    participant Client as C
    participant WebServer as WS
    participant AuthAPI as AUTH
    participant Database as DB

    activate C
    C->>WS: Request sensitive data
    activate WS

    WS->>AUTH: Validate session token
    activate AUTH
    AUTH-->>WS: Token is valid
    deactivate AUTH

    par "Parallel Database Queries"
        WS->>DB: Get user profile
        activate DB
        DB-->>WS: User Profile Data
        deactivate DB
    and
        WS->>DB: Get user permissions
        activate DB
        DB-->>WS: User Permissions
        deactivate DB
    end

    WS-->>C: Here is partial data

    loop "Data Processing"
        WS->>WS: Process data chunks
    end

    alt "Sufficient Permissions"
        WS->>C: Send sensitive data
    else "Insufficient Permissions"
        WS->>C: 403 Forbidden
    end

    deactivate WS
    deactivate C

    Note over C,DB: This entire process should complete in < 500ms.
```

#### 3. Gantt Chart
Used for project scheduling, showcasing sections, milestones, critical paths, and date exclusions.

```mermaid
gantt
    title Project Alpha Timeline
    dateFormat  YYYY-MM-DD
    excludes    weekends, 2024-11-28
    axisFormat  %Y-%m-%d

    section Research & Planning
    Market Research          :crit, done, task1, 2024-10-01, 7d
    Create Project Plan      :crit, active, task2, after task1, 5d
    Initial Design Mockups   :         task3, after task1, 5d
    Project Kick-off         :milestone, m1, 2024-10-15, 1d

    section Development Sprint 1
    Setup Environment        :crit, done, dev1, after m1, 3d
    Backend API              :crit, active, dev2, after dev1, 10d
    Frontend UI              :         dev3, after dev1, 10d
    Unit Testing             :         dev4, after dev2, 5d

    section Review & Deployment
    Internal QA              :crit, done, qa1, after dev4, 4d
    UAT                      :crit, active, qa2, after qa1, 5d
    Final Deployment         :milestone, m2, 2024-11-27, 1d
```

#### 4. Class Diagram
Models the static structure of a system, featuring interfaces, inheritance, composition, aggregation, and cardinality.

```mermaid
classDiagram
    direction RL
    class Shape {
        <<Interface>>
        +int id
        +calculateArea(): double
        +calculatePerimeter(): double
    }

    class Rectangle {
        -double width
        -double height
        +calculateArea(): double
        +calculatePerimeter(): double
    }

    class Circle {
        -double radius
        +calculateArea(): double
        +calculatePerimeter(): double
    }

    class Drawing {
        -Shape[] shapes
        +addShape(Shape)
        +removeShape(Shape)
    }

    class Canvas {
        +render(Drawing)
    }

    Shape <|.. Rectangle
    Shape <|.. Circle

    Drawing "1" *-- "0..*" Shape : contains
    Canvas "1" o-- "1" Drawing : displays

    note for Shape "All shapes must implement these methods."
```

#### 5. State Diagram
Describes the behavior of state machines, including nested states, forks for parallel states, and joins.

```mermaid
stateDiagram-v2
    direction LR
    [*] --> Off

    state Off {
        [*] --> Idle
        Idle --> Active : power_on
    }

    state Active {
        direction TD
        [*] --> Standby
        Standby --> Processing : data_received

        state Processing {
            [*] --> Reading
            Reading --> Parsing : read_complete
            Parsing --> Validating : parse_complete
            Validating --> [*] : validation_ok
        }

        Processing --> Error : error_occurred
        Error --> Standby : clear_error

        state Fork_State <<fork>>
        Processing --> Fork_State
        Fork_State --> Logging
        Fork_State --> Notifying

        state Logging {
            [*] --> LogToFile
            LogToFile --> [*] : done
        }

        state Notifying {
            [*] --> SendEmail
            SendEmail --> [*] : done
        }
    }

    Active --> Off : power_off
```

#### 6. Pie Chart
Shows proportions of a whole, including a title for context.

```mermaid
pie
    title "Market Share Distribution Q3 2025"
    "Competitor A" : 45.9
    "Our Company" : 25.1
    "Competitor B" : 15.5
    "Other" : 13.5
```

#### 7. Git Graph
Visualizes complex repository histories, including branches, merges, tags, and cherry-picks.

```mermaid
gitGraph
    commit id: "Initial commit"
    branch feature-A
    commit id: "A-1"
    commit id: "A-2"
    checkout main
    commit id: "Main-1"
    merge feature-A tag: "v1.0.0"
    branch hotfix
    checkout hotfix
    commit id: "Fix critical bug"
    checkout main
    cherry-pick id: "Fix critical bug"
    checkout feature-A
    commit id: "A-3"
    checkout main
    commit id: "Main-2"
    merge hotfix tag: "v1.0.1"
```

#### 8. User Journey Diagram
Maps user experiences across stages, involving multiple stakeholders and emotional ratings.

```mermaid
journey
    title "Online Purchase Journey for a New Customer"
    section Discovery
      Social Media Ad: 5: Customer
      Clicks Ad: 4: Customer, Marketing Team
    section Consideration
      Browses Products: 5: Customer
      Reads Reviews: 4: Customer, Sales Team
      Compares Prices: 3: Customer
    section Purchase
      Adds to Cart: 5: Customer
      Enters Shipping Info: 3: Customer, Fulfillment Team
      Payment Fails: 2: Customer, Engineering Team
      Retries Payment: 4: Customer
      Order Confirmed: 5: Customer, Sales Team
```

#### 9. Entity Relationship Diagram (ERD)
Models database schemas with entities, attributes (PK, FK), cardinality, and a linking table for a many-to-many relationship.

```mermaid
erDiagram
    CUSTOMER ||--|{ ORDER : "places"
    ORDER ||--|{ ORDER_ITEM : "contains"
    PRODUCT ||--|| ORDER_ITEM : "ordered in"

    CUSTOMER {
        int customer_id PK
        string name
        string email
        string address
    }
    ORDER {
        int order_id PK
        int customer_id FK
        datetime order_date
        string status
    }
    PRODUCT {
        int product_id PK
        string name
        string description
        float price
    }
    ORDER_ITEM {
        int order_id PK, FK
        int product_id PK, FK
        int quantity
        float unit_price
    }
```

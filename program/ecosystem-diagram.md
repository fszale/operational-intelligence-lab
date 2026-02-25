# Ecosystem Diagram

## The Operational Intelligence Ecosystem

```mermaid
graph TD
    subgraph Methodology ["🧠 Methodology Layer"]
        A["Filip Szalewicz<br/>Architect & Methodology Owner"]
        M["OI Framework<br/>Rate of Improvement<br/>ROI Modeling"]
    end

    subgraph Execution ["⚡ Execution Layer"]
        F1["Fellow 1"]
        F2["Fellow 2"]
    end

    subgraph Impact ["🏢 Impact Layer"]
        B1["Business 1"]
        B2["Business 2"]
        B3["Business 3"]
        B4["Business 4"]
    end

    subgraph Ecosystem ["🌐 Ecosystem Layer"]
        V["Velocity<br/>Regional Accelerator"]
        CS["Case Studies<br/>& ROI Data"]
        FC["Future Cohorts"]
    end

    A -->|"Trains"| F1
    A -->|"Trains"| F2
    A -->|"Creates"| M
    M -->|"Guides"| F1
    M -->|"Guides"| F2
    F1 -->|"Implements"| B1
    F1 -->|"Implements"| B2
    F2 -->|"Implements"| B3
    F2 -->|"Implements"| B4
    B1 -->|"Produces"| CS
    B2 -->|"Produces"| CS
    B3 -->|"Produces"| CS
    B4 -->|"Produces"| CS
    CS -->|"Enables"| FC
    FC -->|"Expands"| Impact
    V -->|"Hosts & Funds"| A
    V -->|"Amplifies"| CS

    style A fill:#1a1a2e,stroke:#e94560,color:#fff
    style M fill:#16213e,stroke:#0f3460,color:#fff
    style F1 fill:#0f3460,stroke:#e94560,color:#fff
    style F2 fill:#0f3460,stroke:#e94560,color:#fff
    style B1 fill:#533483,stroke:#e94560,color:#fff
    style B2 fill:#533483,stroke:#e94560,color:#fff
    style B3 fill:#533483,stroke:#e94560,color:#fff
    style B4 fill:#533483,stroke:#e94560,color:#fff
    style V fill:#2d6a4f,stroke:#40916c,color:#fff
    style CS fill:#e94560,stroke:#1a1a2e,color:#fff
    style FC fill:#264653,stroke:#2a9d8f,color:#fff
```

## Flow Model

```mermaid
graph LR
    A["💰 Businesses Pay"] --> B["👷 Fellows Implement"]
    B --> C["🧠 Filip Oversees"]
    C --> D["🚀 Velocity Amplifies"]
    D --> E["📊 Case Studies Produced"]
    E --> F["🔄 Future Cohorts Recruited"]
    F --> A

    style A fill:#533483,stroke:#e94560,color:#fff
    style B fill:#0f3460,stroke:#e94560,color:#fff
    style C fill:#1a1a2e,stroke:#e94560,color:#fff
    style D fill:#2d6a4f,stroke:#40916c,color:#fff
    style E fill:#e94560,stroke:#1a1a2e,color:#fff
    style F fill:#264653,stroke:#2a9d8f,color:#fff
```

## Value Flows

### For Businesses
`Investment ($10K) → AI Workflows → Measurable ROI → Competitive Advantage`

### For Fellows
`Training + Mentorship → Real Deployment Experience → Career Capability → Independent Practice`

### For Velocity
`Modest Investment → Regional AI Capability → Public Case Studies → Reputation as AI Enablement Hub`

### For the Region
`Proven Model → Replication → Broader Adoption → Economic Competitiveness`

## The Flywheel

```mermaid
graph TD
    A["Deploy AI in Businesses"] --> B["Measure Results"]
    B --> C["Publish Case Studies"]
    C --> D["Attract More Businesses"]
    D --> E["Train More Fellows"]
    E --> A
    
    F["Regional AI<br/>Capability Grows"] 
    A --> F
    B --> F
    C --> F
    D --> F
    E --> F

    style A fill:#0f3460,stroke:#e94560,color:#fff
    style B fill:#533483,stroke:#e94560,color:#fff
    style C fill:#e94560,stroke:#1a1a2e,color:#fff
    style D fill:#2d6a4f,stroke:#40916c,color:#fff
    style E fill:#1a1a2e,stroke:#e94560,color:#fff
    style F fill:#264653,stroke:#2a9d8f,color:#fff,stroke-width:3px
```

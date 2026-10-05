# SENTRA - Climate-Health Early Warning & Resource Allocation System

A React web application for a decision-support platform that predicts climate-related health and disaster risks, identifies affected areas and populations, and automatically simulates emergency resource allocation.

## Features

### Dashboard Components

- **Sidebar Navigation**: Quick access to Map, Profile, Security, Analytics, Reports, Settings, and About sections
- **Demo Controls**: Simulation controls for disaster scenarios, incident management, and view reset
- **Interactive Map**: Heat risk visualization with color-coded risk levels (Low to Critical)
- **Portfolio Section**: Risk metrics and asset cards with value-at-risk calculations
- **Incident Queue**: Filterable list of emergency incidents with status indicators
- **Incident Details**: Detailed view with tabs for Triage, Operator, Details, and Live Voice

### Risk Levels

- 🟢 **Low** (0-20%)
- 🟡 **Moderate** (21-40%)
- 🟠 **Elevated** (41-60%)
- 🔴 **High** (61-80%)
- 🔴 **Critical** (81-100%)

### Key Concepts

The system implements a closed-loop emergency decision intelligence:
1. **Data & Geo Intelligence** - Geographic and environmental data
2. **Risk Prediction Engine** - AI-powered hazard forecasting
3. **Vulnerability Engine** - Community vulnerability assessment
4. **Resource Optimizer** - Dynamic allocation of limited resources
5. **Emergency Simulator** - What-if scenario modeling
6. **Command Dashboard** - Real-time monitoring and control

## Installation

```bash
npm install
```

## Running the App

```bash
# Start the development server
npm start

# Build for production
npm run build
```

The application will open in your browser at `http://localhost:3000`

## Project Structure

```
SENTRA/
├── public/
│   └── index.html                 # HTML template
├── src/
│   ├── index.js                   # React entry point
│   ├── index.css                  # Global styles
│   ├── App.js                     # Main App component
│   ├── screens/
│   │   ├── DashboardScreen.js     # Main dashboard layout
│   │   └── DashboardScreen.css    # Dashboard styles
│   └── components/
│       ├── Sidebar.js             # Navigation sidebar
│       ├── Sidebar.css            # Sidebar styles
│       ├── DemoControls.js        # Simulation controls
│       ├── DemoControls.css       # Controls styles
│       ├── MapView.js             # Interactive risk map
│       ├── MapView.css            # Map styles
│       ├── PortfolioSection.js    # Risk metrics and assets
│       ├── PortfolioSection.css   # Portfolio styles
│       ├── IncidentQueue.js       # Incident list with filters
│       ├── IncidentQueue.css      # Queue styles
│       ├── IncidentDetails.js     # Incident detail panel
│       └── IncidentDetails.css    # Details styles
├── package.json
└── README.md
```

## Dependencies

- React 18.2.0
- React DOM 18.2.0
- React Scripts 5.0.1

## Database Setup

SENTRA uses PostgreSQL with PostGIS for relational and geographic data. The
canonical database blueprint is [database/schema.sql](database/schema.sql);
pgAdmin or another database GUI is optional and is not the source of truth.

To initialize a fresh `sentra_db` database, apply the shared schema with
`psql` from the repository root:

```powershell
Get-Content .\database\schema.sql | docker exec -i sentra-postgres psql -U sentra_user -d sentra_db
```

Reusable read-only inspection queries are stored in
[database/queries.sql](database/queries.sql). Run them with:

```powershell
Get-Content .\database\queries.sql | docker exec -i sentra-postgres psql -U sentra_user -d sentra_db
```

Every teammate should use and commit the same `database/schema.sql` file so
that database structures remain consistent. Never commit passwords or other
secrets, and never run destructive database commands against a shared
database.

## Target Users

- 🏛️ Disaster Management Authorities
- 🏥 Public Health Departments
- 🏙️ Municipal Corporations
- 🚨 Emergency Operations Centers

## License

Proprietary - SENTRA

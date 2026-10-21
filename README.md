# SENTRA — Disaster Response & Resource Optimization Platform

SENTRA is an enterprise-grade AI/ML disaster risk assessment, resource allocation optimization, and emergency alerting system.

---

## Repository Structure

```
SENTRA/
├── BACKEND/                    # Complete FastAPI Backend Service
│   ├── app/                    # Application source code
│   │   ├── api/                # API routers and dependencies
│   │   ├── core/               # Security, auth, config, exceptions, middleware
│   │   ├── db/                 # Database session and base models
│   │   ├── models/             # SQLAlchemy ORM models
│   │   ├── optimization/       # Resource allocation solvers
│   │   ├── prediction/         # Hazard risk models
│   │   ├── schemas/            # Pydantic v2 schemas
│   │   └── services/           # Business logic layer
│   ├── migrations/             # Alembic database migrations
│   ├── scripts/                # Utility scripts (create_admin.py, seed_reference_data.py)
│   ├── tests/                  # Pytest test suite (34 passed tests)
│   ├── seed.sql                # Complete schema & seed data SQL script
│   ├── pyproject.toml          # Project configuration & dependencies
│   └── README.md               # Detailed Backend documentation
└── README.md                   # Project overview (this file)
```

---

## Quick Start (Backend)

### 1. Navigate to the backend directory
```bash
cd BACKEND
```

### 2. Activate the virtual environment
**PowerShell:**
```powershell
.\.venv\Scripts\Activate.ps1
```
**Command Prompt:**
```cmd
.\.venv\Scripts\activate.bat
```

### 3. Setup the database
1. Open **pgAdmin 4** or psql.
2. Ensure database `sentra_db` is created with user `sentra_user`.
3. Run the SQL script [`BACKEND/seed.sql`](file:///c:/Projects/SENTRA/BACKEND/seed.sql) to create all tables and initial reference data.

### 4. Create or Verify Administrator Account
```powershell
python scripts/create_admin.py --email admin@sentra.gov.in --password AdminSecurePassword123! --name "System Administrator"
```

### 5. Start the API Server
```powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### 6. Interactive API Documentation
- **Swagger UI:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
- **Health Check:** [http://127.0.0.1:8000/health/ready](http://127.0.0.1:8000/health/ready)

### 7. Run Automated Tests
```powershell
python -m pytest tests/ -v
```

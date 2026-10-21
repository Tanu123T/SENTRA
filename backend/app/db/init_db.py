"""Database initialization and standard reference data seeding."""

from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.logging import logger
from app.core.permissions import RoleName
from app.core.security import get_password_hash
from app.models.role import Role
from app.models.user import User

ROLE_DESCRIPTIONS = {
    RoleName.ADMINISTRATOR: "Full administrative access to manage users, configuration, and audit logs.",
    RoleName.DISASTER_MANAGER: "Authorized to request risk assessments, run simulations, and trigger optimization.",
    RoleName.HEALTHCARE_COORDINATOR: "Manages healthcare capacity, hospital beds, medical teams, and health impacts.",
    RoleName.FIELD_RESPONDER: "Field level responders receiving and updating emergency alerts and allocations.",
    RoleName.ANALYST: "Submits environmental observations, reviews model performance, and generates reports.",
}


def init_db(db: Session) -> None:
    """Seed initial system roles and bootstrap superuser if missing."""
    # 1. Seed Roles
    for role_name in RoleName:
        existing_role = db.query(Role).filter(Role.name == role_name.value).first()
        if not existing_role:
            role = Role(name=role_name.value, description=ROLE_DESCRIPTIONS.get(role_name, ""))
            db.add(role)
            logger.info("Initialized system role: %s", role_name.value)
    db.commit()

    # 2. Seed Superuser if not present
    if settings.FIRST_SUPERUSER_EMAIL:
        admin_user = db.query(User).filter(User.email == settings.FIRST_SUPERUSER_EMAIL).first()
        if not admin_user:
            admin_role = db.query(Role).filter(Role.name == RoleName.ADMINISTRATOR.value).first()
            new_admin = User(
                email=settings.FIRST_SUPERUSER_EMAIL,
                hashed_password=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
                full_name=settings.FIRST_SUPERUSER_NAME,
                is_active=True,
                roles=[admin_role] if admin_role else [],
            )
            db.add(new_admin)
            db.commit()
            logger.info("Bootstrap superuser created: %s", settings.FIRST_SUPERUSER_EMAIL)

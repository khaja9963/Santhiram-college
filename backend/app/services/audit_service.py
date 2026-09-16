import logging
from typing import Optional
from sqlalchemy.orm import Session
from app.models.all_models import AuditLog

logger = logging.getLogger("srec.audit")

def log_audit(
    db: Session,
    action: str,
    user_id: Optional[str] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
    details: Optional[str] = None,
) -> Optional[AuditLog]:
    """
    Safely records an audit log entry in the database.
    """
    try:
        log_entry = AuditLog(
            user_id=user_id,
            action=action,
            ip_address=ip_address,
            user_agent=user_agent,
            details=details,
        )
        db.add(log_entry)
        db.commit()
        db.refresh(log_entry)
        logger.info(f"[AUDIT] Action: {action} | User: {user_id or 'Anonymous'} | IP: {ip_address}")
        return log_entry
    except Exception as e:
        logger.error(f"Failed to record audit log: {e}")
        try:
            db.rollback()
        except Exception:
            pass
        return None

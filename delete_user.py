import sys
sys.path.insert(0, 'backend')

from app.database import SessionLocal
from app.models.user import User

email = 'unt_test@mandexis.de'
db = SessionLocal()

user = db.query(User).filter(User.email == email).first()
if user:
    db.delete(user)
    db.commit()
    print(f"✓ User '{email}' (ID {user.id}) gelöscht")
else:
    print(f"✗ User '{email}' nicht gefunden")

db.close()

import sys
sys.path.insert(0, 'backend')

from app.database import SessionLocal
from app.models.user import User
from app.security import hash_password

EMAIL = 'julian@mandexis.de'
NAME = 'Julian'
PASSWORD = sys.argv[1] if len(sys.argv) > 1 else 'ChangeMe123!'

db = SessionLocal()
user = db.query(User).filter(User.email == EMAIL).first()

if user:
    user.role = 'admin'
    user.is_verified = True
    user.verification_token = None
    if len(sys.argv) > 1:
        user.hashed_password = hash_password(PASSWORD)
    db.commit()
    print(f"✓ User '{EMAIL}' (ID {user.id}) reaktiviert: role=admin, is_verified=True"
          + (" + Passwort gesetzt" if len(sys.argv) > 1 else ""))
else:
    user = User(
        name=NAME,
        email=EMAIL,
        hashed_password=hash_password(PASSWORD),
        role='admin',
        is_verified=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    print(f"✓ User '{EMAIL}' (ID {user.id}) neu angelegt: role=admin, is_verified=True, Passwort='{PASSWORD}'")

db.close()

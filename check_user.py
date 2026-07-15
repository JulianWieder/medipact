import sys
sys.path.insert(0, 'backend')

from app.database import SessionLocal
from app.models.user import User

email = 'unt_test@mandexis.de'
db = SessionLocal()

user = db.query(User).filter(User.email == email).first()
if user:
    print(f"User existiert: ID={user.id}, Email={email}, Name={user.name}")
else:
    print(f"User nicht gefunden")

db.close()

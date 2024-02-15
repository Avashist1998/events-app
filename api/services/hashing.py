"""Hashing functions"""
import bcrypt

def get_password_hash(password: str) -> str:
    """Hash password"""
    hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    return hashed_password


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password"""
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())

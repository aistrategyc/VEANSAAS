from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=['argon2', 'bcrypt'],
    deprecated='auto',
    argon2__time_cost=3,
    argon2__memory_cost=65536,
    argon2__parallelism=4,
)

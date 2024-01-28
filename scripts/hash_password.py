import hashlib
import sys
import base64

def hash_password(password, salt_b64, hash_method='sha512', hash_iterations=100000, dklen=None):
    salt = base64.b64decode(salt_b64)
    dk = hashlib.pbkdf2_hmac(hash_method, password.encode(), salt, hash_iterations, dklen)
    return base64.b64encode(dk).decode()

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python hash_password.py [password] [salt] [iterations=100000] [dklen=None]")
        sys.exit(1)

    password = sys.argv[1]
    salt = sys.argv[2]
    iterations = int(sys.argv[3]) if len(sys.argv) >= 4 else 100000
    dklen = int(sys.argv[4]) if len(sys.argv) >= 5 else None

    hashed_password = hash_password(password, salt, 'sha512', iterations, dklen)
    print(hashed_password)

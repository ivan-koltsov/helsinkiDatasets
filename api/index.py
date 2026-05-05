import sys
import os

# Add the project root and backend directory to sys.path
# This ensures that 'backend.app' can be imported and that
# 'from models import ...' inside app.py works correctly.
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(root_dir)
sys.path.append(os.path.join(root_dir, 'backend'))

from backend.app import app

# Vercel needs the 'app' object to be available at the module level
if __name__ == "__main__":
    app.run()

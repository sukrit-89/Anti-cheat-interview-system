# Database Cleanup Scripts

These scripts help you reset your database for fresh testing.

## Scripts Available

### 1. `cleanup_database.py` - Database Only Cleanup

Removes all application data but keeps Supabase auth users.

**Deletes:**
- All interview sessions
- All candidates
- All evaluations and metrics
- All coding events
- All evaluation reports

**Keeps:**
- Supabase auth users (can still login)

**Usage:**
```bash
# Interactive mode (asks for confirmation)
python cleanup_database.py

# Auto-confirm mode (skip prompt)
python cleanup_database.py --confirm
```

### 2. `reset_all.py` - Complete System Reset

Removes ALL data including database records. Provides instructions for deleting Supabase auth users.

**Usage:**
```bash
# Interactive mode
python reset_all.py

# Auto-confirm mode
python reset_all.py --confirm
```

## When to Use What

| Scenario | Script | Why |
|----------|--------|-----|
| Clean test data but keep users | `cleanup_database.py` | Users can continue testing without re-registering |
| Fresh start with new users | `reset_all.py` | Completely clean slate |
| Remove failed test sessions | `cleanup_database.py` | Quick cleanup between tests |

## Important Notes

⚠️ **These operations cannot be undone!**

- Always backup important data before running cleanup scripts
- Supabase auth users must be deleted manually from Supabase Dashboard
- Run these scripts from the project root directory
- Ensure your virtual environment is activated

## After Cleanup

1. **Database Only Cleanup:**
   - Existing users can login immediately
   - Create new sessions and test

2. **Complete Reset:**
   - Delete users from Supabase Dashboard (Authentication > Users)
   - Register new test accounts
   - Create new sessions

## Example Workflow

```bash
# Activate virtual environment
source venv/bin/activate  # or on Windows: venv\Scripts\activate

# Clean database
python cleanup_database.py

# Start backend
python -m uvicorn app.main:app --reload

# Start frontend (in another terminal)
cd frontend
npm run dev
```

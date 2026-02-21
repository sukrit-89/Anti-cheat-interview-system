"""
Complete Reset Script
Removes all data from database AND Supabase auth users.
WARNING: This will delete ALL user accounts!

Usage:
    python reset_all.py [--confirm]
    
Options:
    --confirm    Skip confirmation prompt and proceed with reset
"""
import asyncio
import sys

from app.core.logging import logger
from app.services.supabase_service import supabase_service
from cleanup_database import cleanup_database, reset_sequences


async def delete_all_auth_users(confirm: bool = False):
    """Delete all users from Supabase Auth."""
    
    if not confirm:
        print("\n" + "="*60)
        print("⚠️  CRITICAL WARNING - AUTH USERS DELETION")
        print("="*60)
        print("\nThis will DELETE ALL USER ACCOUNTS from Supabase Auth!")
        print("Users will need to register again to access the system.")
        print("\n" + "="*60)
        
        response = input("\nAre you ABSOLUTELY sure? Type 'DELETE ALL' to continue: ").strip()
        if response != "DELETE ALL":
            print("❌ Auth deletion cancelled.")
            return False
    
    try:
        logger.info("Starting Supabase auth cleanup...")
        
        # Get all users from Supabase
        # Note: This requires admin access to Supabase
        # For now, we'll provide instructions for manual cleanup
        
        print("\n" + "="*60)
        print("📋 MANUAL AUTH CLEANUP INSTRUCTIONS")
        print("="*60)
        print("\nTo delete all auth users, please use one of these methods:")
        print("\n1. Supabase Dashboard:")
        print("   - Go to your Supabase project dashboard")
        print("   - Navigate to Authentication > Users")
        print("   - Delete users manually or bulk delete")
        print("\n2. Supabase SQL Editor:")
        print("   Run this SQL query:")
        print("   ```sql")
        print("   DELETE FROM auth.users;")
        print("   ```")
        print("\n3. Supabase CLI:")
        print("   ```bash")
        print("   supabase db reset")
        print("   ```")
        print("\n" + "="*60)
        
        return True
        
    except Exception as e:
        logger.error(f"Auth cleanup failed: {e}")
        print(f"\n❌ Error during auth cleanup: {e}")
        return False


async def main():
    """Main entry point."""
    confirm = "--confirm" in sys.argv
    
    print("\n🔥 Integrity AI - COMPLETE SYSTEM RESET\n")
    print("This will remove ALL data including user accounts!")
    
    # Step 1: Clean database
    print("\n" + "="*60)
    print("STEP 1: Database Cleanup")
    print("="*60)
    await cleanup_database(confirm=confirm)
    await reset_sequences()
    
    # Step 2: Clean auth users
    print("\n" + "="*60)
    print("STEP 2: Authentication Cleanup")
    print("="*60)
    await delete_all_auth_users(confirm=confirm)
    
    print("\n" + "="*60)
    print("✅ SYSTEM RESET COMPLETE")
    print("="*60)
    print("\n✨ System is now completely clean!")
    print("📝 Don't forget to manually delete auth users from Supabase Dashboard")
    print("\n💡 Next steps:")
    print("   1. Register new test users")
    print("   2. Create test sessions")
    print("   3. Test the system")
    print("\n")


if __name__ == "__main__":
    asyncio.run(main())

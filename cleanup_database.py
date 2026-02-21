"""
Database Cleanup Script
Removes all sessions, candidates, evaluations, and related data from the database.
Use this to reset the database for fresh testing.

Usage:
    python cleanup_database.py [--confirm]
    
Options:
    --confirm    Skip confirmation prompt and proceed with cleanup
"""
import asyncio
import sys
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import AsyncSessionLocal, engine
from app.core.logging import logger


async def cleanup_database(confirm: bool = False):
    """Clean up all data from the database."""
    
    if not confirm:
        print("\n" + "="*60)
        print("⚠️  DATABASE CLEANUP WARNING")
        print("="*60)
        print("\nThis will DELETE ALL data from the database:")
        print("  - All interview sessions")
        print("  - All candidates")
        print("  - All evaluations and metrics")
        print("  - All coding events")
        print("  - All evaluation reports")
        print("\nSupabase auth users will NOT be deleted.")
        print("\n" + "="*60)
        
        response = input("\nAre you sure you want to continue? (yes/no): ").strip().lower()
        if response not in ['yes', 'y']:
            print("❌ Cleanup cancelled.")
            return
    
    try:
        async with AsyncSessionLocal() as db:
            logger.info("Starting database cleanup...")
            
            # Delete in order respecting foreign key constraints
            tables = [
                "coding_events",
                "evaluations", 
                "evaluation_reports",
                "candidates",
                "sessions",
                # Note: We don't delete users table as auth is managed by Supabase
            ]
            
            deleted_counts = {}
            
            for table in tables:
                try:
                    # Get count before deletion
                    result = await db.execute(text(f"SELECT COUNT(*) FROM {table}"))
                    count = result.scalar()
                    
                    # Delete all records
                    await db.execute(text(f"DELETE FROM {table}"))
                    
                    deleted_counts[table] = count
                    logger.info(f"Deleted {count} records from {table}")
                    
                except Exception as e:
                    logger.warning(f"Could not delete from {table}: {e}")
                    deleted_counts[table] = 0
            
            # Commit all deletions
            await db.commit()
            
            print("\n" + "="*60)
            print("✅ DATABASE CLEANUP COMPLETE")
            print("="*60)
            print("\nRecords deleted:")
            for table, count in deleted_counts.items():
                print(f"  {table:25} {count:>6} records")
            print("\n" + "="*60)
            print("\n✨ Database is now clean and ready for fresh testing!")
            
    except Exception as e:
        logger.error(f"Database cleanup failed: {e}")
        print(f"\n❌ Error during cleanup: {e}")
        raise


async def reset_sequences():
    """Reset auto-increment sequences for primary keys."""
    try:
        async with AsyncSessionLocal() as db:
            logger.info("Resetting ID sequences...")
            
            # Reset sequences for PostgreSQL
            sequences = [
                "sessions_id_seq",
                "candidates_id_seq",
                "evaluations_id_seq",
                "coding_events_id_seq",
                "evaluation_reports_id_seq",
            ]
            
            for seq in sequences:
                try:
                    await db.execute(text(f"ALTER SEQUENCE {seq} RESTART WITH 1"))
                    logger.info(f"Reset sequence: {seq}")
                except Exception as e:
                    logger.warning(f"Could not reset sequence {seq}: {e}")
            
            await db.commit()
            print("✅ ID sequences reset to start from 1")
            
    except Exception as e:
        logger.warning(f"Sequence reset failed (this is normal for non-PostgreSQL databases): {e}")


async def main():
    """Main entry point."""
    confirm = "--confirm" in sys.argv
    
    print("\n🧹 Neeti AI - Database Cleanup Tool\n")
    
    # Perform cleanup
    await cleanup_database(confirm=confirm)
    
    # Reset sequences
    await reset_sequences()
    
    print("\n✅ All done!")


if __name__ == "__main__":
    asyncio.run(main())

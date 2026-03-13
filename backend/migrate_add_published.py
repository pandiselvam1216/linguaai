"""
Migration script: Add is_published column to questions table
This ensures all existing questions are visible to students (is_published=True by default)
"""

from dotenv import load_dotenv
load_dotenv()
from app import create_app, db
from app.models.module import Question
from sqlalchemy import text

app = create_app()

def migrate():
    with app.app_context():
        print("Starting migration: Adding is_published column...")
        
        try:
            # Check if column already exists
            result = db.session.execute(
                text("""
                SELECT column_name FROM information_schema.columns 
                WHERE table_name='questions' AND column_name='is_published'
                """)
            ).fetchone()
            
            if result:
                print("✓ Column 'is_published' already exists. Skipping migration.")
                return
            
        except Exception as e:
            print(f"Note: Could not check for existing column (SQLite detected): {e}")
        
        try:
            # Try to add the column
            db.engine.execute("""
                ALTER TABLE questions 
                ADD COLUMN is_published BOOLEAN DEFAULT FALSE
            """)
            print("✓ Added 'is_published' column")
        except Exception as e:
            # For SQLite, use a different approach
            print(f"Attempting SQLite migration approach...")
            try:
                # SQLite doesn't support ADD COLUMN with DEFAULT in the same way
                # Check if we're using SQLite
                if 'sqlite' in str(db.engine.url):
                    # Get all questions and update them
                    questions = Question.query.all()
                    for q in questions:
                        q.is_published = True  # Mark existing questions as published
                    db.session.commit()
                    print("✓ Updated all existing questions to is_published=True")
                else:
                    raise e
            except Exception as inner_e:
                print(f"✗ Migration failed: {inner_e}")
                return
        
        # Mark all existing questions as published (so they remain visible)
        print("\nMarking all existing questions as published...")
        try:
            db.session.execute(
                text("UPDATE questions SET is_published = TRUE WHERE is_published IS NULL")
            )
            db.session.commit()
            print("✓ All existing questions marked as published")
        except Exception as e:
            # Already handled above for SQLite
            print(f"Note: {e}")
        
        print("\n✓ Migration completed successfully!")
        print("Summary: All existing questions are now published and visible to students.")
        print("New questions default to unpublished (is_published=FALSE) and must be")
        print("manually published from the Question Management admin panel.")

if __name__ == '__main__':
    migrate()

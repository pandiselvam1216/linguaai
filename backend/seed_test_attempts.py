"""
Seed test data with actual user attempts and scores
This creates users with realistic attempt and score data for testing
"""
from dotenv import load_dotenv
load_dotenv()
from app import create_app, db
from app.models.user import User, Role
from app.models.module import Module, Question
from app.models.attempt import Attempt, Score
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta
import random

app = create_app()

def seed_test_attempts():
    with app.app_context():
        print("Creating test users with attempts...")
        
        # Get or create student role
        student_role = Role.query.filter_by(name='student').first()
        if not student_role:
            student_role = Role(name='student', description='Student role')
            db.session.add(student_role)
            db.session.commit()
        
        # Create test users
        test_users = [
            {
                'email': 'nasuru@example.com',
                'password': 'test123',
                'full_name': 'nasuru'
            },
            {
                'email': 'student1@example.com',
                'password': 'test123',
                'full_name': 'John Doe'
            },
            {
                'email': 'student2@example.com',
                'password': 'test123',
                'full_name': 'Jane Smith'
            }
        ]
        
        users = []
        for user_data in test_users:
            user = User.query.filter_by(email=user_data['email']).first()
            if not user:
                user = User(
                    email=user_data['email'],
                    password_hash=generate_password_hash(user_data['password']),
                    full_name=user_data['full_name'],
                    role_id=student_role.id,
                    is_active=True,
                    is_verified=True
                )
                db.session.add(user)
                db.session.commit()
                print(f"Created user: {user_data['email']}")
            users.append(user)
        
        # Get all modules and questions
        modules = Module.query.filter_by(is_active=True).all()
        print(f"Found {len(modules)} modules")
        
        # Create attempts and scores for each user
        for user in users:
            print(f"\nCreating attempts for {user.full_name}...")
            for module in modules[:5]:  # Use first 5 modules
                # Get questions for this module
                questions = Question.query.filter_by(module_id=module.id, is_active=True).limit(3).all()
                if not questions:
                    continue
                
                # Create 2-4 attempts per module
                for q in questions:
                    attempt_count = random.randint(1, 3)
                    for i in range(attempt_count):
                        # Create attempt
                        attempt = Attempt(
                            user_id=user.id,
                            question_id=q.id,
                            is_completed=True,
                            completed_at=datetime.utcnow() - timedelta(days=random.randint(0, 30))
                        )
                        db.session.add(attempt)
                        db.session.flush()
                        
                        # Create score for this attempt
                        score_value = random.randint(60, 100)
                        score = Score(
                            attempt_id=attempt.id,
                            total_score=score_value,
                            max_score=100,
                            percentage=score_value
                        )
                        db.session.add(score)
            
            db.session.commit()
            print(f"Completed attempts for {user.full_name}")
        
        # Show statistics
        print("\n=== Statistics ===")
        for user in users:
            attempt_count = Attempt.query.filter_by(user_id=user.id, is_completed=True).count()
            avg_score = db.session.query(db.func.avg(Score.total_score)).join(Attempt).filter(
                Attempt.user_id == user.id,
                Attempt.is_completed == True
            ).scalar() or 0
            print(f"{user.full_name}: {attempt_count} attempts, {avg_score:.1f}% avg score")

if __name__ == '__main__':
    seed_test_attempts()
    print("\n✅ Test data created successfully!")

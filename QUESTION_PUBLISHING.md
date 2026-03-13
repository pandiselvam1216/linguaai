# Question Publishing System

## Overview
The NeuraLingua platform now supports separate question sets:
- **Published Questions**: Visible to students in learning modules
- **Draft Questions**: Only visible in the Admin Question Management panel

This feature enables admins to create and review questions before making them available to students.

## How It Works

### For Students
- Students only see questions marked as **published** (`is_published=True`)
- When a student accesses a module (Grammar, Listening, Reading, etc.), they automatically get only the published questions
- Draft questions are completely invisible to students

### For Admins
- The **Question Management** page shows ALL questions (both published and unpublished)
- Each question has a publish/unpublish toggle button (eye icon)
  - **Blue eye icon** = Published (visible to students)
  - **Gray eye-off icon** = Unpublished (draft, students can't see it)
- When creating a new question, it defaults to **unpublished** status
- Admins can publish/unpublish questions directly from the list or in the edit modal

## Database Changes

### New Column
- Added `is_published` BOOLEAN column to the `questions` table
- Default value: `FALSE` (new questions are unpublished)
- All existing questions were automatically set to `TRUE` (remain visible)

### Migration
Run this if you haven't already:
```bash
python migrate_add_published.py
```

This migration:
1. Adds the `is_published` column to existing questions table
2. Marks all existing questions as published (maintains current behavior)
3. Sets the default for new questions to unpublished

## API Endpoints

### Student Endpoints (Published Questions Only)
```
GET /grammar/questions      # Returns only published grammar questions
GET /listening/questions    # Returns only published listening questions
GET /reading/passages       # Returns only published reading passages
GET /writing/prompts        # Returns only published writing prompts
GET /speaking/prompts       # Returns only published speaking prompts
GET /critical_thinking/prompts # Returns only published critical thinking prompts
```

### Admin Endpoints (All Questions)
```
GET /admin/questions?module=grammar                 # Get all questions for a module
POST /admin/questions                               # Create new question
PUT /admin/questions/<id>                           # Update question
PUT /admin/questions/<id>/publish                   # Toggle publish status
DELETE /admin/questions/<id>                        # Delete question
```

## Using the Question Management Page

### Publishing a Question
1. Go to **Admin Dashboard** → **Question Management**
2. Find the question in the list
3. Click the **eye icon** in the action buttons:
   - **Gray eye-off** → Click to publish
   - **Blue eye** → Click to unpublish

### Creating a Published Question
1. Click **"Add Question"** button
2. Fill in all question details
3. Check the **"Publish to students"** checkbox before saving
4. Click **"Save Question"**

### Creating a Draft Question
1. Click **"Add Question"** button
2. Fill in all question details
3. Leave the **"Publish to students"** checkbox unchecked
4. Click **"Save Question"**
5. Later, publish it by clicking the eye icon in the list

## Example Workflow

**Scenario**: Admin wants to add a new grammar question but review it before publishing

1. Click "Add Question" in grammar section
2. Enter question content, options, correct answer, etc.
3. Leave "Publish to students" **unchecked**
4. Students won't see this question yet
5. Admin can edit, test, or review
6. When ready, click the **eye-off icon** → becomes **blue eye** (published)
7. Now students will see it when accessing the Grammar module

## Backend Implementation

### Model Changes
```python
class Question(db.Model):
    # ...existing fields...
    is_published = db.Column(db.Boolean, default=False)  # NEW
```

### Route Filtering
All student-facing routes now filter by:
```python
query = Question.query.filter_by(
    module_id=module.id,
    is_active=True,
    is_published=True  # Only published questions
)
```

## Frontend Implementation

### Features in Question Management
- **Publish Toggle Button**: Click eye icon to publish/unpublish
- **Publish Checkbox in Modal**: Check before saving to auto-publish new questions
- **Visual Indicators**: Published questions show blue eye icon
- **API Integration**: Uses new `/admin/questions` endpoints

### Module Pages
- Automatically only fetch published questions via `getModuleQuestions()`
- Students see no difference - just the questions available to them

## Troubleshooting

### Questions not appearing in modules
- Check if question is **published** (blue eye icon in admin panel)
- Verify question is **active** (not deleted)
- Ensure question is in the correct module

### Can't see publish toggle
- Make sure you're logged in as an admin
- Check that you're on the Question Management page
- Clear browser cache if having issues

### Migration didn't work
- Ensure Flask app is running and database is accessible
- Check file permissions on database file
- For SQLite: Database file should be at `backend/instance/neuralingua.db`

## Future Enhancements
- Bulk publish/unpublish operations
- Question scheduling (publish on specific dates)
- Question versioning
- Publishing queue/approval workflow

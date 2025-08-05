-- Reset all data in NEET preparation database

-- Clear all tables
TRUNCATE TABLE daily_logs RESTART IDENTITY CASCADE;
TRUNCATE TABLE streak_tracking RESTART IDENTITY CASCADE;
TRUNCATE TABLE streak_data RESTART IDENTITY CASCADE;
TRUNCATE TABLE error_logs RESTART IDENTITY CASCADE;
TRUNCATE TABLE mock_tests RESTART IDENTITY CASCADE;
TRUNCATE TABLE calendar_entries RESTART IDENTITY CASCADE;
TRUNCATE TABLE study_plans RESTART IDENTITY CASCADE;
TRUNCATE TABLE achievements RESTART IDENTITY CASCADE;
TRUNCATE TABLE notifications RESTART IDENTITY CASCADE;
TRUNCATE TABLE study_sessions RESTART IDENTITY CASCADE;
TRUNCATE TABLE ai_feedback RESTART IDENTITY CASCADE;
TRUNCATE TABLE chapter_progress RESTART IDENTITY CASCADE;
TRUNCATE TABLE tests RESTART IDENTITY CASCADE;
TRUNCATE TABLE subject_tests RESTART IDENTITY CASCADE;
TRUNCATE TABLE daily_quotes RESTART IDENTITY CASCADE;

-- Reset user data
UPDATE users SET created_at = CURRENT_TIMESTAMP WHERE id = 1;

-- Initialize default streak data
INSERT INTO streak_tracking (user_id, current_streak, longest_streak, total_fire_days) 
VALUES (1, 0, 0, 0) ON CONFLICT (user_id) DO UPDATE SET 
current_streak = 0, longest_streak = 0, total_fire_days = 0;

INSERT INTO streak_data (user_id, current_streak, longest_streak) 
VALUES (1, 0, 0) ON CONFLICT (user_id) DO UPDATE SET 
current_streak = 0, longest_streak = 0;
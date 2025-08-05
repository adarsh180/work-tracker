import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 60000,
  max: 5
});

// Daily Logs for comprehensive tracking
export async function getDailyLogs(userId: number, days: number = 30) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT * FROM daily_logs 
      WHERE user_id = $1 
      ORDER BY date DESC 
      LIMIT $2
    `, [userId, days]);
    return result.rows;
  } catch (error: any) {
    return [];
  } finally {
    client.release();
  }
}

export async function addDailyLog(data: any) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      INSERT INTO daily_logs 
      (user_id, date, phy_qs, chem_qs, bot_qs, zoo_qs, total_questions, study_hours, mood, notes, fire_day)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (user_id, date)
      DO UPDATE SET
        phy_qs = $3, chem_qs = $4, bot_qs = $5, zoo_qs = $6,
        total_questions = $7, study_hours = $8, mood = $9, notes = $10, fire_day = $11,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [
      data.userId, data.date, data.phyQs, data.chemQs, data.botQs, data.zooQs,
      data.totalQuestions, data.studyHours, data.mood, data.notes, data.fireDay
    ]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

// Streak tracking
export async function getStreakData(userId: number) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT * FROM streak_data 
      WHERE user_id = $1 
      ORDER BY id DESC 
      LIMIT 1
    `, [userId]);
    return result.rows[0] || { current_streak: 0, longest_streak: 0 };
  } catch (error: any) {
    console.warn('Database error, returning default streak:', error.message);
    return { current_streak: 0, longest_streak: 0 };
  } finally {
    client.release();
  }
}

export async function updateStreakData(userId: number, currentStreak: number, longestStreak: number) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      INSERT INTO streak_data (user_id, current_streak, longest_streak)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id)
      DO UPDATE SET
        current_streak = $2,
        longest_streak = GREATEST(streak_data.longest_streak, $3),
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [userId, currentStreak, longestStreak]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

// Error tracking
export async function getErrorLogs(userId: number) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT * FROM error_logs 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT 100
    `, [userId]);
    return result.rows;
  } catch (error: any) {
    console.warn('Database error, returning empty array:', error.message);
    return [];
  } finally {
    client.release();
  }
}

export async function addErrorLog(data: any) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      INSERT INTO error_logs 
      (user_id, subject, chapter, question_text, correct_answer, user_answer, explanation, reattempted)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      data.userId, data.subject, data.chapter, data.questionText,
      data.correctAnswer, data.userAnswer, data.explanation, data.reattempted || false
    ]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

// Mock tests
export async function getMockTests(userId: number) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT * FROM mock_tests 
      WHERE user_id = $1 
      ORDER BY date DESC
    `, [userId]);
    return result.rows;
  } catch (error: any) {
    console.warn('Database error, returning empty array:', error.message);
    return [];
  } finally {
    client.release();
  }
}

export async function addMockTest(data: any) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      INSERT INTO mock_tests 
      (user_id, test_name, physics_score, chemistry_score, botany_score, zoology_score, 
       total_score, max_score, time_taken, date, analysis)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      data.userId, data.testName, data.physicsScore, data.chemistryScore,
      data.botanyScore, data.zoologyScore, data.totalScore, data.maxScore,
      data.timeTaken, data.date, JSON.stringify(data.analysis || {})
    ]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

// Calendar entries
export async function getCalendarEntries(userId: number, startDate: string, endDate: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT * FROM calendar_entries 
      WHERE user_id = $1 AND date BETWEEN $2 AND $3
      ORDER BY date DESC
    `, [userId, startDate, endDate]);
    return result.rows;
  } catch (error: any) {
    console.warn('Database error, returning empty array:', error.message);
    return [];
  } finally {
    client.release();
  }
}

export async function addCalendarEntry(data: any) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      INSERT INTO calendar_entries 
      (user_id, date, status, mood, energy_level, focus_level, notes, goals_achieved)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (user_id, date)
      DO UPDATE SET
        status = $3, mood = $4, energy_level = $5, focus_level = $6,
        notes = $7, goals_achieved = $8, updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [
      data.userId, data.date, data.status, data.mood, data.energyLevel,
      data.focusLevel, data.notes, data.goalsAchieved
    ]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

// Study plans
export async function getStudyPlan(userId: number, date: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT * FROM study_plans 
      WHERE user_id = $1 AND date = $2
    `, [userId, date]);
    return result.rows[0];
  } catch (error: any) {
    return null;
  } finally {
    client.release();
  }
}

export async function createStudyPlan(data: any) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      INSERT INTO study_plans 
      (user_id, date, morning_focus, afternoon_focus, evening_focus, 
       target_questions, target_chapters, priority_subjects, ai_generated)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (user_id, date)
      DO UPDATE SET
        morning_focus = $3, afternoon_focus = $4, evening_focus = $5,
        target_questions = $6, target_chapters = $7, priority_subjects = $8,
        ai_generated = $9, updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [
      data.userId, data.date, data.morningFocus, data.afternoonFocus, data.eveningFocus,
      data.targetQuestions, JSON.stringify(data.targetChapters), JSON.stringify(data.prioritySubjects),
      data.aiGenerated || true
    ]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

// Achievements
export async function getAchievements(userId: number) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT * FROM achievements 
      WHERE user_id = $1 
      ORDER BY earned_at DESC
    `, [userId]);
    return result.rows;
  } catch (error: any) {
    console.warn('Database error, returning empty array:', error.message);
    return [];
  } finally {
    client.release();
  }
}

export async function addAchievement(data: any) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      INSERT INTO achievements 
      (user_id, title, description, badge_emoji, category, points, earned_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      data.userId, data.title, data.description, data.badgeEmoji,
      data.category, data.points, data.earnedAt || new Date()
    ]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

// Notifications
export async function getNotifications(userId: number, limit: number = 10) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT * FROM notifications 
      WHERE user_id = $1 AND (read_at IS NULL OR read_at > NOW() - INTERVAL '7 days')
      ORDER BY created_at DESC 
      LIMIT $2
    `, [userId, limit]);
    return result.rows;
  } catch (error: any) {
    console.warn('Database error, returning empty array:', error.message);
    return [];
  } finally {
    client.release();
  }
}

export async function addNotification(data: any) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      INSERT INTO notifications 
      (user_id, title, message, type, priority, action_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
      data.userId, data.title, data.message, data.type,
      data.priority || 'normal', data.actionUrl
    ]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function markNotificationRead(notificationId: number) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      UPDATE notifications 
      SET read_at = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *
    `, [notificationId]);
    return result.rows[0];
  } finally {
    client.release();
  }
}
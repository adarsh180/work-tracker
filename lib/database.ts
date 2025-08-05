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

export async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS study_sessions (
        id SERIAL PRIMARY KEY,
        subject VARCHAR(20) NOT NULL,
        topic VARCHAR(255) NOT NULL,
        duration INTEGER NOT NULL,
        score INTEGER,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        notes TEXT
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS ai_feedback (
        id SERIAL PRIMARY KEY,
        message TEXT NOT NULL,
        type VARCHAR(20) NOT NULL,
        subject VARCHAR(20),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS chapter_progress (
        id SERIAL PRIMARY KEY,
        subject VARCHAR(20) NOT NULL,
        chapter_name VARCHAR(255) NOT NULL,
        lecture_index INTEGER NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        dpp_completed BOOLEAN DEFAULT FALSE,
        revision_level INTEGER DEFAULT 1,
        normal_assignment_1 BOOLEAN DEFAULT FALSE,
        normal_assignment_2 BOOLEAN DEFAULT FALSE,
        kattar_assignment BOOLEAN DEFAULT FALSE,
        questions_solved INTEGER DEFAULT 0,
        custom_trackers JSONB DEFAULT '{}',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(subject, chapter_name, lecture_index)
      );
    `);
    
    // Add questions_solved column if it doesn't exist
    await client.query(`
      ALTER TABLE chapter_progress 
      ADD COLUMN IF NOT EXISTS questions_solved INTEGER DEFAULT 0;
    `);
    
    // Ensure unique constraint exists
    try {
      await client.query(`
        ALTER TABLE chapter_progress 
        ADD CONSTRAINT chapter_progress_subject_chapter_name_lecture_index_key 
        UNIQUE (subject, chapter_name, lecture_index);
      `);
    } catch (error: any) {
      if (error.code !== '42P07') {
        throw error;
      }
    }

    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS tests (
          id SERIAL PRIMARY KEY,
          test_type VARCHAR(20) NOT NULL,
          test_name VARCHAR(255) NOT NULL,
          score INTEGER NOT NULL,
          max_score INTEGER DEFAULT 720,
          date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } catch (error: any) {
      if (error.code !== '42P07') {
        console.log('Tests table creation skipped:', error.message);
      }
    }
    
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS subject_tests (
          id SERIAL PRIMARY KEY,
          subject VARCHAR(20) NOT NULL,
          test_name VARCHAR(255) NOT NULL,
          questions_attempted INTEGER NOT NULL,
          score INTEGER NOT NULL,
          max_score INTEGER NOT NULL,
          date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } catch (error: any) {
      if (error.code !== '42P07') {
        console.log('Subject tests table creation skipped:', error.message);
      }
    }

    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS daily_quotes (
          id SERIAL PRIMARY KEY,
          quote TEXT NOT NULL,
          date DATE DEFAULT CURRENT_DATE,
          UNIQUE(date)
        );
      `);
    } catch (error: any) {
      if (error.code !== '42P07') {
        console.log('Daily quotes table creation skipped:', error.message);
      }
    }

    // New tables for Divyani's daily tracking
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          target_college VARCHAR(100) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } catch (error: any) {
      if (error.code !== '42P07') {
        console.log('Users table creation skipped:', error.message);
      }
    }

    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS daily_logs (
          id SERIAL PRIMARY KEY,
          user_id INTEGER DEFAULT 1,
          date DATE DEFAULT CURRENT_DATE,
          bot_qs INTEGER DEFAULT 0,
          zoo_qs INTEGER DEFAULT 0,
          phy_qs INTEGER DEFAULT 0,
          chem_qs INTEGER DEFAULT 0,
          bot_class BOOLEAN DEFAULT FALSE,
          zoo_class BOOLEAN DEFAULT FALSE,
          phy_class BOOLEAN DEFAULT FALSE,
          chem_class BOOLEAN DEFAULT FALSE,
          bot_dpp BOOLEAN DEFAULT FALSE,
          zoo_dpp BOOLEAN DEFAULT FALSE,
          phy_dpp BOOLEAN DEFAULT FALSE,
          chem_dpp BOOLEAN DEFAULT FALSE,
          bot_assignment BOOLEAN DEFAULT FALSE,
          zoo_assignment BOOLEAN DEFAULT FALSE,
          phy_assignment BOOLEAN DEFAULT FALSE,
          chem_assignment BOOLEAN DEFAULT FALSE,
          revision_done BOOLEAN DEFAULT FALSE,
          errors_fixed INTEGER DEFAULT 0,
          total_questions INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, date)
        );
      `);
      
      // Add missing columns if they don't exist
      const columns = [
        'bot_qs INTEGER DEFAULT 0',
        'zoo_qs INTEGER DEFAULT 0', 
        'phy_qs INTEGER DEFAULT 0',
        'chem_qs INTEGER DEFAULT 0',
        'total_questions INTEGER DEFAULT 0',
        'total_lifetime_questions INTEGER DEFAULT 0'
      ];
      
      for (const column of columns) {
        try {
          await client.query(`ALTER TABLE daily_logs ADD COLUMN IF NOT EXISTS ${column}`);
        } catch (e) {}
      }
    } catch (error: any) {
      if (error.code !== '42P07') {
        console.log('Daily logs table creation skipped:', error.message);
      }
    }

    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS error_logs (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) DEFAULT 1,
          subject VARCHAR(20) NOT NULL,
          chapter VARCHAR(255) NOT NULL,
          mistake TEXT NOT NULL,
          fix TEXT,
          reattempted BOOLEAN DEFAULT FALSE,
          fixed_date DATE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } catch (error: any) {
      if (error.code !== '42P07') {
        console.log('Error logs table creation skipped:', error.message);
      }
    }

    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS mock_tests (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) DEFAULT 1,
          date DATE DEFAULT CURRENT_DATE,
          score INTEGER NOT NULL,
          max_score INTEGER DEFAULT 720,
          subject_scores JSONB DEFAULT '{}',
          top_mistakes TEXT[],
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } catch (error: any) {
      if (error.code !== '42P07') {
        console.log('Mock tests table creation skipped:', error.message);
      }
    }

    // Calendar entries table
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS calendar_entries (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) DEFAULT 1,
          date DATE NOT NULL,
          status VARCHAR(10) CHECK (status IN ('good', 'average', 'bad')) NOT NULL,
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, date)
        );
      `);
    } catch (error: any) {
      if (error.code !== '42P07') {
        console.log('Calendar entries table creation skipped:', error.message);
      }
    }

    // Streak tracking table
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS streak_tracking (
          id SERIAL PRIMARY KEY,
          user_id INTEGER DEFAULT 1,
          current_streak INTEGER DEFAULT 0,
          longest_streak INTEGER DEFAULT 0,
          last_streak_date DATE,
          streak_broken_date DATE,
          total_fire_days INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id)
        );
      `);
      
      // Also create streak_data table for compatibility
      await client.query(`
        CREATE TABLE IF NOT EXISTS streak_data (
          id SERIAL PRIMARY KEY,
          user_id INTEGER DEFAULT 1,
          current_streak INTEGER DEFAULT 0,
          longest_streak INTEGER DEFAULT 0,
          last_streak_date DATE,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id)
        );
      `);
    } catch (error: any) {
      if (error.code !== '42P07') {
        console.log('Streak tracking table creation skipped:', error.message);
      }
    }

    // Insert default user (Divyani)
    try {
      await client.query(`
        INSERT INTO users (name, target_college) 
        VALUES ('Divyani Tiwari', 'AIIMS Delhi')
        ON CONFLICT DO NOTHING;
      `);
    } catch (error: any) {
      console.log('Default user insertion skipped:', error.message);
    }

    // Initialize streak tracking for default user
    try {
      await client.query(`
        INSERT INTO streak_tracking (user_id, current_streak, longest_streak, total_fire_days)
        VALUES (1, 0, 0, 0)
        ON CONFLICT (user_id) DO NOTHING;
      `);
      
      await client.query(`
        INSERT INTO streak_data (user_id, current_streak, longest_streak)
        VALUES (1, 0, 0)
        ON CONFLICT (user_id) DO NOTHING;
      `);
    } catch (error: any) {
      console.log('Default streak tracking insertion skipped:', error.message);
    }
  } finally {
    client.release();
  }
}

export async function getChapterProgress(subject: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM chapter_progress WHERE subject = $1 ORDER BY chapter_name, lecture_index',
      [subject]
    );
    return result.rows;
  } catch (error: any) {
    console.warn('Database error, returning empty array:', error.message);
    return [];
  } finally {
    client.release();
  }
}

export async function updateChapterProgress(data: any) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      INSERT INTO chapter_progress 
      (subject, chapter_name, lecture_index, completed, dpp_completed, revision_level, 
       normal_assignment_1, normal_assignment_2, kattar_assignment, questions_solved, custom_trackers)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (subject, chapter_name, lecture_index) 
      DO UPDATE SET 
        completed = $4, 
        dpp_completed = $5, 
        revision_level = $6,
        normal_assignment_1 = $7, 
        normal_assignment_2 = $8, 
        kattar_assignment = $9,
        questions_solved = $10,
        custom_trackers = $11, 
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [
      data.subject, data.chapterName, data.lectureIndex, data.completed,
      data.dppCompleted, data.revisionLevel, data.normalAssignment1,
      data.normalAssignment2, data.kattarAssignment, data.questionsSolved || 0, JSON.stringify(data.customTrackers || {})
    ]);
    return result.rows[0];
  } catch (error: any) {
    if (error.code === 'ECONNRESET') {
      throw new Error('Database connection lost. Please try again.');
    }
    throw error;
  } finally {
    client.release();
  }
}

export async function getTests() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM tests ORDER BY date DESC');
    return result.rows;
  } catch (error: any) {
    console.warn('Database error, returning empty array:', error.message);
    return [];
  } finally {
    client.release();
  }
}

export async function getSubjectTests(subject?: string) {
  const client = await pool.connect();
  try {
    const query = subject 
      ? 'SELECT * FROM subject_tests WHERE subject = $1 ORDER BY date DESC'
      : 'SELECT * FROM subject_tests ORDER BY date DESC';
    const params = subject ? [subject] : [];
    const result = await client.query(query, params);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function addTest(test: any) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO tests (test_type, test_name, score, max_score) VALUES ($1, $2, $3, $4) RETURNING *',
      [test.testType, test.testName, test.score, test.maxScore]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function addSubjectTest(test: any) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO subject_tests (subject, test_name, questions_attempted, score, max_score) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [test.subject, test.testName, test.questionsAttempted, test.score, test.maxScore]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function getDailyQuote() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT quote FROM daily_quotes WHERE date = CURRENT_DATE ORDER BY id DESC LIMIT 1'
    );
    return result.rows[0]?.quote || null;
  } catch (error: any) {
    console.warn('Database error, returning null:', error.message);
    return null;
  } finally {
    client.release();
  }
}

export async function saveDailyQuote(quote: string) {
  const client = await pool.connect();
  try {
    const today = new Date().toISOString().split('T')[0];
    await client.query(
      'DELETE FROM daily_quotes WHERE date = $1',
      [today]
    );
    await client.query(
      'INSERT INTO daily_quotes (quote, date) VALUES ($1, $2)',
      [quote, today]
    );
  } finally {
    client.release();
  }
}

export async function getStudySessions() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM study_sessions ORDER BY date DESC LIMIT 50');
    return result.rows;
  } catch (error: any) {
    console.warn('Database error, returning empty array:', error.message);
    return [];
  } finally {
    client.release();
  }
}

export async function addStudySession(session: any) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO study_sessions (subject, topic, duration, score, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [session.subject, session.topic, session.duration, session.score, session.notes]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function getAIFeedback() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM ai_feedback ORDER BY timestamp DESC LIMIT 10');
    return result.rows;
  } catch (error: any) {
    console.warn('Database error, returning empty array:', error.message);
    return [];
  } finally {
    client.release();
  }
}

export async function addAIFeedback(feedback: any) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO ai_feedback (message, type, subject) VALUES ($1, $2, $3) RETURNING *',
      [feedback.message, feedback.type, feedback.subject]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function updateChapterQuestions(subject: string, chapterName: string, questionsSolved: number) {
  const client = await pool.connect();
  try {
    // Update all lecture records for this chapter
    const result = await client.query(
      'UPDATE chapter_progress SET questions_solved = $3, updated_at = CURRENT_TIMESTAMP WHERE subject = $1 AND chapter_name = $2',
      [subject, chapterName, questionsSolved]
    );
    
    // If no records exist, create a default one
    if (result.rowCount === 0) {
      await client.query(
        'INSERT INTO chapter_progress (subject, chapter_name, lecture_index, questions_solved) VALUES ($1, $2, 0, $3)',
        [subject, chapterName, questionsSolved]
      );
    }
  } finally {
    client.release();
  }
}

export async function getPredictorData() {
  const client = await pool.connect();
  try {
    const [sessions, tests, subjectTests, progress] = await Promise.all([
      client.query('SELECT * FROM study_sessions'),
      client.query('SELECT * FROM tests'),
      client.query('SELECT * FROM subject_tests'),
      client.query('SELECT * FROM chapter_progress')
    ]);
    
    return {
      sessions: sessions.rows,
      tests: tests.rows,
      subjectTests: subjectTests.rows,
      progress: progress.rows
    };
  } finally {
    client.release();
  }
}

// New functions for Divyani's daily tracking
export async function saveDailyLog(logData: any) {
  const client = await pool.connect();
  try {
    const totalQuestions = (logData.botQs || 0) + (logData.zooQs || 0) + (logData.phyQs || 0) + (logData.chemQs || 0);
    
    // Get previous total to calculate lifetime total
    const prevTotal = await client.query(
      'SELECT COALESCE(SUM(total_questions), 0) as lifetime_total FROM daily_logs WHERE user_id = $1 AND date < $2',
      [logData.userId || 1, logData.date]
    );
    const lifetimeTotal = parseInt(prevTotal.rows[0].lifetime_total) + totalQuestions;
    
    const result = await client.query(`
      INSERT INTO daily_logs 
      (user_id, date, bot_qs, zoo_qs, phy_qs, chem_qs, 
       bot_class, zoo_class, phy_class, chem_class,
       bot_dpp, zoo_dpp, phy_dpp, chem_dpp, 
       bot_assignment, zoo_assignment, phy_assignment, chem_assignment,
       revision_done, errors_fixed, total_questions, total_lifetime_questions)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
      ON CONFLICT (user_id, date) 
      DO UPDATE SET 
        bot_qs = $3, zoo_qs = $4, phy_qs = $5, chem_qs = $6,
        bot_class = $7, zoo_class = $8, phy_class = $9, chem_class = $10,
        bot_dpp = $11, zoo_dpp = $12, phy_dpp = $13, chem_dpp = $14,
        bot_assignment = $15, zoo_assignment = $16, phy_assignment = $17, chem_assignment = $18,
        revision_done = $19, errors_fixed = $20, total_questions = $21, total_lifetime_questions = $22
      RETURNING *
    `, [
      logData.userId || 1, logData.date, 
      logData.botQs || 0, logData.zooQs || 0, logData.phyQs || 0, logData.chemQs || 0,
      logData.botClass || false, logData.zooClass || false, logData.phyClass || false, logData.chemClass || false,
      logData.botDpp || false, logData.zooDpp || false, logData.phyDpp || false, logData.chemDpp || false,
      logData.botAssignment || false, logData.zooAssignment || false, logData.phyAssignment || false, logData.chemAssignment || false,
      logData.revisionDone || false, logData.errorsFixed || 0, totalQuestions, lifetimeTotal
    ]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function getDailyLogs(userId: number = 1, days: number = 30) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM daily_logs WHERE user_id = $1 ORDER BY date DESC LIMIT $2',
      [userId, days]
    );
    return result.rows;
  } catch (error: any) {
    console.warn('Database error, returning empty array:', error.message);
    return [];
  } finally {
    client.release();
  }
}

export async function getTodayLog(userId: number = 1) {
  const client = await pool.connect();
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if it's a new day (00:00 IST) and reset daily counters
    const istTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    const istDate = new Date(istTime).toISOString().split('T')[0];
    
    let result = await client.query(
      'SELECT * FROM daily_logs WHERE user_id = $1 AND date = $2',
      [userId, istDate]
    );
    
    // If no record for today, create one with reset values
    if (result.rows.length === 0) {
      // Get lifetime total from previous days
      const lifetimeResult = await client.query(
        'SELECT COALESCE(SUM(total_questions), 0) as lifetime_total FROM daily_logs WHERE user_id = $1 AND date < $2',
        [userId, istDate]
      );
      const lifetimeTotal = parseInt(lifetimeResult.rows[0].lifetime_total);
      
      await client.query(`
        INSERT INTO daily_logs 
        (user_id, date, bot_qs, zoo_qs, phy_qs, chem_qs, total_questions, total_lifetime_questions)
        VALUES ($1, $2, 0, 0, 0, 0, 0, $3)
      `, [userId, istDate, lifetimeTotal]);
      
      result = await client.query(
        'SELECT * FROM daily_logs WHERE user_id = $1 AND date = $2',
        [userId, istDate]
      );
    }
    
    return result.rows[0] || null;
  } catch (error: any) {
    console.warn('Database error, returning null:', error.message);
    return null;
  } finally {
    client.release();
  }
}

export async function addErrorLog(errorData: any) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO error_logs (user_id, subject, chapter, mistake, fix, reattempted, fixed_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [errorData.userId || 1, errorData.subject, errorData.chapter, errorData.mistake, errorData.fix, errorData.reattempted, errorData.fixedDate]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function getErrorLogs(userId: number = 1) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM error_logs WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  } catch (error: any) {
    console.warn('Database error, returning empty array:', error.message);
    return [];
  } finally {
    client.release();
  }
}

export async function addMockTest(testData: any) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO mock_tests (user_id, date, score, max_score, subject_scores, top_mistakes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [testData.userId || 1, testData.date, testData.score, testData.maxScore, JSON.stringify(testData.subjectScores), testData.topMistakes]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function getMockTests(userId: number = 1) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM mock_tests WHERE user_id = $1 ORDER BY date DESC',
      [userId]
    );
    return result.rows;
  } catch (error: any) {
    console.warn('Database error, returning empty array:', error.message);
    return [];
  } finally {
    client.release();
  }
}

// Calendar functions
export async function saveCalendarEntry(entryData: any) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      INSERT INTO calendar_entries (user_id, date, status, notes)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, date)
      DO UPDATE SET 
        status = $3,
        notes = $4,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [entryData.userId || 1, entryData.date, entryData.status, entryData.notes]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function getCalendarEntries(userId: number = 1, startDate?: string, endDate?: string) {
  const client = await pool.connect();
  try {
    let query = 'SELECT * FROM calendar_entries WHERE user_id = $1';
    const params: any[] = [userId];
    
    if (startDate && endDate) {
      query += ' AND date BETWEEN $2 AND $3';
      params.push(startDate, endDate);
    }
    
    query += ' ORDER BY date DESC';
    
    const result = await client.query(query, params);
    return result.rows;
  } catch (error: any) {
    console.warn('Database error, returning empty array:', error.message);
    return [];
  } finally {
    client.release();
  }
}

export async function deleteCalendarEntry(userId: number, date: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'DELETE FROM calendar_entries WHERE user_id = $1 AND date = $2 RETURNING *',
      [userId, date]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function updateErrorLog(errorId: number, updateData: any) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      UPDATE error_logs 
      SET subject = $2, chapter = $3, mistake = $4, fix = $5, 
          reattempted = $6, fixed_date = $7
      WHERE id = $1
      RETURNING *
    `, [errorId, updateData.subject, updateData.chapter, updateData.mistake, 
        updateData.fix, updateData.reattempted, updateData.fixedDate]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function deleteErrorLog(errorId: number) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'DELETE FROM error_logs WHERE id = $1 RETURNING *',
      [errorId]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

// Streak management functions
export async function getStreakData(userId: number = 1) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM streak_tracking WHERE user_id = $1',
      [userId]
    );
    return result.rows[0] || {
      current_streak: 0,
      longest_streak: 0,
      last_streak_date: null,
      total_fire_days: 0
    };
  } catch (error: any) {
    return {
      current_streak: 0,
      longest_streak: 0,
      last_streak_date: null,
      total_fire_days: 0
    };
  } finally {
    client.release();
  }
}

export async function updateStreak(userId: number = 1, isFireDay: boolean) {
  const client = await pool.connect();
  try {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Get current streak data
    const currentStreak = await getStreakData(userId);
    
    let newCurrentStreak = 0;
    let newLongestStreak = currentStreak.longest_streak;
    let newTotalFireDays = currentStreak.total_fire_days;
    let streakBrokenDate = null;
    
    if (isFireDay) {
      // Check if this continues a streak
      if (currentStreak.last_streak_date === yesterday) {
        newCurrentStreak = currentStreak.current_streak + 1;
      } else if (currentStreak.last_streak_date === today) {
        // Same day update, don't increment
        newCurrentStreak = currentStreak.current_streak;
      } else {
        // New streak starts
        newCurrentStreak = 1;
      }
      
      newTotalFireDays = currentStreak.total_fire_days + 1;
      
      // Update longest streak if current is longer
      if (newCurrentStreak > newLongestStreak) {
        newLongestStreak = newCurrentStreak;
      }
    } else {
      // Check if streak should be broken
      if (currentStreak.last_streak_date && currentStreak.last_streak_date < yesterday) {
        newCurrentStreak = 0;
        streakBrokenDate = today;
      } else {
        newCurrentStreak = currentStreak.current_streak;
      }
    }
    
    const result = await client.query(`
      INSERT INTO streak_tracking 
      (user_id, current_streak, longest_streak, last_streak_date, streak_broken_date, total_fire_days, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id)
      DO UPDATE SET 
        current_streak = $2,
        longest_streak = $3,
        last_streak_date = $4,
        streak_broken_date = $5,
        total_fire_days = $6,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [userId, newCurrentStreak, newLongestStreak, isFireDay ? today : currentStreak.last_streak_date, streakBrokenDate, newTotalFireDays]);
    
    return result.rows[0];
  } finally {
    client.release();
  }
}
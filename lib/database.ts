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
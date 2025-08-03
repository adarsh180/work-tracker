const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 5000,
  max: 1
});

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    if (event.httpMethod === 'GET') {
      const subject = event.queryStringParameters?.subject;
      if (!subject) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Subject parameter required' })
        };
      }

      const client = await pool.connect();
      try {
        const result = await client.query(
          'SELECT * FROM chapter_progress WHERE subject = $1 ORDER BY chapter_name, lecture_index',
          [subject]
        );
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(result.rows)
        };
      } finally {
        client.release();
      }
    }

    if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body);
      const client = await pool.connect();
      
      try {
        const result = await client.query(`
          INSERT INTO chapter_progress 
          (subject, chapter_name, lecture_index, completed, dpp_completed, revision_level, 
           normal_assignment_1, normal_assignment_2, kattar_assignment, questions_solved, custom_trackers)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (subject, chapter_name, lecture_index) 
          DO UPDATE SET 
            completed = $4, dpp_completed = $5, revision_level = $6,
            normal_assignment_1 = $7, normal_assignment_2 = $8, kattar_assignment = $9,
            questions_solved = $10, custom_trackers = $11, updated_at = CURRENT_TIMESTAMP
          RETURNING *
        `, [
          data.subject, data.chapterName, data.lectureIndex, data.completed,
          data.dppCompleted, data.revisionLevel, data.normalAssignment1,
          data.normalAssignment2, data.kattarAssignment, data.questionsSolved || 0, 
          JSON.stringify(data.customTrackers || {})
        ]);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(result.rows[0])
        };
      } finally {
        client.release();
      }
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
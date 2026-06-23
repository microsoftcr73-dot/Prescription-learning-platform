import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMedal, FaAward } from 'react-icons/fa';
import './LeaderboardPage.css';

function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('/api/progress/leaderboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaderboard(response.data.leaderboard);
      setError(null);
    } catch (err) {
      setError('Failed to load leaderboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '▪';
    }
  };

  if (loading) {
    return <div className="leaderboard-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1>🏆 Leaderboard</h1>
        <p>Top performing students in prescription learning</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="leaderboard-table">
        <div className="table-header">
          <div className="col-rank">Rank</div>
          <div className="col-name">Student</div>
          <div className="col-score">Avg Score</div>
          <div className="col-passed">Passed</div>
          <div className="col-attempts">Attempts</div>
        </div>

        {leaderboard.map((student) => (
          <div key={student.rank} className="table-row">
            <div className="col-rank">
              <span className="medal">{getMedalIcon(student.rank)}</span>
              <span className="rank-number">#{student.rank}</span>
            </div>
            <div className="col-name">{student.name}</div>
            <div className="col-score">
              <span className="score-badge">{student.average_score}%</span>
            </div>
            <div className="col-passed">
              <span className="passed-badge">{student.quizzes_passed}</span>
            </div>
            <div className="col-attempts">{student.total_attempts}</div>
          </div>
        ))}
      </div>

      {leaderboard.length === 0 && (
        <div className="empty-state">
          <p>No leaderboard data available yet. Complete quizzes to appear here!</p>
        </div>
      )}
    </div>
  );
}

export default LeaderboardPage;

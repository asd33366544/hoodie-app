import { useState, useEffect } from 'react';
import { Download, RefreshCw } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Admin() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/students`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleExport = () => {
    window.open(`${API_URL}/export`, '_blank');
  };

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div className="admin-header">
          <div>
            <h1 style={{ fontSize: '1.8rem', color: '#0f172a' }}>Admin Dashboard</h1>
            <p style={{ color: '#64748b' }}>Medical Sciences Hoodie Submissions ({students.length})</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={fetchStudents} 
              className="btn btn-secondary" 
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button 
              onClick={handleExport} 
              className="btn" 
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
            >
              <Download size={16} />
              Export to Excel
            </button>
          </div>
        </div>

        <div className="admin-card">
          {error && <p style={{ color: 'red' }}>{error}</p>}
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              Loading data...
            </div>
          ) : (
            <div className="table-container">
              {students.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr key={index}>
                        <td>{student.name}</td>
                        <td>{student.department}</td>
                        <td>{student.size}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-data">
                  <p>No submissions yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;

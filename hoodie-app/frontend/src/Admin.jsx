import { useState, useEffect } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import * as XLSX from 'xlsx';
import { supabase } from './supabaseClient';

function Admin() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: fetchError } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setStudents(data || []);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleExport = () => {
    if (!students || students.length === 0) {
      alert('No data to export!');
      return;
    }

    const exportData = students.map((student, idx) => ({
      '#': idx + 1,
      'Name': student.name,
      'Department': student.department,
      'Size': student.size,
      'Date': student.created_at ? new Date(student.created_at).toLocaleString('ar-EG') : ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Hoodie Sizes');

    worksheet['!cols'] = [
      { wch: 5 },
      { wch: 30 },
      { wch: 25 },
      { wch: 10 },
      { wch: 22 }
    ];

    XLSX.writeFile(workbook, 'hoodie_sizes.xlsx');
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

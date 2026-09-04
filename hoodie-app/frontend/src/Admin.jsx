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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img 
              src="/college-logo.jpg" 
              alt="Faculty Logo" 
              style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'contain', border: '2px solid #e2e8f0', padding: '2px', background: '#fff' }} 
            />
            <div>
              <h1 style={{ fontSize: '1.6rem', color: '#0f172a' }}>Admin Dashboard</h1>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Medical Sciences Hoodie Submissions ({students.length})</p>
            </div>
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
                      <th>#</th>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Size</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr key={student.id || index}>
                        <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{index + 1}</td>
                        <td style={{ fontWeight: '500' }}>{student.name}</td>
                        <td>{student.department}</td>
                        <td>
                          <span style={{ 
                            display: 'inline-block',
                            padding: '0.2rem 0.6rem', 
                            backgroundColor: '#e0f2fe', 
                            color: '#0369a1', 
                            borderRadius: '6px', 
                            fontWeight: '600',
                            fontSize: '0.85rem'
                          }}>
                            {student.size}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                          {student.created_at ? new Date(student.created_at).toLocaleString('ar-EG') : '-'}
                        </td>
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

        {/* Footer Credit */}
        <div style={{ textAlign: 'center', marginTop: '2rem', color: '#94a3b8', fontSize: '0.85rem' }}>
          Developed by <strong style={{ color: '#475569' }}>Ahmed Atta</strong> • Medical Sciences Graduation
        </div>
      </div>
    </div>
  );
}

export default Admin;

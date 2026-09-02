const express = require('express');
const cors = require('cors');
const { initDb } = require('./database');
const exceljs = require('exceljs');

const app = express();
app.use(cors());
app.use(express.json());

let db;

// Initialize database
initDb().then(database => {
  db = database;
  console.log('Database initialized');
});

// Endpoint to submit hoodie information
app.post('/api/students', async (req, res) => {
  const { name, department, size } = req.body;

  if (!name || !department || !size) {
    return res.status(400).json({ error: 'Name, department, and size are required' });
  }

  // Validate department
  const validDepartments = ['Dental Prosthetics', 'Medical Devices', 'Medical Laboratories', 'Radiology', 'Optics'];
  if (!validDepartments.includes(department)) {
    return res.status(400).json({ error: 'Invalid department' });
  }

  // Validate size
  const validSizes = ['M', 'L', 'XL', '2XL'];
  if (!validSizes.includes(size)) {
    return res.status(400).json({ error: 'Invalid size' });
  }

  try {
    const result = await db.run(
      'INSERT INTO students (name, department, size) VALUES (?, ?, ?)',
      [name, department, size]
    );
    res.status(201).json({ id: result.lastID, message: 'Student information saved successfully' });
  } catch (error) {
    console.error('Error saving student info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to get all submissions (for admin panel)
app.get('/api/students', async (req, res) => {
  try {
    const students = await db.all('SELECT name, department, size FROM students ORDER BY created_at DESC');
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to export data to Excel
app.get('/api/export', async (req, res) => {
  try {
    const students = await db.all('SELECT name, department, size FROM students ORDER BY created_at ASC');
    
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Hoodie Sizes');
    
    // Add headers
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Department', key: 'department', width: 25 },
      { header: 'Size', key: 'size', width: 10 }
    ];
    
    // Style headers
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    
    // Add data
    students.forEach(student => {
      worksheet.addRow(student);
    });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=' + 'hoodie_sizes.xlsx');
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

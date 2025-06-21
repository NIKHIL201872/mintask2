import { useState } from 'react';
import { mintask2_backend } from "declarations/mintask2_backend";
import jsPDF from 'jspdf';
import './App.scss';

function App() {
  const [name, setName] = useState('');
  const [marks, setMarks] = useState('');
  const [subjects, setSubjects] = useState('');
  const [report, setReport] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !marks || !subjects) return;

    try {
      const result = await mintask2_backend.generate_report(
        name,
        parseFloat(marks),
        BigInt(subjects)  // u64 from Rust
      );
      setReport(result);
    } catch (error) {
      console.error('Backend call failed:', error);
    }
  };

  const generatePDF = () => {
    if (!report) return;
    const doc = new jsPDF();
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Student Report', 70, 20);
    doc.setFontSize(14);
    doc.setFont('Helvetica', 'normal');

    const details = [
      `Name: ${report.name}`,
      `Total Marks: ${report.total_marks}`,
      `Subjects: ${report.num_subjects}`,
      `Average: ${report.average.toFixed(2)}`,
      `Grade: ${report.grade}`,
      `Percentage: ${report.average.toFixed(2)}%`,
    ];

    details.forEach((line, index) => {
      doc.text(line, 20, 40 + index * 10);
    });

    doc.save(`${report.name}_Report.pdf`);
  };

  return (
    <div className="container">
      <h1>Student Report</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Enter total marks"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Enter number of subjects"
          value={subjects}
          onChange={(e) => setSubjects(e.target.value)}
          required
        />
        <button type="submit">Generate Report</button>
      </form>

      {report && (
        <div className="report-card">
          <h2>Report Card</h2>
          <p><strong>Name:</strong> {report.name}</p>
          <p><strong>Total Marks:</strong> {report.total_marks}</p>
          <p><strong>Subjects:</strong> {report.num_subjects}</p>
          <p><strong>Average:</strong> {report.average.toFixed(2)}</p>
          <p><strong>Grade:</strong> {report.grade}</p>
          <p><strong>Percentage:</strong> {report.average.toFixed(2)}%</p>
          <button onClick={generatePDF}>Download PDF</button>
        </div>
      )}
    </div>
  );
}

export default App;

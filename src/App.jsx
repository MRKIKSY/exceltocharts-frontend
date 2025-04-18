import { useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, ArcElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale);

function App() {
  const [excelData, setExcelData] = useState([]);
  const [labelsColumn, setLabelsColumn] = useState('');
  const [valuesColumn, setValuesColumn] = useState('');
  const [chartType, setChartType] = useState('bar');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    const res = await axios.post('https://excel-to-charts-2.onrender.com/upload', formData);
    setExcelData(res.data);
  };

  const columns = excelData.length > 0 ? Object.keys(excelData[0]) : [];

  const chartData = {
    labels: excelData.map(row => row[labelsColumn]),
    datasets: [{
      label: 'Values',
      data: excelData.map(row => row[valuesColumn]),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }],
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>
        Samuel Excel to Charts Converter
      </h1>

      <h2>Upload Excel File</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

      {excelData.length > 0 && (
        <>
          <div style={{ marginTop: '1rem' }}>
            <label>Labels:</label>
            <select onChange={(e) => setLabelsColumn(e.target.value)}>
              <option value="">-- Select Column --</option>
              {columns.map(col => <option key={col} value={col}>{col}</option>)}
            </select>

            <label style={{ marginLeft: '1rem' }}>Values:</label>
            <select onChange={(e) => setValuesColumn(e.target.value)}>
              <option value="">-- Select Column --</option>
              {columns.map(col => <option key={col} value={col}>{col}</option>)}
            </select>

            <label style={{ marginLeft: '1rem' }}>Chart Type:</label>
            <select onChange={(e) => setChartType(e.target.value)}>
              <option value="bar">Bar</option>
              <option value="pie">Pie</option>
            </select>
          </div>

          {labelsColumn && valuesColumn && (
            <div style={{ maxWidth: 600, marginTop: '2rem' }}>
              {chartType === 'bar' && <Bar data={chartData} />}
              {chartType === 'pie' && <Pie data={chartData} />}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;

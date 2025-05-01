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

    const res = await axios.post('http://localhost:5000/upload', formData);
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
    <div className="container py-5">
      <h1 className="text-center mb-4">Samuel Excel to Charts Converter</h1>

      <div className="mb-3">
        <label className="form-label">Upload Excel File</label>
        <input type="file" accept=".xlsx, .xls" className="form-control" onChange={handleFileUpload} />
      </div>

      {excelData.length > 0 && (
        <>
          <div className="row g-3 align-items-center mt-4">
            <div className="col-md-4">
              <label className="form-label">Labels</label>
              <select className="form-select" onChange={(e) => setLabelsColumn(e.target.value)}>
                <option value="">-- Select Column --</option>
                {columns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Values</label>
              <select className="form-select" onChange={(e) => setValuesColumn(e.target.value)}>
                <option value="">-- Select Column --</option>
                {columns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Chart Type</label>
              <select className="form-select" onChange={(e) => setChartType(e.target.value)}>
                <option value="bar">Bar</option>
                <option value="pie">Pie</option>
              </select>
            </div>
          </div>

          {labelsColumn && valuesColumn && (
            <div className="mt-5 d-flex justify-content-center">
              <div style={{ width: '100%', maxWidth: 600 }}>
                {chartType === 'bar' && <Bar data={chartData} />}
                {chartType === 'pie' && <Pie data={chartData} />}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;

import { useState, useRef } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, ArcElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale);

function App() {
  const [excelData, setExcelData] = useState([]);
  const [labelsColumn, setLabelsColumn] = useState('');
  const [valuesColumn, setValuesColumn] = useState('');
  const [chartType, setChartType] = useState('bar');
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const chartRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    setFileName(file.name);

    try {
      const res = await axios.post('https://excel-to-charts-2.onrender.com/upload', formData);
      setExcelData(res.data);
    } catch (err) {
      alert('Upload failed. Check server status.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => handleFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => e.preventDefault();

  const columns = excelData.length > 0 ? Object.keys(excelData[0]) : [];

  const chartData = {
    labels: excelData.map(row => row[labelsColumn]),
    datasets: [{
      label: 'Values',
      data: excelData.map(row => row[valuesColumn]),
      backgroundColor: chartType === 'bar'
        ? 'rgba(75, 192, 192, 0.6)'
        : [
            '#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
          ],
    }],
  };

  const downloadChart = () => {
    if (!chartRef.current) return;
    const link = document.createElement('a');
    link.download = 'chart.png';
    link.href = chartRef.current.toBase64Image();
    link.click();
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-5">📊 Samuel's Excel to Chart Converter</h1>

      <div
        className="card shadow-sm mb-4 p-4 border-dashed text-center"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{ border: '2px dashed #ccc', cursor: 'pointer' }}
      >
        <h5 className="mb-3">Drag & Drop Excel File Here</h5>
        <p>or</p>
        <input
          type="file"
          accept=".xlsx, .xls"
          className="form-control mt-2"
          onChange={handleFileUpload}
        />
        {fileName && (
          <div className="mt-2 text-success fw-semibold">📁 {fileName}</div>
        )}
        {loading && (
          <div className="spinner-border text-primary mt-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        )}
      </div>

      {excelData.length > 0 && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title">Select Chart Parameters</h5>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Label Column</label>
                <select className="form-select" value={labelsColumn} onChange={e => setLabelsColumn(e.target.value)}>
                  <option value="">-- Select --</option>
                  {columns.map(col => <option key={col} value={col}>{col}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Value Column</label>
                <select className="form-select" value={valuesColumn} onChange={e => setValuesColumn(e.target.value)}>
                  <option value="">-- Select --</option>
                  {columns.map(col => <option key={col} value={col}>{col}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Chart Type</label>
                <select className="form-select" value={chartType} onChange={e => setChartType(e.target.value)}>
                  <option value="bar">Bar</option>
                  <option value="pie">Pie</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {labelsColumn && valuesColumn && (
        <div className="d-flex justify-content-center">
          <div className="card p-4 shadow-sm w-100" style={{ maxWidth: 700 }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Chart Preview</h5>
              <button className="btn btn-outline-primary btn-sm" onClick={downloadChart}>
                ⬇️ Download Chart
              </button>
            </div>
            {chartType === 'bar' && <Bar ref={chartRef} data={chartData} />}
            {chartType === 'pie' && <Pie ref={chartRef} data={chartData} />}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

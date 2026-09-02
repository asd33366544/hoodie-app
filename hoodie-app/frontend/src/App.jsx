import { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const backgrounds = [
  '/media__1788377129966.jpg',
  '/media__1788377129983.jpg',
  '/media__1788377130004.jpg',
  '/media__1788377130143.jpg',
  '/media__1788377130152.jpg'
];

function App() {
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    size: ''
  });
  const [bgImage, setBgImage] = useState(backgrounds[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Randomize background image on load
    const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    setBgImage(randomBg);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit data');
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <div 
        className="hero-bg" 
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>
      <div className="hero-overlay"></div>
      
      <main className="main-content">
        <div className="glass-card">
          {isSuccess ? (
            <div className="success-message">
              <div className="success-icon">
                <CheckCircle2 size={48} />
              </div>
              <h2>Thank You!</h2>
              <p>Your hoodie information has been recorded successfully.</p>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setIsSuccess(false);
                  setFormData({ name: '', department: '', size: '' });
                }}
              >
                Submit Another
              </button>
            </div>
          ) : (
            <>
              <header className="header">
                <h1>Medical Sciences</h1>
                <p>Graduation Hoodie Collection</p>
              </header>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="department" className="form-label">Department</label>
                  <select
                    id="department"
                    name="department"
                    className="form-select"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select your department</option>
                    <option value="Dental Prosthetics">Dental Prosthetics</option>
                    <option value="Medical Devices">Medical Devices</option>
                    <option value="Medical Laboratories">Medical Laboratories</option>
                    <option value="Radiology">Radiology</option>
                    <option value="Optics">Optics</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="size" className="form-label">Hoodie Size</label>
                  <select
                    id="size"
                    name="size"
                    className="form-select"
                    value={formData.size}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select your size</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="2XL">2XL</option>
                  </select>
                </div>

                {error && <p style={{ color: 'var(--error-color)', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}

                <button type="submit" className="btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Information'}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;

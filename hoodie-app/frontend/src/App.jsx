import { useState, useEffect } from 'react';
import { CheckCircle2, User, Sparkles, X, Heart } from 'lucide-react';
import { supabase } from './supabaseClient';

const backgrounds = [
  '/college-building.jpg',
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
  const [showDevModal, setShowDevModal] = useState(false);

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
      const { error: insertError } = await supabase
        .from('students')
        .insert([
          {
            name: formData.name.trim(),
            department: formData.department,
            size: formData.size
          }
        ]);

      if (insertError) {
        throw insertError;
      }

      setIsSuccess(true);
    } catch (err) {
      console.error('Error submitting student info:', err);
      setError(err.message || 'Failed to submit data');
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
          {/* Faculty Logo Header */}
          <div className="college-header-badge">
            <img 
              src="/college-logo.jpg" 
              alt="Faculty Logo" 
              className="college-logo-img" 
            />
          </div>

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
                <div className="sub-title-ar">جامعة المنوفية - كلية العلوم الصحية التطبيقية</div>
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
                    <option value="Dental Prosthetics">Dental Prosthetics (تركيبات أسنان)</option>
                    <option value="Medical Devices">Medical Devices (أجهزة طبية)</option>
                    <option value="Medical Laboratories">Medical Laboratories (مختبرات طبية)</option>
                    <option value="Radiology">Radiology (أشعة وتصوير طبي)</option>
                    <option value="Optics">Optics (بصريات)</option>
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

          {/* Developer Credit Footer */}
          <footer className="dev-footer">
            <button 
              className="dev-credit-btn" 
              onClick={() => setShowDevModal(true)}
              title="Click to view Developer Profile"
            >
              <img 
                src="/ahmed-atta.jpg" 
                alt="Ahmed Atta" 
                className="dev-avatar-thumb" 
              />
              <span>Created with <Heart size={14} className="heart-icon" /> by <strong>Ahmed Atta</strong></span>
            </button>
          </footer>
        </div>
      </main>

      {/* Developer Profile Modal */}
      {showDevModal && (
        <div className="modal-backdrop" onClick={() => setShowDevModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowDevModal(false)}>
              <X size={20} />
            </button>

            <div className="modal-avatar-wrapper">
              <img src="/ahmed-atta.jpg" alt="Ahmed Atta" className="modal-avatar-img" />
              <div className="dev-badge-icon">
                <Sparkles size={16} />
              </div>
            </div>

            <h3 className="modal-dev-name">Ahmed Atta</h3>
            <p className="modal-dev-role">Full-Stack Web Developer</p>
            <p className="modal-dev-bio">
              Designed & Developed the Medical Sciences Graduation Hoodie Platform.
            </p>

            <button 
              className="btn btn-secondary" 
              style={{ width: '100%', marginTop: '1.2rem' }}
              onClick={() => setShowDevModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

import { useState } from 'react';
import { Building2, Mail, Phone, Globe, FileText, Check } from 'lucide-react';
import type { CompanyInfo } from '../types';

interface SetupWizardProps {
  onComplete: (companyInfo: CompanyInfo) => void;
}

export default function SetupWizard({ onComplete }: SetupWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CompanyInfo>({
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    fiscalId: '',
    additionalInfo: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Le nom de l\'entreprise est obligatoire';
      }
    }

    if (currentStep === 2) {
      if (!formData.phone.trim()) {
        newErrors.phone = 'Le numéro de téléphone est obligatoire';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'L\'adresse email est obligatoire';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Adresse email invalide';
      }
      if (!formData.address.trim()) {
        newErrors.address = 'L\'adresse est obligatoire';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 4) {
        setStep(step + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    if (validateStep(step)) {
      onComplete(formData);
    }
  };

  const updateField = (field: keyof CompanyInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="setup-wizard">
      <div className="setup-container">
        <div className="setup-header">
          <div className="setup-logo">
            <Building2 size={48} />
          </div>
          <h1 className="setup-title">Bienvenue dans LOGIMAK</h1>
          <p className="setup-description">
            Configurons votre logiciel de gestion commerciale en quelques étapes simples
          </p>
        </div>

        <div className="setup-steps">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`setup-step ${step >= s ? 'active' : ''} ${step > s ? 'completed' : ''}`}>
              <div className="step-number">
                {step > s ? <Check size={20} /> : s}
              </div>
              <div className="step-label">
                {s === 1 && 'Informations'}
                {s === 2 && 'Coordonnées'}
                {s === 3 && 'Logo'}
                {s === 4 && 'Validation'}
              </div>
            </div>
          ))}
        </div>

        <div className="setup-content">
          {step === 1 && (
            <div className="setup-form">
              <h2 className="form-title">Informations générales de l'entreprise</h2>
              
              <div className="form-group">
                <label className="form-label form-label-required">
                  <Building2 size={18} />
                  Nom de l'entreprise
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Ex: Boutique Mamadou"
                />
                <p className="form-description">
                  Le nom qui apparaîtra sur vos factures et documents
                </p>
                {errors.name && <p className="form-error">{errors.name}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FileText size={18} />
                  Numéro d'identification fiscale
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.fiscalId}
                  onChange={(e) => updateField('fiscalId', e.target.value)}
                  placeholder="Ex: NIF123456789"
                />
                <p className="form-description">
                  Numéro fiscal ou d'enregistrement (optionnel)
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="setup-form">
              <h2 className="form-title">Coordonnées de contact</h2>
              
              <div className="form-group">
                <label className="form-label form-label-required">
                  <Phone size={18} />
                  Téléphone
                </label>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="Ex: +235 66 64 76 40"
                />
                <p className="form-description">
                  Numéro de téléphone principal de l'entreprise
                </p>
                {errors.phone && <p className="form-error">{errors.phone}</p>}
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">
                  <Mail size={18} />
                  Email
                </label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="Ex: contact@boutique.com"
                />
                <p className="form-description">
                  Adresse email professionnelle
                </p>
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">
                  Adresse physique
                </label>
                <textarea
                  className="form-textarea"
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="Ex: Avenue Mobutu, Quartier Chagoua, N'Djamena"
                  rows={3}
                />
                <p className="form-description">
                  Adresse complète de votre établissement
                </p>
                {errors.address && <p className="form-error">{errors.address}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Globe size={18} />
                  Site web
                </label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.website}
                  onChange={(e) => updateField('website', e.target.value)}
                  placeholder="Ex: www.votreentreprise.com"
                />
                <p className="form-description">
                  Site web de votre entreprise (optionnel)
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="setup-form">
              <h2 className="form-title">Logo de l'entreprise</h2>
              
              <div className="logo-upload-section">
                <div className="logo-preview">
                  {formData.logo ? (
                    <img src={formData.logo} alt="Logo" />
                  ) : (
                    <div className="logo-placeholder">
                      <Building2 size={64} />
                      <p>Aucun logo</p>
                    </div>
                  )}
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    Importer un logo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-input"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          updateField('logo', reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <p className="form-description">
                    Le logo apparaîtra sur vos factures et documents (optionnel)
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Informations complémentaires
                  </label>
                  <textarea
                    className="form-textarea"
                    value={formData.additionalInfo}
                    onChange={(e) => updateField('additionalInfo', e.target.value)}
                    placeholder="Ex: Slogan, informations bancaires, horaires d'ouverture..."
                    rows={4}
                  />
                  <p className="form-description">
                    Toute information additionnelle à afficher sur vos documents
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="setup-form">
              <h2 className="form-title">Validation de la configuration</h2>
              
              <div className="confirmation-card">
                <h3>Vérifiez vos informations</h3>
                
                <div className="confirmation-section">
                  <h4>Informations générales</h4>
                  <div className="confirmation-item">
                    <span className="confirmation-label">Nom de l'entreprise:</span>
                    <span className="confirmation-value">{formData.name}</span>
                  </div>
                  {formData.fiscalId && (
                    <div className="confirmation-item">
                      <span className="confirmation-label">Numéro fiscal:</span>
                      <span className="confirmation-value">{formData.fiscalId}</span>
                    </div>
                  )}
                </div>

                <div className="confirmation-section">
                  <h4>Coordonnées</h4>
                  <div className="confirmation-item">
                    <span className="confirmation-label">Téléphone:</span>
                    <span className="confirmation-value">{formData.phone}</span>
                  </div>
                  <div className="confirmation-item">
                    <span className="confirmation-label">Email:</span>
                    <span className="confirmation-value">{formData.email}</span>
                  </div>
                  <div className="confirmation-item">
                    <span className="confirmation-label">Adresse:</span>
                    <span className="confirmation-value">{formData.address}</span>
                  </div>
                  {formData.website && (
                    <div className="confirmation-item">
                      <span className="confirmation-label">Site web:</span>
                      <span className="confirmation-value">{formData.website}</span>
                    </div>
                  )}
                </div>

                {formData.logo && (
                  <div className="confirmation-section">
                    <h4>Logo</h4>
                    <div className="confirmation-logo">
                      <img src={formData.logo} alt="Logo" />
                    </div>
                  </div>
                )}

                {formData.additionalInfo && (
                  <div className="confirmation-section">
                    <h4>Informations complémentaires</h4>
                    <p className="confirmation-value">{formData.additionalInfo}</p>
                  </div>
                )}
              </div>

              <div className="setup-info-box">
                <p>
                  <strong>Note:</strong> Vous pourrez modifier ces informations plus tard 
                  dans la section "Paramètres" de l'application.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="setup-actions">
          {step > 1 && (
            <button className="btn btn-outline" onClick={handlePrevious}>
              Précédent
            </button>
          )}
          <div style={{ flex: 1 }} />
          {step < 4 ? (
            <button className="btn btn-primary" onClick={handleNext}>
              Suivant
            </button>
          ) : (
            <button className="btn btn-success" onClick={handleComplete}>
              <Check size={20} />
              Terminer la configuration
            </button>
          )}
        </div>
      </div>

      <style>{`
        .setup-wizard {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-image: url('/image fond logimak.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          padding: 90px 1rem 1rem 1rem;
          box-sizing: border-box;
          overflow: auto;
          z-index: 9999;
        }

        .setup-container {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: var(--radius-xl);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          width: 100%;
          max-width: 800px;
          max-height: calc(100vh - 100px);
          min-height: 600px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          margin: auto;
          position: relative;
          z-index: 1;
          border: 1px solid rgba(249, 115, 22, 0.3);
        }

        .setup-header {
          padding: 1.25rem 2rem;
          text-align: center;
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          color: #333;
          flex-shrink: 0;
          border-bottom: 3px solid #f97316;
        }

        .setup-logo {
          display: flex;
          justify-content: center;
          margin-bottom: 0.5rem;
          color: #f97316;
        }

        .setup-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
          color: #1a1a1a;
        }

        .setup-description {
          font-size: 0.9rem;
          color: #666;
        }

        .setup-steps {
          display: flex;
          padding: 1.5rem 2rem;
          justify-content: space-between;
          background: rgba(248, 248, 248, 0.7);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }

        .setup-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
          position: relative;
        }

        .setup-step:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 20px;
          left: 60%;
          width: 80%;
          height: 2px;
          background: var(--border);
        }

        .setup-step.completed:not(:last-child)::after {
          background: #10b981;
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--bg-card);
          border: 2px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: var(--text-secondary);
          transition: all 0.3s;
          z-index: 1;
        }

        .setup-step.active .step-number {
          background: #f97316;
          border-color: #f97316;
          color: white;
        }

        .setup-step.completed .step-number {
          background: #10b981;
          border-color: #10b981;
          color: white;
        }

        .step-label {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .setup-step.active .step-label {
          color: #f97316;
          font-weight: 600;
        }

        .setup-content {
          flex: 1 1 auto;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 2rem;
          min-height: 0;
        }
        
        .setup-content::-webkit-scrollbar {
          width: 8px;
        }
        
        .setup-content::-webkit-scrollbar-track {
          background: var(--bg-main);
        }
        
        .setup-content::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 4px;
        }
        
        .setup-content::-webkit-scrollbar-thumb:hover {
          background: var(--text-muted);
        }

        .setup-form {
          max-width: 600px;
          margin: 0 auto;
        }

        .form-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: var(--text-primary);
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        @media (max-width: 768px) {
          .setup-wizard {
            padding: 150px 0.5rem 1rem 0.5rem;
          }
          
          .setup-container {
            max-height: calc(100vh - 160px);
            min-height: 500px;
            border-radius: var(--radius-lg);
          }
          
          .setup-header {
            padding: 1rem;
          }
          
          .setup-steps {
            padding: 1rem;
          }
          
          .step-label {
            font-size: 0.75rem;
          }
          
          .setup-title {
            font-size: 1.25rem;
          }
          
          .setup-description {
            font-size: 0.85rem;
          }
          
          .setup-content {
            padding: 1.5rem;
          }
          
          .setup-actions {
            padding: 1rem 1.5rem;
          }
        }

        .logo-upload-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .logo-preview {
          display: flex;
          justify-content: center;
          padding: 2rem;
          background: var(--bg-main);
          border-radius: var(--radius-lg);
          border: 2px dashed var(--border);
        }

        .logo-preview img {
          max-width: 200px;
          max-height: 200px;
          object-fit: contain;
        }

        .logo-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          color: var(--text-muted);
        }

        .confirmation-card {
          background: var(--bg-main);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          border: 1px solid var(--border);
        }

        .confirmation-card h3 {
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
          color: var(--text-primary);
        }

        .confirmation-section {
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border);
        }

        .confirmation-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .confirmation-section h4 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: var(--text-secondary);
        }

        .confirmation-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
        }

        .confirmation-label {
          font-weight: 500;
          color: var(--text-secondary);
        }

        .confirmation-value {
          color: var(--text-primary);
          text-align: right;
        }

        .confirmation-logo {
          display: flex;
          justify-content: center;
        }

        .confirmation-logo img {
          max-width: 150px;
          max-height: 150px;
          object-fit: contain;
        }

        .setup-info-box {
          margin-top: 1.5rem;
          padding: 1rem;
          background: rgba(249, 115, 22, 0.1);
          border-radius: var(--radius-md);
          border-left: 4px solid #f97316;
        }

        .setup-info-box p {
          color: var(--text-primary);
          font-size: 0.9rem;
          margin: 0;
        }

        .setup-actions {
          display: flex;
          gap: 1rem;
          padding: 1.5rem 2rem;
          border-top: 1px solid var(--border);
          background: rgba(248, 248, 248, 0.7);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Building2, Save, Info, Database, Upload, Download, RotateCcw, AlertTriangle } from 'lucide-react';
import type { CompanyInfo } from '../types';

interface SettingsProps {
  db: any;
}

export default function Settings({ db }: SettingsProps) {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    fiscalId: '',
    additionalInfo: '',
    logo: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadCompanyInfo();
  }, []);

  const loadCompanyInfo = async () => {
    const info = await db.getCompanyInfo();
    if (info) {
      setCompanyInfo(info);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!companyInfo.name.trim()) {
      newErrors.name = 'Le nom de l\'entreprise est obligatoire';
    }

    if (!companyInfo.phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est obligatoire';
    }

    if (!companyInfo.email.trim()) {
      newErrors.email = 'L\'adresse email est obligatoire';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyInfo.email)) {
      newErrors.email = 'Adresse email invalide';
    }

    if (!companyInfo.address.trim()) {
      newErrors.address = 'L\'adresse est obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    await db.updateCompanyInfo(companyInfo);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateField = (field: keyof CompanyInfo, value: string) => {
    setCompanyInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('logo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Gestion de la base de données
  const handleExport = async () => {
    try {
      setIsProcessing(true);
      await db.exportData();
      alert('Base de données exportée avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Erreur lors de l\'export de la base de données');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    try {
      setIsProcessing(true);
      const success = await db.importData();
      if (success) {
        alert('Base de données importée avec succès ! La page va se recharger.');
        window.location.reload();
      } else {
        alert('Importation annulée ou échouée');
      }
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      alert('Erreur lors de l\'import de la base de données');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = async () => {
    try {
      setIsProcessing(true);
      await db.resetDatabase();
      setShowResetConfirm(false);
      alert('Base de données réinitialisée avec succès ! La page va se recharger.');
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      alert('Erreur lors de la réinitialisation de la base de données');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      {saved && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'var(--success)',
          color: 'white',
          padding: 'var(--spacing-md) var(--spacing-lg)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1000,
          animation: 'slideUp 0.3s'
        }}>
          Paramètres sauvegardés avec succès !
        </div>
      )}

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 className="card-title">Paramètres de l'entreprise</h2>
              <p className="card-description">
                Modifiez les informations de votre entreprise
              </p>
            </div>
            <button className="btn btn-primary" onClick={handleSave}>
              <Save size={20} />
              Enregistrer les modifications
            </button>
          </div>
        </div>
        <div className="card-body">
          <div style={{ maxWidth: '800px' }}>
            <h3 style={{ 
              marginBottom: 'var(--spacing-lg)',
              paddingBottom: 'var(--spacing-md)',
              borderBottom: '2px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)'
            }}>
              <Building2 size={24} />
              Informations générales
            </h3>

            <div className="form-group">
              <label className="form-label form-label-required">
                Nom de l'entreprise
              </label>
              <input
                type="text"
                className="form-input"
                value={companyInfo.name}
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
                Numéro d'identification fiscale
              </label>
              <input
                type="text"
                className="form-input"
                value={companyInfo.fiscalId}
                onChange={(e) => updateField('fiscalId', e.target.value)}
                placeholder="Ex: NIF123456789"
              />
              <p className="form-description">
                Numéro fiscal ou d'enregistrement (optionnel)
              </p>
            </div>

            <h3 style={{ 
              margin: 'var(--spacing-2xl) 0 var(--spacing-lg)',
              paddingBottom: 'var(--spacing-md)',
              borderBottom: '2px solid var(--border)'
            }}>
              Coordonnées de contact
            </h3>

            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label form-label-required">
                  Téléphone
                </label>
                <input
                  type="tel"
                  className="form-input"
                  value={companyInfo.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="Ex: +235 66 64 76 40"
                />
                <p className="form-description">
                  Numéro de téléphone principal
                </p>
                {errors.phone && <p className="form-error">{errors.phone}</p>}
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">
                  Email
                </label>
                <input
                  type="email"
                  className="form-input"
                  value={companyInfo.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="Ex: contact@boutique.com"
                />
                <p className="form-description">
                  Adresse email professionnelle
                </p>
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label form-label-required">
                Adresse physique
              </label>
              <textarea
                className="form-textarea"
                value={companyInfo.address}
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
                Site web
              </label>
              <input
                type="url"
                className="form-input"
                value={companyInfo.website}
                onChange={(e) => updateField('website', e.target.value)}
                placeholder="Ex: www.votreentreprise.com"
              />
              <p className="form-description">
                Site web de votre entreprise (optionnel)
              </p>
            </div>

            <h3 style={{ 
              margin: 'var(--spacing-2xl) 0 var(--spacing-lg)',
              paddingBottom: 'var(--spacing-md)',
              borderBottom: '2px solid var(--border)'
            }}>
              Logo et informations complémentaires
            </h3>

            <div className="form-group">
              <label className="form-label">
                Logo de l'entreprise
              </label>
              
              {companyInfo.logo && (
                <div style={{
                  marginBottom: 'var(--spacing-md)',
                  padding: 'var(--spacing-lg)',
                  background: 'var(--bg-main)',
                  borderRadius: 'var(--radius-lg)',
                  border: '2px dashed var(--border)',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  <img 
                    src={companyInfo.logo} 
                    alt="Logo" 
                    style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }}
                  />
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                className="form-input"
                onChange={handleLogoUpload}
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
                value={companyInfo.additionalInfo}
                onChange={(e) => updateField('additionalInfo', e.target.value)}
                placeholder="Ex: Slogan, informations bancaires, horaires d'ouverture..."
                rows={4}
              />
              <p className="form-description">
                Toute information additionnelle à afficher sur vos documents
              </p>
            </div>

            <div style={{
              marginTop: 'var(--spacing-xl)',
              padding: 'var(--spacing-lg)',
              background: 'var(--primary-light)',
              borderRadius: 'var(--radius-md)',
              borderLeft: '4px solid var(--primary)'
            }}>
              <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <Info size={20} style={{ color: 'var(--primary)' }} />
                <span>
                  Ces informations seront automatiquement utilisées dans vos factures 
                  et documents générés par le logiciel.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Database size={24} />
            <div>
              <h2 className="card-title">Gestion de la base de données</h2>
              <p className="card-description">
                Sauvegardez, restaurez ou réinitialisez vos données
              </p>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div style={{ maxWidth: '800px' }}>
            <div style={{
              padding: 'var(--spacing-lg)',
              background: 'var(--info-light)',
              borderRadius: 'var(--radius-md)',
              borderLeft: '4px solid var(--info)',
              marginBottom: 'var(--spacing-xl)'
            }}>
              <p style={{ margin: 0, display: 'flex', alignItems: 'start', gap: 'var(--spacing-sm)' }}>
                <Info size={20} style={{ color: 'var(--info)', flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Sauvegarde automatique :</strong> Une copie de votre base de données est 
                  créée automatiquement chaque jour au démarrage de l'application dans le dossier 
                  <code style={{ 
                    background: 'rgba(0,0,0,0.1)', 
                    padding: '2px 6px', 
                    borderRadius: '3px',
                    marginLeft: '4px'
                  }}>db_logimak</code>
                </span>
              </p>
            </div>

            <div className="grid grid-cols-3" style={{ marginBottom: 'var(--spacing-lg)' }}>
              <button 
                className="btn btn-outline" 
                onClick={handleExport}
                disabled={isProcessing}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: 'var(--spacing-sm)',
                  padding: 'var(--spacing-lg)'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'var(--success-light)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  <Download size={24} style={{ color: 'var(--success)' }} />
                </div>
                <span style={{ fontWeight: 600 }}>Exporter</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                  Sauvegarder la base de données
                </span>
              </button>

              <button 
                className="btn btn-outline" 
                onClick={handleImport}
                disabled={isProcessing}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: 'var(--spacing-sm)',
                  padding: 'var(--spacing-lg)'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'var(--info-light)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  <Upload size={24} style={{ color: 'var(--info)' }} />
                </div>
                <span style={{ fontWeight: 600 }}>Importer</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                  Restaurer une sauvegarde
                </span>
              </button>

              <button 
                className="btn btn-outline" 
                onClick={() => setShowResetConfirm(true)}
                disabled={isProcessing}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: 'var(--spacing-sm)',
                  padding: 'var(--spacing-lg)',
                  borderColor: 'var(--danger)',
                  color: 'var(--danger)'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'var(--danger-light)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  <RotateCcw size={24} style={{ color: 'var(--danger)' }} />
                </div>
                <span style={{ fontWeight: 600 }}>Réinitialiser</span>
                <span style={{ fontSize: '0.85rem', textAlign: 'center' }}>
                  Effacer toutes les données
                </span>
              </button>
            </div>

            <div style={{
              padding: 'var(--spacing-lg)',
              background: 'var(--bg-main)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)'
            }}>
              <h4 style={{ marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <Info size={18} />
                À propos des opérations
              </h4>
              <ul style={{ 
                margin: 0, 
                paddingLeft: 'var(--spacing-lg)', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 'var(--spacing-sm)',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem'
              }}>
                <li>
                  <strong>Exporter :</strong> Crée un fichier JSON contenant toutes vos données 
                  (produits, ventes, catégories, etc.)
                </li>
                <li>
                  <strong>Importer :</strong> Restaure les données depuis un fichier de sauvegarde. 
                  Remplace toutes les données actuelles.
                </li>
                <li>
                  <strong>Réinitialiser :</strong> Efface toutes les données commerciales 
                  (produits, ventes, stock) mais conserve les informations de l'entreprise.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmation pour la réinitialisation */}
      {showResetConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-xl)',
            maxWidth: '500px',
            width: '90%',
            boxShadow: 'var(--shadow-2xl)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-md)',
              marginBottom: 'var(--spacing-lg)'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'var(--danger-light)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertTriangle size={28} style={{ color: 'var(--danger)' }} />
              </div>
              <div>
                <h3 style={{ margin: 0, marginBottom: '0.25rem' }}>Confirmer la réinitialisation</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Cette action est irréversible
                </p>
              </div>
            </div>

            <div style={{
              padding: 'var(--spacing-md)',
              background: 'var(--danger-light)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--spacing-lg)',
              border: '1px solid var(--danger)'
            }}>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                ⚠️ Toutes vos données commerciales (produits, ventes, catégories, stock) 
                seront définitivement supprimées. Seules les informations de votre entreprise 
                seront conservées.
              </p>
            </div>

            <p style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--text-secondary)' }}>
              Il est fortement recommandé d'exporter une sauvegarde avant de continuer.
            </p>

            <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'flex-end' }}>
              <button 
                className="btn btn-outline" 
                onClick={() => setShowResetConfirm(false)}
                disabled={isProcessing}
              >
                Annuler
              </button>
              <button 
                className="btn" 
                onClick={handleReset}
                disabled={isProcessing}
                style={{ 
                  background: 'var(--danger)',
                  color: 'white'
                }}
              >
                {isProcessing ? 'Réinitialisation...' : 'Oui, réinitialiser'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">À propos de LOGIMAK</h2>
        </div>
        <div className="card-body">
          <div style={{ maxWidth: '800px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-lg)',
              marginBottom: 'var(--spacing-xl)'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                L
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>LOGIMAK</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Logiciel de gestion commerciale moderne
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Version 1.0.0
                </p>
              </div>
            </div>

            <div style={{
              padding: 'var(--spacing-lg)',
              background: 'var(--bg-main)',
              borderRadius: 'var(--radius-lg)',
              marginBottom: 'var(--spacing-lg)'
            }}>
              <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Développé par MakkaDev</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                <p style={{ margin: 0 }}>
                  <strong>Société:</strong> MakkaDev
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Siège:</strong> N'Djamena, Tchad
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Adresse:</strong> Quartier Chagoua, derrière l'Ambassade des États-Unis
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Site web:</strong>{' '}
                  <a href="https://www.makkadev.com" target="_blank" rel="noopener noreferrer"
                     style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                    www.makkadev.com
                  </a>
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:info@makkadev.com" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                    info@makkadev.com
                  </a>
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Téléphone:</strong> +235 66 64 76 40
                </p>
              </div>
            </div>

            <div style={{
              padding: 'var(--spacing-lg)',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 'var(--radius-lg)',
              color: 'white'
            }}>
              <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Vision</h4>
              <p style={{ margin: 0, lineHeight: 1.6 }}>
                Créer un logiciel de gestion commerciale local, moderne, élégant et performant, 
                capable de répondre aux besoins réels des commerçants et PME africaines tout en 
                offrant une expérience utilisateur de niveau professionnel.
              </p>
            </div>

            <div style={{ marginTop: 'var(--spacing-lg)', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p style={{ margin: 0 }}>
                © 2026 MakkaDev. Tous droits réservés.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

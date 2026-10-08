import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes,
  FaUpload,
  FaLink,
  FaImages,
  FaSave,
  FaStar,
  FaCheck,
  FaEye
} from 'react-icons/fa';
import {
  SPICE_CATEGORIES,
  PRESET_IMAGES,
  PRESET_COLORS
} from '../../data/defaultProducts';
import './ProductModal.css';

const ProductModal = ({ isOpen, onClose, onSave, productToEdit }) => {
  const isEditing = Boolean(productToEdit);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    subtitle: '',
    category: 'Ground Powders',
    price: '',
    unit: '50g',
    currency: 'Rs.',
    accentColor: '#D48C00',
    origin: '',
    aroma: '',
    description: '',
    image: '/saffron-hero.png',
    inStock: true,
    featured: false
  });

  const [imageMode, setImageMode] = useState('preset'); // 'upload' | 'url' | 'preset'
  const [imageFile, setImageFile] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState('/saffron-hero.png');
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Populate form on edit
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || '',
        subtitle: productToEdit.subtitle || '',
        category: productToEdit.category || 'Ground Powders',
        price: productToEdit.price || '',
        unit: productToEdit.unit || '50g',
        currency: productToEdit.currency || 'Rs.',
        accentColor: productToEdit.accentColor || '#D48C00',
        origin: productToEdit.origin || '',
        aroma: productToEdit.aroma || '',
        description: productToEdit.description || '',
        image: productToEdit.image || '/saffron-hero.png',
        inStock: productToEdit.inStock !== false,
        featured: Boolean(productToEdit.featured)
      });
      setPreviewImageUrl(productToEdit.image || '/saffron-hero.png');
      setImageFile(null);
      setImageMode('preset');
    } else {
      setFormData({
        name: '',
        subtitle: '',
        category: 'Ground Powders',
        price: '',
        unit: '50g',
        currency: 'Rs.',
        accentColor: '#D48C00',
        origin: '',
        aroma: '',
        description: '',
        image: '/saffron-hero.png',
        inStock: true,
        featured: false
      });
      setPreviewImageUrl('/saffron-hero.png');
      setImageFile(null);
      setImageMode('preset');
    }
    setValidationError('');
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setValidationError('Image size must be under 8MB');
        return;
      }
      setImageFile(file);
      const tempUrl = URL.createObjectURL(file);
      setPreviewImageUrl(tempUrl);
      setValidationError('');
    }
  };

  const handlePresetSelect = (path) => {
    setFormData((prev) => ({ ...prev, image: path }));
    setPreviewImageUrl(path);
    setImageFile(null);
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, image: url }));
    setPreviewImageUrl(url || '/saffron-hero.png');
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.name.trim()) {
      setValidationError('Product title / name is required.');
      return;
    }
    if (!formData.price.trim()) {
      setValidationError('Product price is required (e.g. 385.00).');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(formData, imageFile);
      onClose();
    } catch (err) {
      setValidationError(err.message || 'Failed to save product.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="product-modal-backdrop" onClick={onClose}>
        <motion.div
          className="product-modal-window"
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="product-modal-header">
            <div>
              <h3>{isEditing ? 'Edit Product' : 'Add New Spice Product'}</h3>
              <p className="modal-sub">
                {isEditing ? 'Update catalog details & pricing' : 'Create a fresh catalog item for Spicera'}
              </p>
            </div>
            <button className="modal-close-icon" onClick={onClose} aria-label="Close dialog">
              <FaTimes />
            </button>
          </div>

          {validationError && (
            <div className="modal-error-banner">
              <span>{validationError}</span>
            </div>
          )}

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="product-modal-form">
            <div className="modal-layout-grid">
              {/* Left Column: Form Fields */}
              <div className="modal-form-fields">
                <div className="form-group">
                  <label htmlFor="prod-name">Product Name *</label>
                  <input
                    id="prod-name"
                    name="name"
                    type="text"
                    placeholder="e.g. Premium Quality Ceylon Cinnamon Powder"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-row-two">
                  <div className="form-group">
                    <label htmlFor="prod-subtitle">Subtitle / Tagline</label>
                    <input
                      id="prod-subtitle"
                      name="subtitle"
                      type="text"
                      placeholder="e.g. The Warmth of a Tropical Dawn"
                      value={formData.subtitle}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="prod-category">Category</label>
                    <select
                      id="prod-category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                    >
                      {SPICE_CATEGORIES.filter((c) => c !== 'All Spices').map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row-three">
                  <div className="form-group">
                    <label htmlFor="prod-price">Price *</label>
                    <input
                      id="prod-price"
                      name="price"
                      type="text"
                      placeholder="e.g. 385.00"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="prod-unit">Unit / Pack</label>
                    <input
                      id="prod-unit"
                      name="unit"
                      type="text"
                      placeholder="e.g. 50g, 100g, 1g"
                      value={formData.unit}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="prod-currency">Currency</label>
                    <input
                      id="prod-currency"
                      name="currency"
                      type="text"
                      placeholder="Rs."
                      value={formData.currency}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Accent Color Selection */}
                <div className="form-group">
                  <label>Brand Accent Color</label>
                  <div className="color-preset-picker">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        className={`color-chip ${formData.accentColor === c.hex ? 'selected' : ''}`}
                        style={{ backgroundColor: c.hex }}
                        onClick={() => setFormData((prev) => ({ ...prev, accentColor: c.hex }))}
                        title={c.label}
                      >
                        {formData.accentColor === c.hex && <FaCheck />}
                      </button>
                    ))}
                    <input
                      type="color"
                      name="accentColor"
                      value={formData.accentColor}
                      onChange={handleInputChange}
                      className="custom-color-input"
                      title="Custom color picker"
                    />
                  </div>
                </div>

                <div className="form-row-two">
                  <div className="form-group">
                    <label htmlFor="prod-origin">Origin</label>
                    <input
                      id="prod-origin"
                      name="origin"
                      type="text"
                      placeholder="e.g. Southern Coastal Belt, Sri Lanka"
                      value={formData.origin}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="prod-aroma">Aroma Profile</label>
                    <input
                      id="prod-aroma"
                      name="aroma"
                      type="text"
                      placeholder="e.g. Sweet, Woody Warmth"
                      value={formData.aroma}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="prod-desc">Description & Culinary Notes</label>
                  <textarea
                    id="prod-desc"
                    name="description"
                    rows="3"
                    placeholder="Describe aroma, harvest method, health properties..."
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Switches */}
                <div className="form-switches-group">
                  <label className="switch-card">
                    <input
                      type="checkbox"
                      name="inStock"
                      checked={formData.inStock}
                      onChange={handleInputChange}
                    />
                    <div>
                      <strong>In Stock / Ready to Dispatch</strong>
                      <span>Available for immediate WhatsApp orders</span>
                    </div>
                  </label>

                  <label className="switch-card">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                    />
                    <div>
                      <strong><FaStar className="star-icon" /> Feature on Homepage</strong>
                      <span>Showcase in the curated home highlights grid</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Right Column: Image Selection & Real-time Live Preview */}
              <div className="modal-image-col">
                <label className="col-label">Product Image Selection</label>

                {/* Mode Tabs */}
                <div className="image-mode-tabs">
                  <button
                    type="button"
                    className={imageMode === 'preset' ? 'active' : ''}
                    onClick={() => setImageMode('preset')}
                  >
                    <FaImages /> Presets
                  </button>
                  <button
                    type="button"
                    className={imageMode === 'upload' ? 'active' : ''}
                    onClick={() => setImageMode('upload')}
                  >
                    <FaUpload /> Upload
                  </button>
                  <button
                    type="button"
                    className={imageMode === 'url' ? 'active' : ''}
                    onClick={() => setImageMode('url')}
                  >
                    <FaLink /> Web URL
                  </button>
                </div>

                {/* Preset Picker */}
                {imageMode === 'preset' && (
                  <div className="preset-grid">
                    {PRESET_IMAGES.map((img) => (
                      <div
                        key={img.path}
                        className={`preset-thumb ${formData.image === img.path ? 'active' : ''}`}
                        onClick={() => handlePresetSelect(img.path)}
                      >
                        <img src={img.path} alt={img.label} />
                        <span>{img.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* File Upload */}
                {imageMode === 'upload' && (
                  <div className="upload-dropzone">
                    <input
                      type="file"
                      id="image-file-input"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="image-file-input" className="upload-label">
                      <FaUpload className="upload-icon" />
                      <span>{imageFile ? imageFile.name : 'Choose an image file from device'}</span>
                      <small>PNG, JPG, WEBP up to 8MB</small>
                    </label>
                  </div>
                )}

                {/* Web URL */}
                {imageMode === 'url' && (
                  <div className="url-input-wrap">
                    <input
                      type="url"
                      placeholder="https://example.com/spice-image.png"
                      value={formData.image.startsWith('http') ? formData.image : ''}
                      onChange={handleUrlChange}
                    />
                  </div>
                )}

                {/* Live Card Preview */}
                <div className="live-preview-box">
                  <div className="preview-tag">
                    <FaEye /> Live Card Preview
                  </div>
                  <div className="preview-card-mockup">
                    <div
                      className="mockup-accent-bar"
                      style={{ backgroundColor: formData.accentColor || '#D48C00' }}
                    />
                    <div className="mockup-img-wrap">
                      <img
                        src={previewImageUrl || '/saffron-hero.png'}
                        alt="Preview"
                        onError={(e) => {
                          e.target.src = '/saffron-hero.png';
                        }}
                      />
                    </div>
                    <div className="mockup-info">
                      <span className="mockup-badge">{formData.category}</span>
                      <h4>{formData.name || 'Sample Spice Name'}</h4>
                      <p className="mockup-price">
                        {formData.currency || 'Rs.'} {formData.price || '0.00'}
                        {formData.unit && ` / ${formData.unit}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="product-modal-actions">
              <button
                type="button"
                className="modal-cancel-btn"
                onClick={onClose}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="modal-save-btn"
                disabled={isSaving}
              >
                {isSaving ? (
                  <span className="spinner-inline"></span>
                ) : (
                  <>
                    <FaSave /> {isEditing ? 'Save Changes' : 'Create Product'}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductModal;

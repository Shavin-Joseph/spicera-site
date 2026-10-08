import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaPlus,
  FaSearch,
  FaSignOutAlt,
  FaEdit,
  FaTrash,
  FaStar,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaDatabase,
  FaBoxes,
  FaExternalLinkAlt,
  FaShieldAlt,
  FaExclamationTriangle
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import {
  subscribeProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  seedDefaultProductsToFirestore
} from '../../firebase/productsService';
import { SPICE_CATEGORIES } from '../../data/defaultProducts';
import ProductModal from './ProductModal';
import ProductQuickView from '../../components/ProductQuickView';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [isFallback, setIsFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Subscribe to real-time products
  useEffect(() => {
    const unsubscribe = subscribeProducts(
      (data, fallbackStatus) => {
        setProducts(data);
        setIsFallback(fallbackStatus);
        setIsLoading(false);
      },
      (error) => {
        console.warn('Dashboard subscription notice:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  // Open modal for add
  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  // Open modal for edit
  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // Save (Create or Update)
  const handleSaveProduct = async (formData, imageFile) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, formData, imageFile);
      showNotification(`"${formData.name}" updated successfully.`);
    } else {
      await addProduct(formData, imageFile);
      showNotification(`"${formData.name}" added to catalog.`);
    }
  };

  // Toggle in-stock instantly
  const handleToggleStock = async (product) => {
    try {
      const newStatus = !product.inStock;
      await updateProduct(product.id, { ...product, inStock: newStatus });
      showNotification(
        `Marked "${product.name.slice(0, 20)}..." as ${newStatus ? 'In Stock' : 'Out of Stock'}`
      );
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // Toggle featured status instantly
  const handleToggleFeatured = async (product) => {
    try {
      const newStatus = !product.featured;
      await updateProduct(product.id, { ...product, featured: newStatus });
      showNotification(
        `"${product.name.slice(0, 20)}..." ${newStatus ? 'featured on Home' : 'removed from Home featured'}`
      );
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await deleteProduct(productToDelete.id, productToDelete.image);
      showNotification(`Product "${productToDelete.name}" deleted.`, 'info');
      setProductToDelete(null);
    } catch (err) {
      showNotification(err.message || 'Failed to delete product', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // One-click seed default products to Firestore
  const handleSeedDefaults = async () => {
    if (!window.confirm('Populate initial Spicera spices (Saffron, Cinnamon, Pepper, Moringa, Turmeric) into Firestore?')) {
      return;
    }
    setIsSeeding(true);
    try {
      await seedDefaultProductsToFirestore();
      showNotification('Successfully seeded 5 initial spices into Firestore database!');
    } catch (err) {
      showNotification(`Seeding error: ${err.message}`, 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter((prod) => {
    const matchesCategory =
      selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      prod.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate statistics
  const totalCount = products.length;
  const inStockCount = products.filter((p) => p.inStock !== false).length;
  const featuredCount = products.filter((p) => p.featured).length;

  return (
    <div className="admin-dashboard-root">
      {/* Top Navigation */}
      <header className="admin-topbar">
        <div className="topbar-brand">
          <img src="/logo.png" alt="Spicera Logo" className="admin-logo-img" />
          <div>
            <h2>Spicera Admin</h2>
            <span className="brand-security-tag">
              <FaShieldAlt /> Verified Admin Session
            </span>
          </div>
        </div>

        <div className="topbar-actions">
          <Link to="/" className="view-store-btn" target="_blank" rel="noopener noreferrer">
            <FaExternalLinkAlt /> <span>View Store</span>
          </Link>

          <div className="admin-user-pill">
            <span className="user-email-text">{currentUser?.email}</span>
          </div>

          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
            title="Sign Out"
            aria-label="Sign Out"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="admin-main-container">
        {/* Alerts / Notifications */}
        {notification && (
          <div className={`admin-toast ${notification.type}`}>
            <span>{notification.msg}</span>
          </div>
        )}

        {isFallback && (
          <div className="firestore-seed-banner">
            <div className="banner-text">
              <FaDatabase className="banner-icon" />
              <div>
                <strong>Firestore Database Notice</strong>
                <p>
                  Displaying built-in product catalog. Click "Populate into Firestore" below to write
                  these items directly into your Firebase cloud database.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="seed-btn"
              onClick={handleSeedDefaults}
              disabled={isSeeding}
            >
              {isSeeding ? 'Writing to Firestore...' : 'Populate into Firestore'}
            </button>
          </div>
        )}

        {/* Stats Row */}
        <section className="admin-stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrap total">
              <FaBoxes />
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Products</span>
              <h3 className="stat-number">{totalCount}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap stock">
              <FaCheckCircle />
            </div>
            <div className="stat-info">
              <span className="stat-label">In Stock</span>
              <h3 className="stat-number">{inStockCount}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap star">
              <FaStar />
            </div>
            <div className="stat-info">
              <span className="stat-label">Featured on Home</span>
              <h3 className="stat-number">{featuredCount}</h3>
            </div>
          </div>
        </section>

        {/* Action Bar */}
        <section className="admin-controls-card">
          <div className="controls-search-row">
            <div className="admin-search-wrap">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search products by title or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                >
                  Clear
                </button>
              )}
            </div>

            <button
              type="button"
              className="add-new-spice-btn"
              onClick={handleAddNew}
            >
              <FaPlus /> <span>Add New Spice</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="admin-category-pills">
            <button
              type="button"
              className={`cat-pill ${selectedCategory === 'All' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('All')}
            >
              All Categories ({products.length})
            </button>
            {SPICE_CATEGORIES.filter((c) => c !== 'All Spices').map((cat) => (
              <button
                key={cat}
                type="button"
                className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Product Catalog List / Table */}
        <section className="admin-products-table-section">
          {isLoading ? (
            <div className="admin-loading-box">
              <div className="admin-spinner"></div>
              <p>Loading spice inventory...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="admin-empty-catalog">
              <FaBoxes className="empty-icon" />
              <h3>No products found</h3>
              <p>Try clearing your search filters or click "Add New Spice" to create one.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="desktop-table-container">
                <table className="admin-products-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price / Unit</th>
                      <th>Stock</th>
                      <th>Featured</th>
                      <th className="actions-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id}>
                        <td className="product-cell">
                          <div
                            className="color-indicator-bar"
                            style={{ backgroundColor: prod.accentColor || '#D48C00' }}
                          />
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="table-prod-img"
                            onError={(e) => {
                              e.target.src = '/saffron-hero.png';
                            }}
                          />
                          <div className="prod-name-meta">
                            <strong>{prod.name}</strong>
                            {prod.subtitle && <small>{prod.subtitle}</small>}
                          </div>
                        </td>

                        <td>
                          <span className="category-tag">{prod.category || 'General'}</span>
                        </td>

                        <td>
                          <span className="price-tag">
                            {prod.currency || 'Rs.'} {prod.price}
                          </span>
                          <span className="unit-tag"> / {prod.unit || 'pack'}</span>
                        </td>

                        <td>
                          <button
                            type="button"
                            className={`status-toggle-btn ${prod.inStock !== false ? 'in' : 'out'}`}
                            onClick={() => handleToggleStock(prod)}
                            title="Click to toggle stock status"
                          >
                            {prod.inStock !== false ? (
                              <>
                                <FaCheckCircle /> In Stock
                              </>
                            ) : (
                              <>
                                <FaTimesCircle /> Out of Stock
                              </>
                            )}
                          </button>
                        </td>

                        <td>
                          <button
                            type="button"
                            className={`featured-star-btn ${prod.featured ? 'is-featured' : ''}`}
                            onClick={() => handleToggleFeatured(prod)}
                            title="Click to toggle featured on Home"
                          >
                            <FaStar />
                          </button>
                        </td>

                        <td className="actions-cell">
                          <button
                            type="button"
                            className="action-icon-btn preview"
                            onClick={() => setPreviewProduct(prod)}
                            title="Preview details"
                          >
                            <FaEye />
                          </button>

                          <button
                            type="button"
                            className="action-icon-btn edit"
                            onClick={() => handleEdit(prod)}
                            title="Edit product"
                          >
                            <FaEdit />
                          </button>

                          <button
                            type="button"
                            className="action-icon-btn delete"
                            onClick={() => setProductToDelete(prod)}
                            title="Delete product"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards View */}
              <div className="mobile-cards-container">
                {filteredProducts.map((prod) => (
                  <div key={prod.id} className="mobile-product-card">
                    <div
                      className="card-accent"
                      style={{ backgroundColor: prod.accentColor || '#D48C00' }}
                    />
                    <div className="mobile-card-header">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="mobile-card-img"
                        onError={(e) => {
                          e.target.src = '/saffron-hero.png';
                        }}
                      />
                      <div className="mobile-card-title-group">
                        <span className="category-tag">{prod.category || 'General'}</span>
                        <h4>{prod.name}</h4>
                        <div className="mobile-price-row">
                          <span className="price-tag">
                            {prod.currency || 'Rs.'} {prod.price}
                          </span>
                          <span className="unit-tag"> / {prod.unit || 'pack'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mobile-card-status-bar">
                      <button
                        type="button"
                        className={`status-toggle-btn ${prod.inStock !== false ? 'in' : 'out'}`}
                        onClick={() => handleToggleStock(prod)}
                      >
                        {prod.inStock !== false ? (
                          <>
                            <FaCheckCircle /> In Stock
                          </>
                        ) : (
                          <>
                            <FaTimesCircle /> Out of Stock
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        className={`featured-star-btn ${prod.featured ? 'is-featured' : ''}`}
                        onClick={() => handleToggleFeatured(prod)}
                      >
                        <FaStar /> {prod.featured ? 'Featured' : 'Standard'}
                      </button>
                    </div>

                    <div className="mobile-card-actions">
                      <button
                        type="button"
                        className="mobile-action-btn preview"
                        onClick={() => setPreviewProduct(prod)}
                      >
                        <FaEye /> Preview
                      </button>
                      <button
                        type="button"
                        className="mobile-action-btn edit"
                        onClick={() => handleEdit(prod)}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        type="button"
                        className="mobile-action-btn delete"
                        onClick={() => setProductToDelete(prod)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      {/* Floating Add Button for Mobile Thumb Access */}
      <button
        type="button"
        className="mobile-floating-add-btn"
        onClick={handleAddNew}
        aria-label="Add New Spice"
      >
        <FaPlus />
      </button>

      {/* Add / Edit Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={editingProduct}
      />

      {/* Quick View Modal */}
      <ProductQuickView
        product={previewProduct}
        isOpen={Boolean(previewProduct)}
        onClose={() => setPreviewProduct(null)}
      />

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="delete-confirm-backdrop" onClick={() => setProductToDelete(null)}>
          <div className="delete-confirm-box" onClick={(e) => e.stopPropagation()}>
            <div className="delete-icon-circle">
              <FaExclamationTriangle />
            </div>
            <h3>Remove Spice Product?</h3>
            <p>
              Are you sure you want to permanently delete{' '}
              <strong>"{productToDelete.name}"</strong>? This action removes it from the store catalog
              and cannot be undone.
            </p>
            <div className="delete-confirm-actions">
              <button
                type="button"
                className="cancel-delete-btn"
                onClick={() => setProductToDelete(null)}
                disabled={isDeleting}
              >
                Keep Product
              </button>
              <button
                type="button"
                className="confirm-delete-btn"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

// Utility functions for article operations

export const articleUtils = {
  // Calculate price with TVA
  calculatePriceWithTVA: (price, tvaRate) => {
    if (!price || !tvaRate || isNaN(price) || isNaN(tvaRate)) return 0;
    const numPrice = parseFloat(price);
    const numTva = parseFloat(tvaRate);
    return parseFloat((numPrice + (numPrice * numTva / 100)).toFixed(2));
  },

  // Calculate profit margin percentage
  calculateProfitMargin: (sellingPrice, purchasePrice) => {
    if (!sellingPrice || !purchasePrice || purchasePrice === 0 || isNaN(sellingPrice) || isNaN(purchasePrice)) return 0;
    const numSellingPrice = parseFloat(sellingPrice);
    const numPurchasePrice = parseFloat(purchasePrice);
    return parseFloat(((numSellingPrice - numPurchasePrice) / numPurchasePrice * 100).toFixed(2));
  },

  // Calculate profit amount
  calculateProfitAmount: (sellingPrice, purchasePrice) => {
    if (!sellingPrice || !purchasePrice || isNaN(sellingPrice) || isNaN(purchasePrice)) return 0;
    const numSellingPrice = parseFloat(sellingPrice);
    const numPurchasePrice = parseFloat(purchasePrice);
    return parseFloat((numSellingPrice - numPurchasePrice).toFixed(2));
  },

  // Format currency (MAD)
  formatCurrency: (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) return '0.00 MAD';
    return `${parseFloat(amount).toFixed(2)} MAD`;
  },

  // Format percentage
  formatPercentage: (percentage) => {
    if (percentage === null || percentage === undefined || isNaN(percentage)) return '0.00%';
    return `${parseFloat(percentage).toFixed(2)}%`;
  },

  // Validate article reference format
  validateReference: (reference) => {
    if (!reference || typeof reference !== 'string') return false;
    // Reference should be at least 2 characters, alphanumeric with possible hyphens/underscores
    const referenceRegex = /^[A-Za-z0-9_-]{2,20}$/;
    return referenceRegex.test(reference.trim());
  },

  // Generate article reference suggestion
  generateReference: (designation) => {
    if (!designation) return '';
    
    // Take first 3 letters of designation and add random numbers
    const letters = designation.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase();
    const numbers = Math.floor(Math.random() * 9000) + 1000; // 4-digit number
    
    return `${letters}${numbers}`;
  },

  // Check if article is low stock
  isLowStock: (currentStock, securityStock) => {
    if (currentStock === null || currentStock === undefined || isNaN(currentStock)) return true;
    if (securityStock === null || securityStock === undefined || isNaN(securityStock)) return false;
    return parseInt(currentStock) <= parseInt(securityStock);
  },

  // Calculate stock status
  getStockStatus: (currentStock, securityStock) => {
    if (currentStock === null || currentStock === undefined || isNaN(currentStock)) {
      return { status: 'unknown', color: 'gray', message: 'Stock unknown' };
    }
    
    const numCurrentStock = parseInt(currentStock);
    const numSecurityStock = parseInt(securityStock) || 0;
    
    if (numCurrentStock === 0) {
      return { status: 'out', color: 'red', message: 'Out of stock' };
    }
    
    if (numCurrentStock <= numSecurityStock) {
      return { status: 'low', color: 'yellow', message: 'Low stock' };
    }
    
    return { status: 'good', color: 'green', message: 'In stock' };
  },

  // Validate article data
  validateArticleData: (articleData) => {
    const errors = {};

    // Reference validation
    if (!articleData.reference?.trim()) {
      errors.reference = 'Reference is required';
    } else if (!articleUtils.validateReference(articleData.reference)) {
      errors.reference = 'Reference must be 2-20 alphanumeric characters';
    }

    // Designation validation
    if (!articleData.designation?.trim()) {
      errors.designation = 'Designation is required';
    } else if (articleData.designation.trim().length < 2) {
      errors.designation = 'Designation must be at least 2 characters';
    }

    // Stock security validation
    if (articleData.stockSecurite === null || articleData.stockSecurite === undefined || articleData.stockSecurite === '') {
      errors.stockSecurite = 'Stock sécurité is required';
    } else if (isNaN(articleData.stockSecurite) || parseInt(articleData.stockSecurite) < 0) {
      errors.stockSecurite = 'Stock sécurité must be a positive number';
    }

    // Purchase price validation
    if (articleData.prixDAchatHT === null || articleData.prixDAchatHT === undefined || articleData.prixDAchatHT === '') {
      errors.prixDAchatHT = 'Prix d\'achat HT is required';
    } else if (isNaN(articleData.prixDAchatHT) || parseFloat(articleData.prixDAchatHT) < 0) {
      errors.prixDAchatHT = 'Prix d\'achat HT must be a positive number';
    }

    // Selling price validation
    if (articleData.prixDeVenteHT === null || articleData.prixDeVenteHT === undefined || articleData.prixDeVenteHT === '') {
      errors.prixDeVenteHT = 'Prix de vente HT is required';
    } else if (isNaN(articleData.prixDeVenteHT) || parseFloat(articleData.prixDeVenteHT) < 0) {
      errors.prixDeVenteHT = 'Prix de vente HT must be a positive number';
    }

    // TVA validation
    if (articleData.tva === null || articleData.tva === undefined || articleData.tva === '') {
      errors.tva = 'TVA is required';
    } else if (isNaN(articleData.tva) || parseFloat(articleData.tva) < 0 || parseFloat(articleData.tva) > 100) {
      errors.tva = 'TVA must be between 0 and 100';
    }

    // Business logic validation
    if (articleData.prixDAchatHT && articleData.prixDeVenteHT) {
      if (parseFloat(articleData.prixDAchatHT) >= parseFloat(articleData.prixDeVenteHT)) {
        errors.prixDeVenteHT = 'Prix de vente must be higher than prix d\'achat';
      }
    }

    // Image URL validation (if provided)
    if (articleData.image && articleData.image.trim()) {
      try {
        new URL(articleData.image);
      } catch {
        errors.image = 'Image must be a valid URL';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Sort articles by different criteria
  sortArticles: (articles, sortBy, sortOrder = 'asc') => {
    if (!Array.isArray(articles)) return [];

    return [...articles].sort((a, b) => {
      let valueA, valueB;

      switch (sortBy) {
        case 'reference':
          valueA = (a.reference || '').toLowerCase();
          valueB = (b.reference || '').toLowerCase();
          break;
        case 'designation':
          valueA = (a.designation || '').toLowerCase();
          valueB = (b.designation || '').toLowerCase();
          break;
        case 'stockSecurite':
          valueA = parseInt(a.stockSecurite) || 0;
          valueB = parseInt(b.stockSecurite) || 0;
          break;
        case 'prixDAchatHT':
          valueA = parseFloat(a.prixDAchatHT) || 0;
          valueB = parseFloat(b.prixDAchatHT) || 0;
          break;
        case 'prixDeVenteHT':
          valueA = parseFloat(a.prixDeVenteHT) || 0;
          valueB = parseFloat(b.prixDeVenteHT) || 0;
          break;
        case 'tva':
          valueA = parseFloat(a.tva) || 0;
          valueB = parseFloat(b.tva) || 0;
          break;
        case 'profitMargin':
          valueA = articleUtils.calculateProfitMargin(a.prixDeVenteHT, a.prixDAchatHT);
          valueB = articleUtils.calculateProfitMargin(b.prixDeVenteHT, b.prixDAchatHT);
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    });
  },

  // Filter articles by search term
  filterArticles: (articles, searchTerm) => {
    if (!Array.isArray(articles) || !searchTerm) return articles;

    const term = searchTerm.toLowerCase().trim();
    
    return articles.filter(article => 
      (article.reference || '').toLowerCase().includes(term) ||
      (article.designation || '').toLowerCase().includes(term)
    );
  },

  // Export articles to CSV format
  exportToCSV: (articles) => {
    if (!Array.isArray(articles) || articles.length === 0) return '';

    const headers = [
      'Reference',
      'Designation',
      'Stock Sécurité',
      'Prix d\'Achat HT (MAD)',
      'Prix de Vente HT (MAD)',
      'TVA (%)',
      'Prix d\'Achat TTC (MAD)',
      'Prix de Vente TTC (MAD)',
      'Marge Bénéficiaire (%)',
      'Image URL'
    ];

    const csvContent = [
      headers.join(','),
      ...articles.map(article => [
        `"${article.reference || ''}"`,
        `"${article.designation || ''}"`,
        article.stockSecurite || 0,
        article.prixDAchatHT || 0,
        article.prixDeVenteHT || 0,
        article.tva || 0,
        articleUtils.calculatePriceWithTVA(article.prixDAchatHT, article.tva),
        articleUtils.calculatePriceWithTVA(article.prixDeVenteHT, article.tva),
        articleUtils.calculateProfitMargin(article.prixDeVenteHT, article.prixDAchatHT),
        `"${article.image || ''}"`
      ].join(','))
    ].join('\n');

    return csvContent;
  },

  // Download CSV file
  downloadCSV: (articles, filename = 'articles.csv') => {
    const csvContent = articleUtils.exportToCSV(articles);
    if (!csvContent) {
      alert('No data to export');
      return;
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  },

  // Get article statistics
  getStatistics: (articles) => {
    if (!Array.isArray(articles) || articles.length === 0) {
      return {
        totalArticles: 0,
        averagePurchasePrice: 0,
        averageSellingPrice: 0,
        averageProfitMargin: 0,
        lowStockCount: 0,
        totalInventoryValue: 0
      };
    }

    const totalArticles = articles.length;
    
    const totalPurchasePrice = articles.reduce((sum, article) => sum + (parseFloat(article.prixDAchatHT) || 0), 0);
    const averagePurchasePrice = totalPurchasePrice / totalArticles;
    
    const totalSellingPrice = articles.reduce((sum, article) => sum + (parseFloat(article.prixDeVenteHT) || 0), 0);
    const averageSellingPrice = totalSellingPrice / totalArticles;
    
    const profitMargins = articles.map(article => 
      articleUtils.calculateProfitMargin(article.prixDeVenteHT, article.prixDAchatHT)
    );
    const averageProfitMargin = profitMargins.reduce((sum, margin) => sum + margin, 0) / totalArticles;
    
    const lowStockCount = articles.filter(article => 
      articleUtils.isLowStock(article.stockSecurite, article.stockSecurite)
    ).length;
    
    const totalInventoryValue = articles.reduce((sum, article) => 
      sum + ((parseFloat(article.prixDAchatHT) || 0) * (parseInt(article.stockSecurite) || 0)), 0
    );

    return {
      totalArticles,
      averagePurchasePrice: parseFloat(averagePurchasePrice.toFixed(2)),
      averageSellingPrice: parseFloat(averageSellingPrice.toFixed(2)),
      averageProfitMargin: parseFloat(averageProfitMargin.toFixed(2)),
      lowStockCount,
      totalInventoryValue: parseFloat(totalInventoryValue.toFixed(2))
    };
  },

  // Sanitize input data
  sanitizeArticleData: (data) => {
    if (!data || typeof data !== 'object') return {};
    
    return {
      reference: (data.reference || '').toString().trim(),
      designation: (data.designation || '').toString().trim(),
      stockSecurite: parseInt(data.stockSecurite) || 0,
      prixDAchatHT: parseFloat(data.prixDAchatHT) || 0,
      prixDeVenteHT: parseFloat(data.prixDeVenteHT) || 0,
      tva: parseFloat(data.tva) || 0,
      image: (data.image || '').toString().trim()
    };
  }
};

export default articleUtils;
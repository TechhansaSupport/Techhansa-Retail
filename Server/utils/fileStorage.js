const fs = require('fs');
const path = require('path');

/**
 * Ensures the directory exists and saves the data as a JSON file.
 * 
 * @param {string} identifier - The identifier for the channel partner (e.g., CompanyName or UserId)
 * @param {string} subFolder - The subfolder name ('rfps', 'quotations', 'orders', 'invoices', or '')
 * @param {string} fileName - The name of the file to save (e.g., 'RFP-123.json')
 * @param {object} data - The data payload to save as JSON
 */
function saveChannelPartnerJSON(identifier, subFolder, fileName, data) {
  try {
    const safeIdentifier = (identifier || 'unknown').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    
    // Base path: uploads/channel/<identifier>
    const basePath = path.join(__dirname, '../uploads/channel', safeIdentifier);
    
    // Sub folder path
    const targetPath = subFolder ? path.join(basePath, subFolder) : basePath;

    // Create directories recursively if they don't exist
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true });
    }

    const filePath = path.join(targetPath, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    return filePath;
  } catch (err) {
    console.error(`Failed to save channel partner data for ${identifier}:`, err);
    return null;
  }
}

/**
 * Helper to get the upload directory for a channel partner's documents.
 */
function getChannelPartnerUploadDir(identifier) {
  const safeIdentifier = (identifier || 'unknown').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  const docPath = path.join(__dirname, '../uploads/channel', safeIdentifier, 'documents');
  
  if (!fs.existsSync(docPath)) {
    fs.mkdirSync(docPath, { recursive: true });
  }
  
  return docPath;
}

module.exports = {
  saveChannelPartnerJSON,
  getChannelPartnerUploadDir
};

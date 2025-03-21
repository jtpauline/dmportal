// Removed authentication-based access control
export const AccessControl = {
  // Previously would check user permissions
  // Now provides open access to all resources
  checkAccess: () => true,
  
  // Simplified access model
  getAllowedResources: () => ['campaigns', 'characters', 'spells']
};

// Client-side validation utilities

export const validateSignupForm = (formData) => {
  const errors = [];

  // First name validation
  if (!formData.firstName || formData.firstName.trim().length < 2) {
    errors.push('First name must be at least 2 characters long');
  }
  if (formData.firstName && formData.firstName.trim().length > 50) {
    errors.push('First name must be less than 50 characters');
  }

  // Last name validation
  if (!formData.lastName || formData.lastName.trim().length < 2) {
    errors.push('Last name must be at least 2 characters long');
  }
  if (formData.lastName && formData.lastName.trim().length > 50) {
    errors.push('Last name must be less than 50 characters');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !emailRegex.test(formData.email)) {
    errors.push('Please enter a valid email address');
  }

  // Password validation
  if (!formData.password || formData.password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (formData.password) {
    if (!/[a-z]/.test(formData.password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[A-Z]/.test(formData.password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/\d/.test(formData.password)) {
      errors.push('Password must contain at least one number');
    }
  }

  // Password confirmation
  if (formData.password !== formData.confirmPassword) {
    errors.push('Passwords do not match');
  }

  return errors;
};

export const validateLoginForm = (formData) => {
  const errors = [];

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !emailRegex.test(formData.email)) {
    errors.push('Please enter a valid email address');
  }

  // Password validation
  if (!formData.password) {
    errors.push('Password is required');
  }

  return errors;
};

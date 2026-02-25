export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validators = {
  email: (email: string): ValidationResult => {
    if (!email) {
      return { isValid: false, error: "Email is required" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: "Please enter a valid email address" };
    }

    return { isValid: true };
  },

  password: (password: string): ValidationResult => {
    if (!password) {
      return { isValid: false, error: "Password is required" };
    }

    if (password.length < 8) {
      return {
        isValid: false,
        error: "Password must be at least 8 characters long",
      };
    }

    if (!/[A-Z]/.test(password)) {
      return {
        isValid: false,
        error: "Password must contain at least one uppercase letter",
      };
    }

    if (!/[a-z]/.test(password)) {
      return {
        isValid: false,
        error: "Password must contain at least one lowercase letter",
      };
    }

    if (!/[0-9]/.test(password)) {
      return {
        isValid: false,
        error: "Password must contain at least one number",
      };
    }

    return { isValid: true };
  },

  passwordMatch: (
    password: string,
    confirmPassword: string,
  ): ValidationResult => {
    if (password !== confirmPassword) {
      return { isValid: false, error: "Passwords do not match" };
    }
    return { isValid: true };
  },

  name: (name: string, fieldName: string = "Name"): ValidationResult => {
    if (!name) {
      return { isValid: false, error: `${fieldName} is required` };
    }

    if (name.length < 2) {
      return {
        isValid: false,
        error: `${fieldName} must be at least 2 characters long`,
      };
    }

    if (!/^[a-zA-Z\s'-]+$/.test(name)) {
      return {
        isValid: false,
        error: `${fieldName} contains invalid characters`,
      };
    }

    return { isValid: true };
  },

  required: (value: string, fieldName: string = "Field"): ValidationResult => {
    if (!value || value.trim() === "") {
      return { isValid: false, error: `${fieldName} is required` };
    }
    return { isValid: true };
  },
};

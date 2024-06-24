export const validateForm = (formData, action, role) => {
  let errors = {};

  if (!formData.email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@(student\.polsl\.pl|polsl\.pl)$/.test(formData.email)) {
    errors.email = "Incorrect email";
  }

  if (!formData.currentPassword) {
    errors.currentPassword = "Current password is required";
  }

  // New password is required during edit
  if (action === "Edit") {
    if (!formData.password) {
      errors.password = "New password is required";
    } else if (
      formData.password.length < 8 ||
      !/[A-Z]/.test(formData.password) ||
      !/[a-z]/.test(formData.password) ||
      !/[0-9]/.test(formData.password)
    ) {
      errors.password =
        "Password must be at least 8 characters long and include uppercase letters, lowercase letters, and numbers";
    } else if (formData.password === formData.currentPassword) {
      errors.password =
        "New password cannot be the same as the current password";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
  }

  if (!formData.userFirstName) {
    errors.userFirstName = "First Name is required";
  } else if (/[^a-zA-Z]/.test(formData.userFirstName)) {
    errors.userFirstName = "First Name can only contain letters";
  }

  if (!formData.userLastName) {
    errors.userLastName = "Last Name is required";
  } else if (/[^a-zA-Z]/.test(formData.userLastName)) {
    errors.userLastName = "Last Name can only contain letters";
  }

  return errors;
};

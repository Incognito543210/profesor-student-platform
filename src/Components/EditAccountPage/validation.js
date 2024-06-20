export const validateForm = (formData, action, role) => {
  let errors = {};

  if (!formData.email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@(student\.polsl\.pl|polsl\.pl)$/.test(formData.email)) {
    if (action === "Sign Up") {
      errors.email =
        "Email must be in the form [something]@student.polsl.pl or [something]@polsl.pl";
    } else {
      errors.email = "Incorrect email";
    }
  }

  if (!formData.password) {
    errors.password = "Password is required";
  } else if (
    formData.password.length < 8 ||
    !/[A-Z]/.test(formData.password) ||
    !/[a-z]/.test(formData.password) ||
    !/[0-9]/.test(formData.password)
  ) {
    if (action === "Sign Up") {
      errors.password =
        "Password must be at least 8 characters long and include uppercase letters, lowercase letters, and numbers";
    } else {
      errors.password = "Incorrect password";
    }
  }

  if (action === "Sign Up") {
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

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!role) {
      errors.role = "Role is required";
    }
  }

  return errors;
};

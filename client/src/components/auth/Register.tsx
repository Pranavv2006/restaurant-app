import { useState } from "react";
import { authService, type RegisterData } from "../../services/AuthService";

interface RegisterProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
  onSuccess: (name: string) => void;
}

const Register = ({ onClose, onSwitchToLogin, onSuccess }: RegisterProps) => {
  const [formData, setFormData] = useState<RegisterData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    roleType: "Customer",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // ✅ Added proper error state

  // handle text input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // ✅ Clear error when user starts typing
    if (error) setError('');
  };

  // handle role radio buttons
  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      roleType: e.target.value as RegisterData["roleType"],
    }));
  };

  const handleSwitchToLogin = () => {
    onClose();
    onSwitchToLogin();
  };

  // ✅ Client-side validation function
  const validateForm = () => {
    if (!formData.firstName.trim()) {
      throw new Error('First name is required');
    }
    if (!formData.lastName.trim()) {
      throw new Error('Last name is required');
    }
    if (!formData.email.trim()) {
      throw new Error('Email is required');
    }
    if (!formData.password) {
      throw new Error('Password is required');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      throw new Error('Please enter a valid email address');
    }

    // Password validation
    if (formData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
  };

  // handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // ✅ Clear previous errors

    try {
      // ✅ Client-side validation
      validateForm();

      console.log('Submitting registration:', formData);
      
      const response = await authService.register(formData);

      if (response.success) {
        // ✅ Reset form after success
        setFormData({
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          roleType: "Customer",
        });
        
        // ✅ Trigger success modal with firstName
        onSuccess(formData.firstName);
        onClose(); // ✅ Close register modal
      } else {
        setError(response.message || "Registration failed.");
      }
    } catch (err: any) {
      console.error("Registration failed:", err.message);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-200 rounded-xl shadow-2xl max-w-lg w-full m-3 dark:bg-neutral-900 dark:border-neutral-800">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h3 className="block text-2xl font-bold text-gray-800 dark:text-neutral-200">Sign up</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
              Already have an account?
              <button
                type="button"
                onClick={handleSwitchToLogin}
                className="cursor-pointer text-violet-600 hover:underline dark:text-violet-500 ml-1"
              >
                Sign in here
              </button>
            </p>
          </div>

          {/* ✅ Error Display */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="mt-5">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm mb-2 dark:text-white">Email address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading} // ✅ Disable during loading
                    className="py-2.5 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-violet-500 focus:ring-violet-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm mb-2 dark:text-white">Password *</label>
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="Enter your password (min 6 characters)"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading} // ✅ Disable during loading
                    minLength={6}
                    className="py-2.5 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-violet-500 focus:ring-violet-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400"
                  />
                </div>

                {/* First name */}
                <div>
                  <label className="block text-sm mb-2 dark:text-white">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={loading} // ✅ Disable during loading
                    className="py-2.5 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-violet-500 focus:ring-violet-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400"
                  />
                </div>

                {/* Last name */}
                <div>
                  <label className="block text-sm mb-2 dark:text-white">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={loading} // ✅ Disable during loading
                    className="py-2.5 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-violet-500 focus:ring-violet-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400"
                  />
                </div>

                {/* Role radio buttons */}
                <div className="items-center">
                  <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Role *</h3>
                  <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {["Customer", "Merchant", "SuperAdmin"].map((role) => (
                      <li key={role} className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600 last:border-r-0">
                        <div className="flex items-center ps-3">
                          <input
                            type="radio"
                            id={role.toLowerCase()}
                            value={role}
                            checked={formData.roleType === role}
                            onChange={handleRoleChange}
                            disabled={loading} // ✅ Disable during loading
                            className="w-4 h-4 text-violet-600 bg-gray-100 border-gray-300 focus:ring-violet-500 dark:focus:ring-violet-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                          />
                          <label htmlFor={role.toLowerCase()} className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                            {role}
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>

            {/* Close button */}
            <button
              onClick={onClose}
              disabled={loading} // ✅ Disable during loading
              className="mt-4 w-full py-2 px-4 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
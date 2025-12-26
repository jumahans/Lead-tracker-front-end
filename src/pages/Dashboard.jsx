import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import BusinessCard from '../components/BusinessCard';
import { businessAPI } from '../services/api';

const Dashboard = () => {
  const [businesses, setBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFreelancerProfile, setHasFreelancerProfile] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileData, setProfileData] = useState({ skills: '' });
  const navigate = useNavigate();

  useEffect(() => {
    checkFreelancerProfile();
  }, []);

  const checkFreelancerProfile = async () => {
    try {
      await businessAPI.getAllLeads();
      setHasFreelancerProfile(true);
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.error?.includes('Freelancer profile not found')) {
        setHasFreelancerProfile(false);
        setShowProfileForm(true);
      }
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await businessAPI.createFreelancer(profileData);
      setHasFreelancerProfile(true);
      setShowProfileForm(false);
    } catch (error) {
      console.error('Error creating freelancer profile:', error);
      alert('Failed to create profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (searchData) => {
    if (!hasFreelancerProfile) {
      alert('Please complete your freelancer profile first.');
      return;
    }

    setIsLoading(true);
    try {
      const results = await businessAPI.getBusinessDetails(searchData);
      setBusinesses(results);
    } catch (error) {
      console.error('Search error:', error);
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert('Search failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  if (showProfileForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <header className="bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/50">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    LeadTracker
                  </h1>
                  <p className="text-sm text-gray-400">Business Lead Management System</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <nav className="bg-black/40 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-8">
                <button
                  onClick={() => setShowProfileForm(false)}
                  className="text-gray-300 hover:text-cyan-400 transition-colors"
                >
                  Dashboard
                </button> 
                <button
                  onClick={() => navigate('/leads')}
                  className="text-gray-300 hover:text-cyan-400 transition-colors"
                >
                  All Leads
                </button>
                <button
                  onClick={() => navigate('/profile')}
                  className="text-gray-300 hover:text-cyan-400 transition-colors"
                >
                  Profile
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400">Welcome back!</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto mt-16 p-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-white/10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Complete Your Profile</h2>
              <p className="text-gray-400">Tell us about your skills to get started with lead tracking</p>
            </div>
            
            <form className="space-y-6" onSubmit={handleProfileSubmit}>
              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Skills & Expertise
                </label>
                <textarea
                  id="skills"
                  value={profileData.skills}
                  onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
                  placeholder="e.g., Sales, Marketing, Web Development, Consulting, etc."
                  className="appearance-none block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg placeholder-gray-500 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                  rows="4"
                  required
                />
                <p className="mt-2 text-sm text-gray-400">
                  Describe your skills and areas of expertise. This helps us personalize your experience.
                </p>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/50 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Profile...</span>
                  </div>
                ) : (
                  'Complete Profile & Start Tracking Leads'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/50">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  LeadTracker
                </h1>
                <p className="text-sm text-gray-400">Business Lead Management System</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <button className="text-cyan-400 font-medium border-b-2 border-cyan-400 pb-1">
                Dashboard
              </button>
              <button
                onClick={() => navigate('/leads')}
                className="text-gray-300 hover:text-cyan-400 transition-colors"
              >
                All Leads
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="text-gray-300 hover:text-cyan-400 transition-colors"
              >
                Profile
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Welcome back!</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Business Lead Dashboard</h2>
          <p className="text-gray-400">Search for businesses and track your leads</p>
        </div>

        <SearchForm onSearch={handleSearch} isLoading={isLoading} />

        {businesses.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              Found {businesses.length} Businesses
            </h3>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-lg border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Business
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {businesses.map((business, index) => (
                      <tr key={index} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-white">{business.name}</div>
                            {business.website && business.website !== 'N/A' && (
                              <div className="text-sm text-gray-400">
                                <a href={business.website} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400">
                                  {business.website}
                                </a>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">
                            {business.phone && business.phone !== 'N/A' && <div>{business.phone}</div>}
                            {business.email && business.email !== 'N/A' && <div>{business.email}</div>}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">{business.address}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">
                            {business.rating && business.rating !== 'N/A' ? `${business.rating}/5` : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-white/10 text-gray-300">
                            {business.call_status || 'Not Called'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-cyan-400 hover:text-cyan-300 transition-colors">
                            Update Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
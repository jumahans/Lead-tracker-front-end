import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { businessAPI } from '../services/api';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [callStatuses, setCallStatuses] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    notCalled: 0,
    called: 0,
    interested: 0,
    notInterested: 0
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, []);

  const handledelete = async(id) => {
    try {
      await businessAPI.deleteleads(id);
      setLeads(leads.filter((lead) => lead.id !== id));
      const newStatuses = { ...callStatuses };
      delete newStatuses[id];
      setCallStatuses(newStatuses);
    } catch(error) {
      console.error('Error deleting Lead', error);
    }
  }

  const fetchLeads = async () => {
    try {
      const data = await businessAPI.getAllLeads();
      setLeads(data);
      
      const statuses = {};
      for (const lead of data) {
        try {
          const callStatus = await businessAPI.getCallStatus(lead.id);
          statuses[lead.id] = callStatus.called || false;
        } catch (error) {
          statuses[lead.id] = false;
        }
      }
      setCallStatuses(statuses);
      
      const calledCount = Object.values(statuses).filter(status => status === true).length;
      const statsData = {
        total: data.length,
        notCalled: data.length - calledCount,
        called: calledCount,
        interested: 0,
        notInterested: 0
      };
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching leads:', error);
      if (error.response?.data?.error) {
        alert(error.response.data.error);
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

  const handleCalledChange = async (leadId, checked) => {
    try {
      await businessAPI.updateCallStatus(leadId, checked);
      
      setCallStatuses(prev => ({
        ...prev,
        [leadId]: checked
      }));
      
      const newStatuses = { ...callStatuses, [leadId]: checked };
      const calledCount = Object.values(newStatuses).filter(status => status === true).length;
      setStats(prev => ({
        ...prev,
        called: calledCount,
        notCalled: leads.length - calledCount
      }));
    } catch (error) {
      console.error('Failed to update call status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/50">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  LeadTracker
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">Business Lead Management System</p>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-gray-300 hover:text-cyan-400 p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:flex lg:justify-between lg:items-center py-4 lg:py-0 lg:h-16`}>
            <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-8">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-300 hover:text-cyan-400 transition-colors text-left lg:text-center"
              >
                Dashboard
              </button>
              <button className="text-cyan-400 font-medium border-b-2 border-cyan-400 pb-1 text-left lg:text-center">
                All Leads
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="text-gray-300 hover:text-cyan-400 transition-colors text-left lg:text-center"
              >
                Profile
              </button>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4 mt-4 lg:mt-0">
              <span className="text-sm text-gray-400">Welcome back!</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors w-full lg:w-auto"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">All Leads</h2>
          <p className="text-sm sm:text-base text-gray-400">Track and manage all your business leads</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-sm p-4 sm:p-6 border border-white/10">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white">{stats.total}</div>
              <div className="text-xs sm:text-sm text-gray-400">Total Leads</div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-sm p-4 sm:p-6 border border-white/10">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-400">{stats.notCalled}</div>
              <div className="text-xs sm:text-sm text-gray-400">Not Called</div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-sm p-4 sm:p-6 border border-white/10">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-cyan-400">{stats.called}</div>
              <div className="text-xs sm:text-sm text-gray-400">Called</div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-sm p-4 sm:p-6 border border-white/10">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-400">{stats.interested}</div>
              <div className="text-xs sm:text-sm text-gray-400">Interested</div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-sm p-4 sm:p-6 border border-white/10">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-red-400">{stats.notInterested}</div>
              <div className="text-xs sm:text-sm text-gray-400">Not Interested</div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-lg border border-white/10 overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Business
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Customer Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Call Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Delete lead
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {leads.map((lead, index) => {
                  const isCalled = callStatuses[lead.id] || false;
                  return (
                    <tr key={index} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{lead.name}</div>
                          {lead.website && (
                            <div className="text-sm text-gray-400">
                              <a href={lead.website} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400">
                                {lead.website}
                              </a>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {lead.rating && <div>{lead.rating}</div>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {lead.phone && <div>{lead.phone}</div>}
                          {lead.email && <div>{lead.email}</div>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{lead.address}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={isCalled}
                            onChange={(e) => handleCalledChange(lead.id, e.target.checked)}
                            className="h-5 w-5 text-cyan-600 border-gray-300 rounded cursor-pointer"
                          />
                          <span className={`text-sm font-medium ${isCalled ? 'text-green-400' : 'text-gray-400'}`}>
                            {isCalled ? 'Called' : 'Not Called'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          className="text-white hover:text-red-300 transition-colors border-2 rounded-full px-3 py-1.5 bg-red-600 hover:bg-red-700" 
                          onClick={() => handledelete(lead.id)}
                        >
                          delete lead
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="md:hidden divide-y divide-white/10">
            {leads.map((lead, index) => {
              const isCalled = callStatuses[lead.id] || false;
              return (
                <div key={index} className="p-4 space-y-3">
                  <div>
                    <div className="text-sm font-medium text-white mb-1">{lead.name}</div>
                    {lead.website && (
                      <div className="text-xs text-gray-400">
                        <a href={lead.website} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 break-all">
                          {lead.website}
                        </a>
                      </div>
                    )}
                  </div>
                  {lead.rating && (
                    <div>
                      <span className="text-xs text-gray-400">Rating: </span>
                      <span className="text-sm text-gray-300">{lead.rating}</span>
                    </div>
                  )}
                  {(lead.phone || lead.email) && (
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Contact:</div>
                      {lead.phone && <div className="text-sm text-gray-300">{lead.phone}</div>}
                      {lead.email && <div className="text-sm text-gray-300 break-all">{lead.email}</div>}
                    </div>
                  )}
                  {lead.address && (
                    <div>
                      <span className="text-xs text-gray-400">Location: </span>
                      <span className="text-sm text-gray-300">{lead.address}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isCalled}
                        onChange={(e) => handleCalledChange(lead.id, e.target.checked)}
                        className="h-5 w-5 text-cyan-600 border-gray-300 rounded cursor-pointer"
                      />
                      <span className={`text-sm font-medium ${isCalled ? 'text-green-400' : 'text-gray-400'}`}>
                        {isCalled ? 'Called' : 'Not Called'}
                      </span>
                    </div>
                    <button 
                      className="text-white hover:text-red-300 transition-colors border-2 rounded-full px-3 py-1.5 bg-red-600 hover:bg-red-700 text-xs" 
                      onClick={() => handledelete(lead.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {leads.length === 0 && (
            <div className="text-center py-12 px-4">
              <div className="text-gray-400 text-base sm:text-lg mb-2">No leads found</div>
              <p className="text-gray-500 text-sm">Start by searching for businesses on the dashboard</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leads;
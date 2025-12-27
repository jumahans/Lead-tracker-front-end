import { useNavigate } from 'react-router-dom';
import { businessAPI } from '../services/api';
import { useEffect, useState } from 'react';

const Profile = () => {
    const [profile, setProfile] = useState([]);
    const navigate = useNavigate();
    const [popup, setpopup] = useState(false);
    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');
    const [message, setmessage] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handlepopup = (e) =>{
        e.preventDefault();
        setpopup(true);
        setTimeout(()=>{
            setpopup(false)
        }, 20000)
        
    }

    useEffect(() => {
        getProfileData();
    }, []);

    const getProfileData = async () => {
        try {
            const data = await businessAPI.getProfileData();
            setProfile(data);
        } catch (error) {
            console.error("Could not load user profile details", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        navigate('/');
    };

    const handleprofileupdate = async(credentials) =>{
        try{
            const response = await businessAPI.updateprofile(credentials);
            console.log("profile updated:", response);
            setmessage('profile updated successfully')
        }catch (error){
            console.error("profile update failed:", error);
            setmessage("Profile updatefailed")
        }
    } 

    return (
        <>
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
                                <button
                                    onClick={() => navigate('/leads')}
                                    className="text-gray-300 hover:text-cyan-400 transition-colors text-left lg:text-center"
                                >
                                    All Leads
                                </button>
                                <button className="text-cyan-400 font-medium border-b-2 border-cyan-400 pb-1 text-left lg:text-center">
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

                <main className="max-w-7xl mx-auto py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
                    <div className="mb-8 sm:mb-10">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">Your Profile</h2>
                                <p className="text-sm sm:text-base text-gray-400">Manage your account information</p>
                            </div>
                            <button 
                                onClick={handlepopup}
                                className="mt-4 sm:mt-0 w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-cyan-500/50 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>Edit Profile</span>
                            </button>
                        </div>
                    </div>

                    {profile.length === 0 ? (
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg p-12 border border-white/10 text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <p className="text-gray-400 text-lg mb-2">No profile found</p>
                            <p className="text-gray-500 text-sm">Create your profile to get started</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:gap-8 grid-cols-1 lg:grid-cols-3">
                            <div className="lg:col-span-1">
                                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-white/10 sticky top-24">
                                    <div className="text-center">
                                        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/30">
                                            <span className="text-3xl sm:text-5xl font-bold text-white">
                                                {profile[0]?.user?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{profile[0]?.user}</h3>
                                        <p className="text-sm text-gray-400 mb-6">Freelancer</p>
                                        
                                        <div className="space-y-3">
                                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="text-xs text-gray-400">Account Status</p>
                                                        <p className="text-sm font-medium text-white">Active</p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="text-xs text-gray-400">Member Since</p>
                                                        <p className="text-sm font-medium text-white">2024</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-white/10">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">Skills & Expertise</h3>
                                            <p className="text-sm text-gray-400">Your professional capabilities</p>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-6 border border-cyan-500/20">
                                        <p className="text-gray-300 leading-relaxed">{profile[0]?.skills}</p>
                                    </div>
                                </div>

                                <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-white/10">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">Quick Stats</h3>
                                            <p className="text-sm text-gray-400">Your activity overview</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                                            <p className="text-2xl font-bold text-cyan-400">0</p>
                                            <p className="text-xs text-gray-400 mt-1">Total Leads</p>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                                            <p className="text-2xl font-bold text-green-400">0</p>
                                            <p className="text-xs text-gray-400 mt-1">Converted</p>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center col-span-2 sm:col-span-1">
                                            <p className="text-2xl font-bold text-purple-400">0%</p>
                                            <p className="text-xs text-gray-400 mt-1">Success Rate</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
            {popup && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 px-4 animate-in fade-in duration-200">
                    <form 
                        onSubmit={(e) =>{
                            e.preventDefault();
                            handleprofileupdate({username, password})
                        }} 
                        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-md border border-white/20 transform transition-all"
                    >
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/30">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                                Update Profile
                            </h2>
                            <p className="text-sm text-gray-400">Make changes to your account</p>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                                    Username
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <input 
                                        type="text" 
                                        name="username" 
                                        value={username} 
                                        onChange={(e) => setusername(e.target.value)} 
                                        placeholder="Enter new username"
                                        className="appearance-none block w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm sm:text-base transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input 
                                        type="password" 
                                        name="password" 
                                        value={password} 
                                        onChange={(e) => setpassword(e.target.value)}
                                        placeholder="Enter new password"
                                        className="appearance-none block w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm sm:text-base transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 mt-8">
                            <button 
                                type='button'
                                onClick={() => setpopup(false)}
                                className="w-full sm:w-1/2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-medium border border-white/10 transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button 
                                type='submit' 
                                className="w-full sm:w-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-cyan-500/50 transform hover:-translate-y-0.5 transition-all duration-200"
                            >
                                Save Changes
                            </button>
                        </div>

                        {message && (
                            <div className={`mt-4 p-3 rounded-xl text-center text-sm ${message.includes('success') ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                {message}
                            </div>
                        )}
                    </form>
                </div>
            )}
        </>
    );
};
         
export default Profile;
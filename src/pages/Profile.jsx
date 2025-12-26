import { useNavigate } from 'react-router-dom';
import { businessAPI } from '../services/api';
import { useEffect, useState } from 'react';

const Profile = () => {
    const [profile, setProfile] = useState([]);
    const navigate = useNavigate();
    const [popup, setpopup] = useState(false);
    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');
    const [message, setmessage] = useState('')

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
                {/* Header */}
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

                {/* Nav */}
                <nav className="bg-black/40 backdrop-blur-md border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center space-x-8">
                                <button
                                    onClick={() => navigate('/dashboard')}
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
                                <button className="text-cyan-400 font-medium border-b-2 border-cyan-400 pb-1">
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

                {/* Profile Section */}
                <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Your Profile</h2>
                        <p className="text-gray-400">Manage your account information</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-white/10 h-[50vh] w-[90vw]">
                        <div>
                            {profile.length === 0 ? (
                                <p className="text-center text-gray-400 text-lg">No profile found...</p>
                            ) : (
                                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                    {profile.map((p) => (
                                        <div key={p.id}>
                                            <h2 className="text-xl font-semibold mb-2 text-white"><strong>UserName: </strong>{p.user}</h2>
                                            <p className="text-gray-300"><strong>Skills:</strong> {p.skills}</p>
                                        </div>
                                    ))}
                                </div>
                            )}                     
                        </div>
                        <div>
                            <button 
                                onClick={handlepopup}
                                className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-5 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/50 transform hover:-translate-y-0.5 transition-all duration-200"
                            >
                                Update Profile
                            </button>
                        </div>
                    </div>
                </main>
            </div>
            {popup && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <form 
                        onSubmit={(e) =>{
                            e.preventDefault();
                            handleprofileupdate({username, password})
                        }} 
                        className="bg-white/5 backdrop-blur-sm shadow-xl rounded-xl p-6 w-[90%] max-w-md border border-white/10"
                    >
                        <h2 className="text-xl font-semibold text-white mb-4 text-center">
                            Update Profile
                        </h2>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                                New username:
                            </label>
                            <input 
                                type="text" 
                                name="username" 
                                value={username} 
                                onChange={(e) => setusername(e.target.value)} 
                                className="appearance-none block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg placeholder-gray-500 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                                New password:
                            </label>
                            <input 
                                type="password" 
                                name="password" 
                                value={password} 
                                onChange={(e) => setpassword(e.target.value)}  
                                className="appearance-none block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg placeholder-gray-500 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button 
                                type='submit' 
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/50 transform hover:-translate-y-0.5 transition-all duration-200"
                            >
                                Update
                            </button>
                        </div>
                        {message && (
                            <p className="text-center mt-3 text-sm text-gray-300">{message}</p>
                        )}
                    </form>
                </div>
            )}
        </>
    );
};

export default Profile;
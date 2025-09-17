import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('kisaan_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (phoneNumber, otp) => {
    // Simulate OTP verification
    if (otp === '123456') {
      const userData = {
        id: Date.now(),
        phoneNumber,
        isProfileComplete: false
      };
      setUser(userData);
      localStorage.setItem('kisaan_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: 'Invalid OTP' };
  };

  const updateProfile = async (profileData) => {
    const updatedUser = {
      ...user,
      ...profileData,
      isProfileComplete: true
    };
    setUser(updatedUser);
    localStorage.setItem('kisaan_user', JSON.stringify(updatedUser));
    
    // Store in database with error handling
    try {
      const response = await fetch('https://builder.empromptu.ai/api_tools/templates/call_postgres', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 78c603dd15a83e48927e7dc52b2a8a6c',
          'X-Generated-App-ID': 'fb966449-837b-4a1b-b874-1afcdcab3e35',
          'X-Usage-Key': 'bea07626d89ebd2a9ab76e0ada0b62ad'
        },
        body: JSON.stringify({
          query: `INSERT INTO newschema_fb966449837b4a1bb8741afcdcab3e35.users 
                   (phone_number, name, location, farm_size, soil_type, created_at) 
                   VALUES ($1, $2, $3, $4, $5, NOW()) 
                   ON CONFLICT (phone_number) 
                   DO UPDATE SET name = $2, location = $3, farm_size = $4, soil_type = $5`,
          params: [user.phoneNumber, profileData.name, profileData.location, profileData.farmSize, profileData.soilType]
        })
      });
      
      if (!response.ok) {
        console.error('Failed to save profile to database');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      // Don't fail the profile update if database save fails
    }
    
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kisaan_user');
  };

  const value = {
    user,
    login,
    logout,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface POCData {
  helloword: string;
}

const Dashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [pocData, setPocData] = useState<POCData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  

  const fetchPOCData = async () => {
    try {
      setLoading(true);
      const token = await currentUser?.getIdToken();
      const response = await axios.get('/api/poc', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPocData(response.data.data);
      setEditValue(response.data.data.helloword);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchPOCData();
    }
  }, [currentUser, fetchPOCData]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const token = await currentUser?.getIdToken();
      await axios.put('/api/poc', 
        { helloword: editValue },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setPocData({ helloword: editValue });
      setEditing(false);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Shavzak-8208 Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {currentUser?.photoURL && (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={currentUser.photoURL}
                    alt="Profile"
                  />
                )}
                <span className="text-gray-700">{currentUser?.displayName || currentUser?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                POC Data from Firestore
              </h3>
              
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {editing ? (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Hello Word Content
                    </label>
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleUpdate}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                      >
                        {loading ? 'Updating...' : 'Save'}
                      </button>
                      <button
                        onClick={() => {
                          setEditing(false);
                          setEditValue(pocData?.helloword || '');
                          setError(null);
                        }}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Hello Word Content
                    </label>
                    <div className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-900">
                      {pocData?.helloword || 'No data available'}
                    </div>
                    <button
                      onClick={() => setEditing(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Document Details</h4>
                <div className="text-sm text-gray-600">
                  <p><strong>Collection:</strong> poc</p>
                  <p><strong>Document ID:</strong> pocid</p>
                  <p><strong>Last Updated:</strong> {new Date().toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SeedPage: React.FC = () => {
  const { signup } = useAuth();
  const [status, setStatus] = useState('Initializing...');
  const navigate = useNavigate();

  useEffect(() => {
    const runSeed = async () => {
      try {
        setStatus('Creating user: Gilakathi Siddhartha...');
        await signup(
          'siddharthgoudgilakathi@gmail.com',
          '123456789',
          'Gilakathi Siddhartha',
          'patient',
          {
            phone: '+91 94932 17211',
            age: '20',
            gender: 'male'
          }
        );
        setStatus('User created successfully! Redirecting...');
        setTimeout(() => navigate('/login'), 2000);
      } catch (err: any) {
        setStatus(`Error: ${err.message}`);
      }
    };

    runSeed();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-10 text-center">
      <div>
        <h1 className="text-2xl font-black mb-4">Database Seeding</h1>
        <p className="text-on-surface-variant font-medium">{status}</p>
      </div>
    </div>
  );
};

export default SeedPage;

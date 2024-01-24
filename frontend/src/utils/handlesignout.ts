// authUtils.js or authUtils.ts
import { getAuth, signOut } from '@firebase/auth';
import { NavigateFunction } from 'react-router-dom'; 

export const handleSignOut = async (navigate:NavigateFunction) => {
  const confirmSignOut = window.confirm("Are you sure you want to sign out?");
  if (confirmSignOut) {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log('User signed out successfully');
      navigate('/');
    } catch (error) {
      console.error('Error signing out', error);
    }
  } else {
    console.log('Sign out cancelled');
  }
};
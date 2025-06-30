import { writable } from 'svelte/store';
import { auth } from '../firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { browser } from '$app/environment';

// User store
export const user = writable<User | null>(null);
export const loading = writable(true);

// Initialize auth state listener
if (browser) {
  onAuthStateChanged(auth, firebaseUser => {
    user.set(firebaseUser);
    loading.set(false);
  });
}

// Authentication functions
export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, error: errorMessage };
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, error: errorMessage };
  }
};


import { auth, db } from "@/lib/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const saveUserToFirestore = async (uid: string, userData: any) => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, userData);
  } catch (error) {
    console.error("Error saving user to Firestore:", error);
    throw error;
  }
};

export const getUserFromFirestore = async (uid: string) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
  } catch (error) {
    console.error("Error getting user from Firestore:", error);
    return null;
  }
};

export const handleSignup = async (
  email: string,
  password: string,
  name: string,
  role: string
) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  if (userCredential.user) {
    await updateProfile(userCredential.user, {
      displayName: name,
    });

    const userData = {
      name,
      email,
      role,
      verified: role === 'student',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    
    await saveUserToFirestore(userCredential.user.uid, userData);
    
    localStorage.setItem('userRole', role);
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    
    return userCredential.user;
  }
  return null;
};

export const handleLogin = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const userData = await getUserFromFirestore(userCredential.user.uid);
  
  if (!userData) {
    throw new Error("User data not found");
  }

  localStorage.setItem('userRole', userData.role);
  localStorage.setItem('userName', userData.name);
  localStorage.setItem('userEmail', userData.email);

  return { user: userCredential.user, userData };
};

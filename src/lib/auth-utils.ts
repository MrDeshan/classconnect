
import { auth, db } from "@/lib/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile 
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export const saveUserToFirestore = async (uid: string, userData: any) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userDataWithTimestamp = {
      ...userData,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      uid: uid, // Add UID to user data
    };
    await setDoc(userRef, userDataWithTimestamp, { merge: true });
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
      verified: role === 'student', // Students are automatically verified
      uid: userCredential.user.uid,
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

  // Update last login
  await saveUserToFirestore(userCredential.user.uid, {
    lastLogin: serverTimestamp(),
  });

  return { user: userCredential.user, userData };
};

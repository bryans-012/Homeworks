import { createContext, useEffect, useMemo, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth, firebaseConfigError, firebaseReady } from '../firebase/config'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!firebaseReady) {
      setLoading(false)
      return undefined
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      firebaseReady,
      firebaseConfigError,
      login: (email, password) => {
        if (!firebaseReady) {
          return Promise.reject(new Error(firebaseConfigError))
        }

        return signInWithEmailAndPassword(auth, email, password)
      },
      register: (email, password) => {
        if (!firebaseReady) {
          return Promise.reject(new Error(firebaseConfigError))
        }

        return createUserWithEmailAndPassword(auth, email, password)
      },
      logout: () => {
        if (!firebaseReady) {
          return Promise.resolve()
        }

        return signOut(auth)
      },
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

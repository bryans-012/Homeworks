import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { getInitialTree } from '../models/naryTree'

function getTreeDocRef(uid) {
  return doc(db, 'trees', uid)
}

export async function loadOrCreateTree(uid, email) {
  const treeRef = getTreeDocRef(uid)
  const snapshot = await getDoc(treeRef)

  if (snapshot.exists()) {
    return snapshot.data().tree
  }

  const initialTree = getInitialTree({ ownerEmail: email })

  await setDoc(treeRef, {
    uid,
    ownerEmail: email,
    tree: initialTree,
    updatedAt: serverTimestamp(),
  })

  return initialTree
}

export async function saveTree(uid, email, tree) {
  const treeRef = getTreeDocRef(uid)

  await setDoc(
    treeRef,
    {
      uid,
      ownerEmail: email,
      tree,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

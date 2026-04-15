export const NODE_TYPE = {
  FOLDER: 'folder',
  FILE: 'file',
}

export function createNode({ id, name, type, createdBy, createdAt }) {
  return {
    id,
    name,
    type,
    createdBy,
    createdAt,
    children: type === NODE_TYPE.FOLDER ? [] : undefined,
  }
}

export function findNodeById(node, targetId) {
  if (!node) {
    return null
  }

  if (node.id === targetId) {
    return node
  }

  if (!node.children?.length) {
    return null
  }

  for (const child of node.children) {
    const found = findNodeById(child, targetId)
    if (found) {
      return found
    }
  }

  return null
}

export function addChildNode(root, parentId, newChild) {
  if (!root) {
    throw new Error('El arbol no existe')
  }

  const parent = findNodeById(root, parentId)

  if (!parent) {
    throw new Error('No se encontro la carpeta padre')
  }

  if (parent.type !== NODE_TYPE.FOLDER) {
    throw new Error('No se pueden agregar hijos a un archivo')
  }

  const exists = parent.children.some(
    (child) => child.name.toLowerCase() === newChild.name.toLowerCase(),
  )

  if (exists) {
    throw new Error('Ya existe un nodo con ese nombre en la carpeta')
  }

  parent.children.push(newChild)
  return root
}

export function getInitialTree({ ownerEmail }) {
  return createNode({
    id: 'root',
    name: '/',
    type: NODE_TYPE.FOLDER,
    createdBy: ownerEmail,
    createdAt: new Date().toISOString(),
  })
}

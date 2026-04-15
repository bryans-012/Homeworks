import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { TreeView } from '../components/TreeView'
import { addChildNode, createNode, findNodeById, getInitialTree, NODE_TYPE } from '../models/naryTree'
import { loadOrCreateTree, saveTree } from '../services/treeService'

function buildNodeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
}

export function ExplorerPage() {
  const { user, logout } = useAuth()

  // Inicia con arbol local para que la UI sea inmediata; se reemplaza con Firestore si esta disponible
  const [tree, setTree] = useState(() => getInitialTree({ ownerEmail: user.email }))
  const [selectedId, setSelectedId] = useState('root')
  const [newNodeName, setNewNodeName] = useState('')
  const [newNodeType, setNewNodeType] = useState(NODE_TYPE.FOLDER)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('Sincronizando con base de datos...')

  useEffect(() => {
    let mounted = true

    async function loadTree() {
      try {
        const currentTree = await loadOrCreateTree(user.uid, user.email)

        if (mounted) {
          setTree(currentTree)
          setStatus('')
        }
      } catch (err) {
        if (mounted) {
          // La UI ya es funcional con el arbol local; solo avisamos del fallo
          setStatus('Modo local: Firestore no disponible')
        }
      }
    }

    loadTree()

    return () => {
      mounted = false
    }
  }, [user.uid, user.email])

  const selectedNode = useMemo(() => {
    if (!tree) {
      return null
    }

    return findNodeById(tree, selectedId)
  }, [tree, selectedId])

  async function handleCreateNode(event) {
    event.preventDefault()
    setError('')

    if (!tree || !selectedNode) {
      setError('No hay un nodo seleccionado')
      return
    }

    if (!newNodeName.trim()) {
      setError('Ingresa un nombre valido')
      return
    }

    try {
      const treeCopy = structuredClone(tree)

      const newNode = createNode({
        id: buildNodeId(),
        name: newNodeName.trim(),
        type: newNodeType,
        createdBy: user.email,
        createdAt: new Date().toISOString(),
      })

      const updatedTree = addChildNode(treeCopy, selectedNode.id, newNode)

      // Actualiza la UI de forma inmediata
      setTree(updatedTree)
      setNewNodeName('')
      setStatus(`${newNodeType === NODE_TYPE.FOLDER ? 'Carpeta' : 'Archivo'} creado`)

      // Intenta persistir en Firestore sin bloquear la UI
      try {
        await saveTree(user.uid, user.email, updatedTree)
      } catch {
        setStatus('Guardado localmente (Firestore no disponible)')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  function handleSelect(node) {
    setSelectedId(node.id)
    setError('')
  }

  return (
    <main className="app">
      <header className="app__header">
        <div>
          <h1>Gestor de Carpetas y Archivos</h1>
          <p>Usuario: {user.email}</p>
        </div>
        <button type="button" onClick={logout}>
          Cerrar sesion
        </button>
      </header>

      <section className="workspace">
        <article className="panel panel--left">
          <h2>Estructura</h2>
          {status ? <p className="status">{status}</p> : null}
          <ul className="tree">
            <TreeView node={tree} selectedId={selectedId} onSelect={handleSelect} />
          </ul>
        </article>

        <article className="panel panel--right">
          <h2>Detalle del nodo</h2>
          {selectedNode ? (
            <>
              <dl className="detail-grid">
                <dt>Nombre</dt>
                <dd>{selectedNode.name}</dd>
                <dt>Tipo</dt>
                <dd>{selectedNode.type === NODE_TYPE.FOLDER ? 'Carpeta' : 'Archivo'}</dd>
                <dt>Creador</dt>
                <dd>{selectedNode.createdBy}</dd>
                <dt>Hijos</dt>
                <dd>{selectedNode.children?.length ?? 0}</dd>
              </dl>

              <form className="create-form" onSubmit={handleCreateNode}>
                <label htmlFor="nodeName">Nuevo nombre</label>
                <input
                  id="nodeName"
                  type="text"
                  value={newNodeName}
                  onChange={(event) => setNewNodeName(event.target.value)}
                  placeholder="ej: tareas"
                />

                <label htmlFor="nodeType">Tipo de nodo</label>
                <select
                  id="nodeType"
                  value={newNodeType}
                  onChange={(event) => setNewNodeType(event.target.value)}
                >
                  <option value={NODE_TYPE.FOLDER}>Carpeta</option>
                  <option value={NODE_TYPE.FILE}>Archivo</option>
                </select>

                {error ? <p className="form-error">{error}</p> : null}
                <p className="status">{status}</p>

                <div className="actions">
                  <button type="submit">Crear nodo</button>
                </div>
              </form>
            </>
          ) : (
            <p>Selecciona un nodo para ver detalle.</p>
          )}
        </article>
      </section>
    </main>
  )
}

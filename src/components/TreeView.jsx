import { NODE_TYPE } from '../models/naryTree'

export function TreeView({ node, selectedId, onSelect }) {
  if (!node) {
    return null
  }

  const isFolder = node.type === NODE_TYPE.FOLDER
  const marker = isFolder ? 'carpeta' : 'archivo'

  return (
    <li>
      <button
        type="button"
        className={`tree-item ${selectedId === node.id ? 'tree-item--active' : ''}`}
        onClick={() => onSelect(node)}
      >
        <span className="tree-item__type">{marker}</span> {node.name}
      </button>

      {isFolder && node.children?.length > 0 ? (
        <ul>
          {node.children.map((child) => (
            <TreeView
              key={child.id}
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

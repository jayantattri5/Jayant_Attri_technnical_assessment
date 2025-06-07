import { Handle } from 'reactflow';

export const GenericNode = ({ id, title, controls = [], handles = [] }) => {
  return (
    <div style={{ width: 200, border: '1px solid black', padding: 10 }}>
      <div>
        <strong>{title}</strong>
      </div>

      <div>
        {controls.map(({ label, value, onChange, type, options }, index) => (
          <label key={index} style={{ display: 'block', marginTop: 4 }}>
            {label}:{' '}
            {type === 'select' ? (
              <select value={value} onChange={onChange}>
                {options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input type={type} value={value} onChange={onChange} />
            )}
          </label>
        ))}
      </div>

      {handles.map(({ type, position, id: handleId, style }, index) => (
        <Handle
          key={index}
          type={type}
          position={position}
          id={`${id}-${handleId}`}
          style={style}
        />
      ))}
    </div>
  );
};
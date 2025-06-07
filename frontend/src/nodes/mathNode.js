import { useState } from 'react';
import { Position } from 'reactflow';
import { GenericNode } from './GenericNode';

export const MathNode = ({ id, data }) => {
  const [formula, setFormula] = useState(data?.formula || 'a + b');

  return (
    <GenericNode
      id={id}
      title="Math"
      controls={[
        { label: 'Formula', type: 'text', value: formula, onChange: e => setFormula(e.target.value) }
      ]}
      handles={[
        { type: 'target', position: Position.Left, id: 'input-a', style: { top: '30%' } },
        { type: 'target', position: Position.Left, id: 'input-b', style: { top: '60%' } },
        { type: 'source', position: Position.Right, id: 'result' }
      ]}
    />
  );
};

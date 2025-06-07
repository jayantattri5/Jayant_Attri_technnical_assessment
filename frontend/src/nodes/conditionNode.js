import { useState } from 'react';
import { Position } from 'reactflow';
import { GenericNode } from './GenericNode';

export const ConditionNode = ({ id, data }) => {
  const [left, setLeft] = useState(data?.left || '');
  const [right, setRight] = useState(data?.right || '');
  const [operator, setOperator] = useState(data?.operator || '==');

  return (
    <GenericNode
      id={id}
      title="Condition"
      controls={[
        { label: 'Left', type: 'text', value: left, onChange: e => setLeft(e.target.value) },
        { label: 'Operator', type: 'select', value: operator, onChange: e => setOperator(e.target.value), options: ['==', '!=', '>', '<'] },
        { label: 'Right', type: 'text', value: right, onChange: e => setRight(e.target.value) }
      ]}
      handles={[
        { type: 'source', position: Position.Right, id: 'result' }
      ]}
    />
  );
};

import { useState } from 'react';
import { Position } from 'reactflow';
import { GenericNode } from './GenericNode';

export const InputNode = ({ id, data }) => {
  const [name, setName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [type, setType] = useState(data?.inputType || 'Text');

  return (
    <GenericNode
      id={id}
      title="Input"
      controls={[
        { label: 'Name', type: 'text', value: name, onChange: e => setName(e.target.value) },
        { label: 'Type', type: 'select', value: type, onChange: e => setType(e.target.value), options: ['Text', 'File'] }
      ]}
      handles={[{ type: 'source', position: Position.Right, id: 'value' }]}
    />
  );
};
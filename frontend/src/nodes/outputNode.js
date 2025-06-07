import { useState } from 'react';
import { Position } from 'reactflow';
import { GenericNode } from './GenericNode';

export const OutputNode = ({ id, data }) => {
  const [name, setName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [type, setType] = useState(data?.outputType || 'Text');

  return (
    <GenericNode
      id={id}
      title="Output"
      controls={[
        { label: 'Name', type: 'text', value: name, onChange: e => setName(e.target.value) },
        { label: 'Type', type: 'select', value: type, onChange: e => setType(e.target.value), options: ['Text', 'Image'] }
      ]}
      handles={[{ type: 'target', position: Position.Left, id: 'value' }]}
    />
  );
};
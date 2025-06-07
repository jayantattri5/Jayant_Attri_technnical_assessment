import { useState } from 'react';
import { Position } from 'reactflow';
import { GenericNode } from './GenericNode';

export const DropdownNode = ({ id, data }) => {
  const [option, setOption] = useState(data?.option || 'One');

  return (
    <GenericNode
      id={id}
      title="Dropdown"
      controls={[
        { label: 'Option', type: 'select', value: option, onChange: e => setOption(e.target.value), options: ['One', 'Two', 'Three'] }
      ]}
      handles={[
        { type: 'source', position: Position.Right, id: 'selected' }
      ]}
    />
  );
};
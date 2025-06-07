import { useState } from 'react';
import { Position } from 'reactflow';
import { GenericNode } from './GenericNode';

export const TextNode = ({ id, data }) => {
  const [text, setText] = useState(data?.text || '{{input}}');

  return (
    <GenericNode
      id={id}
      title="Text"
      controls={[
        { label: 'Text', type: 'text', value: text, onChange: e => setText(e.target.value) }
      ]}
      handles={[{ type: 'source', position: Position.Right, id: 'output' }]}
    />
  );
};
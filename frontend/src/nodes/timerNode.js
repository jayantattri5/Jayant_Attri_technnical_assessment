import { useState } from 'react';
import { Position } from 'reactflow';
import { GenericNode } from './GenericNode';

export const TimerNode = ({ id, data }) => {
  const [delay, setDelay] = useState(data?.delay || 1000);

  return (
    <GenericNode
      id={id}
      title="Timer"
      controls={[
        { label: 'Delay (ms)', type: 'text', value: delay, onChange: e => setDelay(e.target.value) }
      ]}
      handles={[
        { type: 'target', position: Position.Left, id: 'trigger' },
        { type: 'source', position: Position.Right, id: 'delayed' }
      ]}
    />
  );
};
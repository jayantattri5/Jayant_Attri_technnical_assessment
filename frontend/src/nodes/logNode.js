import { Position } from 'reactflow';
import { GenericNode } from './GenericNode';

export const LogNode = ({ id }) => {
  return (
    <GenericNode
      id={id}
      title="Log"
      controls={[
        { label: 'Info', type: 'text', value: 'Logs value to console', onChange: () => {} }
      ]}
      handles={[
        { type: 'target', position: Position.Left, id: 'input' },
        { type: 'source', position: Position.Right, id: 'output' }
      ]}
    />
  );
};

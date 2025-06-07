import { Position } from 'reactflow';
import { GenericNode } from './GenericNode';

export const LLMNode = ({ id }) => {
  return (
    <GenericNode
      id={id}
      title="LLM"
      controls={[{ label: '', type: 'text', value: 'This is a LLM.', onChange: () => {} }]}
      handles={[
        { type: 'target', position: Position.Left, id: 'system', style: { top: `${100 / 3}%` } },
        { type: 'target', position: Position.Left, id: 'prompt', style: { top: `${200 / 3}%` } },
        { type: 'source', position: Position.Right, id: 'response' }
      ]}
    />
  );
};
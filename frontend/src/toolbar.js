// toolbar.js

import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {

    return (
        <div style={{ padding: '10px' }}>
            <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <DraggableNode type='customInput' label='Input' />
                <DraggableNode type='llm' label='LLM' />
                <DraggableNode type='customOutput' label='Output' />
                <DraggableNode type='text' label='Text' />
                <DraggableNode type='mathNode' label='Math' />
                <DraggableNode type='conditionNode' label='Condition' />
                <DraggableNode type='timerNode' label='Timer' />
                <DraggableNode type='logNode' label='Log' />
                <DraggableNode type='dropdownNode' label='Dropdown' />
            </div>
        </div>
    );
};

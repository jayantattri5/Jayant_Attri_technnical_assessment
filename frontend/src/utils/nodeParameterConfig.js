// utils/nodeParameterConfig.js
// Node parameter configuration utilities
// --------------------------------------------------

export const getParameterFields = (nodeType) => {
  switch (nodeType) {
    case 'llm':
      return [
        { 
          key: 'credential', 
          label: 'Credential to connect with', 
          type: 'select', 
          options: ['Select Credential'],
          required: true 
        },
        { 
          key: 'resource', 
          label: 'Resource', 
          type: 'select', 
          options: ['Assistant', 'Chat', 'Completion'],
          required: true 
        },
        { 
          key: 'operation', 
          label: 'Operation', 
          type: 'select', 
          options: ['Create an Assistant', 'Send Message', 'Generate Text'],
          required: true 
        },
        { 
          key: 'model', 
          label: 'Model', 
          type: 'select', 
          options: ['From list', 'GPT-4', 'GPT-3.5-turbo', 'Claude-3'],
          required: true 
        },
        { 
          key: 'name', 
          label: 'Name', 
          type: 'text', 
          placeholder: 'e.g. My Assistant',
          required: true 
        },
        { 
          key: 'description', 
          label: 'Description', 
          type: 'textarea', 
          placeholder: 'e.g. My personal assistant'
        }
      ];
    case 'customInput':
      return [
        { key: 'name', label: 'Input Name', type: 'text', placeholder: 'Enter input name' },
        { key: 'type', label: 'Input Type', type: 'select', options: ['Text', 'Number', 'Boolean', 'JSON'] },
        { key: 'defaultValue', label: 'Default Value', type: 'text', placeholder: 'Enter default value' },
        { key: 'required', label: 'Required', type: 'checkbox' }
      ];
    case 'customOutput':
      return [
        { key: 'name', label: 'Output Name', type: 'text', placeholder: 'Enter output name' },
        { key: 'type', label: 'Output Type', type: 'select', options: ['Text', 'Number', 'Boolean', 'JSON'] },
        { key: 'format', label: 'Format', type: 'select', options: ['Raw', 'Formatted', 'Pretty Print'] }
      ];
    case 'conditionNode':
      return [
        { key: 'condition', label: 'Condition', type: 'text', placeholder: 'Enter condition' },
        { key: 'operator', label: 'Operator', type: 'select', options: ['equals', 'not equals', 'contains', 'greater than', 'less than', 'is empty', 'is not empty'] },
        { key: 'value', label: 'Compare Value', type: 'text', placeholder: 'Enter value to compare' }
      ];
    case 'text':
      return [
        { key: 'content', label: 'Text Content', type: 'textarea', placeholder: 'Enter your text content' },
        { key: 'format', label: 'Format', type: 'select', options: ['plain', 'markdown', 'html'] },
        { key: 'variables', label: 'Enable Variables', type: 'checkbox' }
      ];
    case 'mathNode':
      return [
        { key: 'expression', label: 'Math Expression', type: 'text', placeholder: 'e.g. (a + b) * c' },
        { key: 'precision', label: 'Decimal Precision', type: 'number', min: 0, max: 10 },
        { key: 'format', label: 'Output Format', type: 'select', options: ['Number', 'String', 'Scientific'] }
      ];
    case 'timerNode':
      return [
        { key: 'delay', label: 'Delay (seconds)', type: 'number', min: 0, step: 0.1 },
        { key: 'repeat', label: 'Repeat', type: 'checkbox' },
        { key: 'interval', label: 'Interval (seconds)', type: 'number', min: 1 }
      ];
    case 'logNode':
      return [
        { key: 'level', label: 'Log Level', type: 'select', options: ['info', 'warn', 'error', 'debug'] },
        { key: 'message', label: 'Log Message', type: 'textarea', placeholder: 'Enter log message' },
        { key: 'includeTimestamp', label: 'Include Timestamp', type: 'checkbox' }
      ];
    case 'dropdownNode':
      return [
        { key: 'options', label: 'Dropdown Options', type: 'textarea', placeholder: 'Enter options separated by new lines' },
        { key: 'defaultValue', label: 'Default Selection', type: 'text' },
        { key: 'allowMultiple', label: 'Allow Multiple Selection', type: 'checkbox' }
      ];
    default:
      return [
        { key: 'name', label: 'Node Name', type: 'text', placeholder: 'Enter node name' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter description' }
      ];
  }
};

export const getNodeTitle = (nodeType) => {
  const titles = {
    llm: 'OpenAI',
    customInput: 'Input Node',
    customOutput: 'Output Node',
    conditionNode: 'Condition Node',
    text: 'Text Node',
    mathNode: 'Math Node',
    timerNode: 'Timer Node',
    logNode: 'Log Node',
    dropdownNode: 'Dropdown Node'
  };
  return titles[nodeType] || 'Node Configuration';
};
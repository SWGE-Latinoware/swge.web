import React, { useMemo } from 'react';
import MUIRichTextEditor from 'mui-rte';
import useRTE from '../hook/useRTE';

const MUIRichTextEditorW = (props) => {
  const { onSave, onChange, media, defaultValue, setDescriptionState, label, toHtml, ...otherProps } = props;

  const { convertStateToRaw, convertStateToHtml } = useRTE();

  const controls = useMemo(
    () => [
      'title',
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'undo',
      'redo',
      'link',
      media !== false && 'media',
      'numberList',
      'bulletList',
      'quote',
      'clear',
      onSave && 'save',
    ],
    [media, onSave]
  );

  const updateState = (mode, data) => {
    if (!setDescriptionState) return;
    if (mode === 'save') {
      setDescriptionState(JSON.parse(data));
    } else if (toHtml) {
      setDescriptionState(convertStateToHtml(data));
    } else {
      setDescriptionState(convertStateToRaw(data));
    }
  };

  return (
    <MUIRichTextEditor
      inlineToolbar
      onSave={(data) => updateState('save', data) || (onSave && onSave(data))}
      onChange={(data) => updateState('change', data) || (onChange && onChange(data))}
      controls={controls}
      defaultValue={defaultValue ? JSON.stringify(defaultValue) : ''}
      label={label && <span style={{ paddingLeft: 10 }}>{label}</span>}
      {...otherProps}
    />
  );
};

export default MUIRichTextEditorW;

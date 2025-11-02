import React, {useRef, useState} from "react";
import {recognizeIngredient} from "../../Utils/queries";
import {useNavigate} from "react-router-dom";
import {IngredientAISuggestionResp} from "../../Utils/response-types";

const RecognizeIngredientPage = (props: {setSelectedTemplate: React.Dispatch<React.SetStateAction<IngredientAISuggestionResp|undefined>>}) => {
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'error'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  const displayLabel = status === 'uploading' ? 'Processing...' : file ? file.name : 'Click here to make a photo';

  const displayStyle: React.CSSProperties = {
        flexGrow: 1, padding: '5px 8px',
        marginRight: '8px', borderRadius: '4px', cursor: status !== 'uploading' ? 'pointer' : 'default',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        color: status === 'error' ? 'red' : 'inherit', alignItems: "center", justifyContent: "center", display: "flex"
    };

      const handleUpload = async () => {
        if (!file || status === 'uploading') return;

        setStatus('uploading');

        try {
            const response = await recognizeIngredient(file.name, file);

            if (!response.errorCode) {
                setFile(null);
                setStatus('idle');
                props.setSelectedTemplate({
                    name: response.name, portion_grams: response.portion_grams!
                });
                navigate('/ingredients/add');
            } else {
                const errorMsg = `Upload failed: ${
                    response.errorCode ? ` (Code: ${response.errorCode})` : ''
                }`;
                setStatus('error');
            }
        } catch (err: any) {
            console.error('Upload process failed:', err);
            setStatus('error');
        }
    };


    return (
        <div className="base-page">
            <input type="file" ref={inputRef} style={{display: 'none'}} accept="image/*" capture="environment"
                   onChange={(e) => {
                       setFile(e.target.files?.[0] ?? null);
                       if (e.target) e.target.value = '';
                   }}
            />
            <div style={displayStyle} title={displayLabel}
                 onClick={() => status !== 'uploading' && inputRef.current?.click()}>
                {displayLabel}
            </div>
            <button type="button" onClick={handleUpload} className="button green-button" style={{flexShrink: 0}}
                    disabled={!file || status === 'uploading'}>
                {status === 'uploading' ? '...' : 'Upload'}
            </button>
        </div>
    );
};

export default RecognizeIngredientPage;

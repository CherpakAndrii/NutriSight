import "../FoodLog.css";
import React, {useRef, useState} from "react";
import {recognizeMeal} from "../../../Utils/queries";
import {MealTime, SourceType} from "../../../Utils/enums";
import {useNavigate} from "react-router-dom";
import {FoodLogTemplate} from "./FoodLogTemplate";

const RecognizeMealPage = (props: {setSelectedTemplate: React.Dispatch<React.SetStateAction<FoodLogTemplate|undefined>>}) => {
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
            const response = await recognizeMeal(file.name, file);

            if (!response.errorCode) {
                setFile(null);
                setStatus('idle');
                props.setSelectedTemplate({
                    log_id: 0, meal_time: MealTime.Snack, source_type: SourceType.Photo,
                    name: response.name, actual_calories: response.default_calories!, actual_proteins: response.default_proteins!, actual_fats: response.default_fats!, actual_carbs: response.default_carbs!, actual_portion_grams: response.default_portion_grams!
                });
                navigate('/foodlog/add');
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

export default RecognizeMealPage;

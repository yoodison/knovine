// Adapted from Alwurts / Chat Input on 21st.dev (demo 557).
// Retains the resizing textarea and submit composition, using our native controls.
import React, {useEffect, useRef} from 'react';
import {ArrowUp, LoaderCircle} from 'lucide-react';

export default function Composer({value,onChange,onSubmit,busy,children}) {
  const textarea=useRef(null);
  useEffect(()=>{const el=textarea.current;if(el){el.style.height='auto';el.style.height=Math.min(el.scrollHeight,180)+'px';}},[value]);
  return <form className="composer" onSubmit={e=>{e.preventDefault();if(!busy&&value.trim())onSubmit();}}>
    <textarea ref={textarea} value={value} onChange={e=>onChange(e.target.value)} rows={2} aria-label="What would you like to understand?" placeholder="What would you like to understand?"
      onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.nativeEvent.isComposing){e.preventDefault();if(!busy&&value.trim())onSubmit();}}}/>
    <div className="composer-footer"><span>{children||'Your curiosity is a good place to start.'}</span><button type="submit" disabled={busy||!value.trim()} aria-label={busy?'Thinking':'Send question'}>{busy?<LoaderCircle className="spin" size={19}/>:<ArrowUp size={20}/>}</button></div>
  </form>;
}

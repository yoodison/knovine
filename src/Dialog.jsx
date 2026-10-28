import React,{useEffect,useRef} from 'react';
import {X} from 'lucide-react';
export default function Dialog({title,onClose,children,wide=false}) {
  const ref=useRef(null);
  useEffect(()=>{const el=ref.current,previous=document.activeElement;el.showModal();return()=>{el.close();if(previous?.isConnected)previous.focus();};},[]);
  return <dialog ref={ref} className={'modal '+(wide?'wide':'')} aria-label={title} onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===ref.current){const r=ref.current.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)onClose();}}}>
    <div className="dialog-head"><h2>{title}</h2><button className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={20}/></button></div>{children}
  </dialog>;
}

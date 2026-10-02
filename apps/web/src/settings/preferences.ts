import {create} from 'zustand';
export const preferencesKey='kw:settings:v1';
export type LineColor='cyan'|'gold'|'green'|'muted';
export type Preferences={theme:'night'|'day';comfort:boolean;colors:Partial<Record<LineColor,string>>};
export const defaultPreferences:Preferences={theme:'night',comfort:false,colors:{}};
export function parsePreferences(raw:string|null):Preferences{
 try{const value=JSON.parse(raw??'null');return {theme:value?.theme==='day'?'day':'night',comfort:value?.comfort===true,colors:Object.fromEntries(Object.entries(value?.colors??{}).filter(([key,color])=>['cyan','gold','green','muted'].includes(key)&&typeof color==='string'&&/^#[0-9a-f]{6}$/i.test(color))) as Preferences['colors']};}catch{return {...defaultPreferences,colors:{}};}
}
function read(){try{return parsePreferences(localStorage.getItem(preferencesKey));}catch{return {...defaultPreferences,colors:{}};}}
export const usePreferences=create<Preferences&{storageError:boolean;update:(patch:Partial<Preferences>)=>void}>(set=>({...read(),storageError:false,update:patch=>set(previous=>{
 const next={theme:patch.theme??previous.theme,comfort:patch.comfort??previous.comfort,colors:patch.colors??previous.colors};
 try{localStorage.setItem(preferencesKey,JSON.stringify(next));return {...next,storageError:false};}catch{return {...next,storageError:true};}
})}));
export const openSettings=()=>window.dispatchEvent(new Event('kw:open-settings'));
export function lineColors(renderer:'coordinate'|'geometry'|'solid',preferences:Preferences){
 const light={cyan:'#126276',gold:'#835318',green:'#2c6f44',muted:'#526476'},dark={cyan:'#75d8ef',gold:'#ffd27a',green:'#8fdaa9',muted:'#8c9cae'};
 const base=preferences.theme==='day'?light:renderer==='solid'?{...dark,cyan:light.cyan,gold:light.gold}:dark;
 return {...base,...preferences.colors};
}

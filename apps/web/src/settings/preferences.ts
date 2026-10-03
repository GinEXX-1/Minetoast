import {create} from 'zustand';
export const preferencesKey='kw:settings:v1';
export type LineColor='cyan'|'gold'|'green'|'muted';
export type Theme='auto'|'night'|'day';
export type ResolvedTheme='night'|'day';
export type Preferences={theme:Theme;comfort:boolean;volume:number;colors:Partial<Record<LineColor,string>>};
export const defaultPreferences:Preferences={theme:'night',comfort:false,volume:1,colors:{}};
export const resolveTheme=(theme:Theme):ResolvedTheme=>theme==='auto'?(typeof window!=='undefined'&&window.matchMedia('(prefers-color-scheme: dark)').matches?'night':'day'):theme;
export function parsePreferences(raw:string|null):Preferences{
 try{const value=JSON.parse(raw??'null');return {theme:value?.theme==='auto'?'auto':value?.theme==='day'?'day':'night',comfort:value?.comfort===true,volume:typeof value?.volume==='number'&&Number.isFinite(value.volume)?Math.max(0,Math.min(1,value.volume)):1,colors:Object.fromEntries(Object.entries(value?.colors??{}).filter(([key,color])=>['cyan','gold','green','muted'].includes(key)&&typeof color==='string'&&/^#[0-9a-f]{6}$/i.test(color))) as Preferences['colors']};}catch{return {...defaultPreferences,colors:{}};}
}
function read(){try{return parsePreferences(localStorage.getItem(preferencesKey));}catch{return {...defaultPreferences,colors:{}};}}
const initial=read();
export const usePreferences=create<Preferences&{resolvedTheme:ResolvedTheme;storageError:boolean;update:(patch:Partial<Preferences>)=>void;refreshSystemTheme:()=>void}>(set=>({...initial,resolvedTheme:resolveTheme(initial.theme),storageError:false,refreshSystemTheme:()=>set(previous=>({resolvedTheme:resolveTheme(previous.theme)})),update:patch=>set(previous=>{
 const next:Preferences={theme:patch.theme??previous.theme,comfort:patch.comfort??previous.comfort,volume:patch.volume??previous.volume,colors:patch.colors??previous.colors};
 try{localStorage.setItem(preferencesKey,JSON.stringify(next));return {...next,resolvedTheme:resolveTheme(next.theme),storageError:false};}catch{return {...next,resolvedTheme:resolveTheme(next.theme),storageError:true};}
})}));
export const openSettings=()=>window.dispatchEvent(new Event('kw:open-settings'));
export function lineColors(renderer:'coordinate'|'geometry'|'solid',preferences:Preferences&{resolvedTheme?:ResolvedTheme}){
 const light={cyan:'#126276',gold:'#835318',green:'#2c6f44',muted:'#526476'},dark={cyan:'#75d8ef',gold:'#ffd27a',green:'#8fdaa9',muted:'#8c9cae'};
 const base=(preferences.resolvedTheme??resolveTheme(preferences.theme))==='day'?light:renderer==='solid'?{...dark,cyan:light.cyan,gold:light.gold}:dark;
 return {...base,...preferences.colors};
}

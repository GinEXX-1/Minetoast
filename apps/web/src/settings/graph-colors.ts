import type {NodeStatus} from '../../../../packages/domain/src/index';
import type {Preferences} from './preferences';

export function miniMapPalette(theme:Preferences['theme']):{background:string;mask:string;nodes:Record<NodeStatus,string>}{
 return theme==='day'
  ?{background:'#e9dfcb',mask:'rgba(233,223,203,.42)',nodes:{locked:'#756f62',available:'#996b23',unlocked:'#39734d'}}
  :{background:'#30343f',mask:'rgba(32,35,44,.65)',nodes:{locked:'#68717e',available:'#d9b563',unlocked:'#40aa75'}};
}

import brandLarge from './assets/brand/knowledge-world-1280.png';
import brandMedium from './assets/brand/knowledge-world-960.png';
import brandCompact from './assets/brand/knowledge-world-64.png';

export function KnowledgeWorldBrand({compact=false,href='/'}:{compact?:boolean;href?:string}){
 return <a className={`world-wordmark${compact?' world-wordmark--compact':''}`} href={href} aria-label="Knowledge World 高中数学">
  <picture><source media="(max-width:700px)" srcSet={brandCompact}/><source media="(max-width:1199px)" srcSet={brandMedium}/><img src={brandLarge} alt="Knowledge World" width={1280} height={720}/></picture>
  {!compact&&<small>高中数学</small>}
 </a>;
}

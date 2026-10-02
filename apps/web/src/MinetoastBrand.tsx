import brandLarge from './assets/brand/minetoast-1275.png';
import brandMedium from './assets/brand/minetoast-960.png';
import brandSmall from './assets/brand/minetoast-640.png';

type MinetoastBrandProps = {
  compact?: boolean;
  href?: string;
  className?: string;
};

export function MinetoastBrand({compact=false,href='/',className=''}:MinetoastBrandProps){
  const classes=['minetoast-brand',compact?'minetoast-brand--compact':'',className].filter(Boolean).join(' ');
  return <a className={classes} href={href} aria-label="Minetoast 高中数学">
    <picture>
      <source media="(max-width:700px)" srcSet={brandSmall}/>
      <source media="(max-width:1199px)" srcSet={brandMedium}/>
      <img src={brandLarge} alt="Minetoast" width={1275} height={221}/>
    </picture>
    {!compact&&<small>高中数学</small>}
  </a>;
}

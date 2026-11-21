'use strict';
(()=>{
const data=window.TERRAIN_PREVIEW,NS='http://www.w3.org/2000/svg';
const map=document.getElementById('terrain'),pins=document.getElementById('pins'),cards=document.getElementById('selections');
const open=new Set(),paperParts=[],markers=[],cutouts=new Map();
let latest=null;
let view='angle';
const svg=(tag,attrs,parent)=>{const n=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))n.setAttribute(k,v);parent?.append(n);return n;};
const defs=svg('defs',{},map);
const shadow=svg('filter',{id:'board-shadow',x:'-20%',y:'-20%',width:'140%',height:'150%'},defs);svg('feGaussianBlur',{stdDeviation:9},shadow);
const cutShadow=svg('filter',{id:'cut-shadow',x:'-20%',y:'-20%',width:'140%',height:'150%'},defs);svg('feDropShadow',{dx:0,dy:1.3,stdDeviation:.9,'flood-color':'#3c2e50','flood-opacity':.18},cutShadow);
const grain=svg('pattern',{id:'grain',width:128,height:128,patternUnits:'userSpaceOnUse'},defs);
const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const ctx=canvas.getContext('2d'),bitmap=ctx.createImageData(128,128);let seed=37;
for(let i=0;i<bitmap.data.length;i+=4){seed=(Math.imul(seed,1664525)+1013904223)>>>0;let v=seed>>>24;bitmap.data[i]=bitmap.data[i+1]=bitmap.data[i+2]=v>127?255:20;bitmap.data[i+3]=Math.abs(v-127)*.34;}ctx.putImageData(bitmap,0,0);svg('image',{width:128,height:128,href:canvas.toDataURL()},grain);
const board=[[0,0],[1000,0],[1000,650],[0,650],[0,0]];
const project=([x,y],z=0)=>view==='top'?[75+x,y+40-z*.16]:[115+x*.98-y*.16,100+x*.09+y*.70-z*.92];
const path=(rings,z=0)=>rings.map(r=>'M'+r.map(p=>project(p,z).map(n=>n.toFixed(2)).join(',')).join('L')+'Z').join('');
const drop=svg('path',{fill:'#372a43',opacity:.20,filter:'url(#board-shadow)'},map);
const terrain=svg('g',{id:'whole-terrain'},map);
function sheet(rings,z,fill,edge,opacity=1){
 const g=svg('g',{},terrain);
 const side=svg('path',{fill:edge,'fill-rule':'evenodd'},g);
 const face=svg('path',{fill,opacity,'fill-rule':'evenodd',stroke:edge,'stroke-width':.55,'stroke-linejoin':'round',filter:'url(#cut-shadow)'},g);
 const light=svg('path',{fill:'none',stroke:'#fff8ff','stroke-opacity':.38,'stroke-width':.6},g);
 const texture=svg('path',{fill:'url(#grain)',opacity:.27,'fill-rule':'evenodd'},g);
 paperParts.push({rings,z,side,face,light,texture});
}
for(let i=0;i<6;i++)sheet([board],-13+i*2.6,i%2?'#c2b8cd':'#d9d0e2','#a99db7');
sheet([board],3,'#e2dbea','#b6a9c5');
const purples=['#eee7f5','#e4d9ef','#d7c8e8','#c9b5e0','#bba0d7','#ab8bca','#9874bc','#8863ad','#77529d','#6b4890'];
const blues=['#e9f0f7','#d9e8f3','#c4deee','#b0d1e6','#99c1db','#80aed0','#699bc3','#5388b5','#4276a6','#396896'];
for(const layer of data.layers){
 const i=data.layers.indexOf(layer),g=svg('linearGradient',{id:'elevation-'+i,gradientUnits:'userSpaceOnUse',x1:100,y1:0,x2:1030,y2:130},defs);
 for(const [o,c]of [[0,purples[i]],[.35,purples[i]],[1,blues[i]]])svg('stop',{offset:o,'stop-color':c},g);
 for(const rings of layer.shapes){
  // Every level shares the same geographic pigment field; higher cuts deepen it.
  sheet(rings,layer.z+4,`url(#elevation-${i})`,'#91809f');
 }
}
const rivers=svg('g',{},map),riverParts=[];
for(const river of data.rivers){const edge=svg('path',{fill:'#8e9361','fill-rule':'evenodd'},rivers),water=svg('path',{fill:'#e4ef9d','fill-rule':'evenodd','stroke-linejoin':'round'},rivers);riverParts.push({rings:river.rings,edge,water});}
const slips=svg('g',{'pointer-events':'none'},map);
const links={M01:'case-needs.html',M02:'case-needs.html#from-concept',M03:'case-needs.html#five-minutes',M04:'case-needs.html#feature-decisions',M05:'case-needs.html#question-order',M09:'case-interaction.html',M10:'case-evidence.html',M14:'case-interaction.html'};
const notes={
 M01:'早期方案同时包含数字自我、目标任务和陪伴形态。组会提出目标用户、家庭场景及信息可见范围等问题，尚未确定最终产品。',
 M02:'比较心理机制与青少年游戏案例，拆解行动启动、理解经历与陪伴体验，形成早期定位和功能取舍笔记。',
 M03:'通过五分钟学习任务的模拟情境，区分题目太难、害怕再失败、疲惫和外部目标等受阻原因；产品记录与心理效果测量分开设计。',
 M04:'逐项追问功能的必要性，讨论目标是否由孩子自主选择，以及表达入口、信息权限与下一步支持。提出方案与团队采纳分别记录。',
 M05:'参与题项统筹，团队收集42份探索性答卷。复核支持偏好、隐私顾虑及探索分析；不以小样本推断总体需求。',
 M06:'梳理休息、表达、真人支持及现有数字工具，形成快捷表达与自由输入等候选取舍。公开扫描不等于实际试用。',
 M07:'历史记录确认身心支持与亲子任务两路并行。此处表示当时的分工，后续方案变化需要继续沿记录追踪。',
 M08:'追问实体硬件、动作识别和压力测量分别解决什么问题，同时核查角色许可与替代形式。技术可行性尚待原型验证。',
 M09:'提出把身体动作接入故事，以动作触发线索或剧情，并构思一个可暂停、可退出的回合。提议被接收不等于工程实现。',
 M10:'逐项核对研究人群、测量、比较条件及原始试验，审查瑜伽、韧性与脑源性神经营养因子之间的论证；研究审查与团队采用状态分开。',
 M11:'以相同任务比较游戏、普通跟练和硬件条件，整理机制摘录，并将近期交付收敛为概念情境与最小交互。',
 M12:'团队提出家长安排、共同协商与孩子自定任务的差别，追问奖励是否带来压力。这里保留历史问题清单，后续沿革尚待核查。',
 M13:'按真实经历、已有应对、支持偏好和约束分别整理材料，进行问卷复核、试编码与定向二手研究。尚未完成新的目标用户访谈。',
 M14:'具身叙事工作稿将探索、情节触发的身体操作及恢复自由行动连接起来。它是继续探索的概念方案，未证明效果，也不是团队唯一方向。',
 M15:'第三次讨论从单一瑜伽与韧性方向转向亲子表达，开始梳理各自表达、建立连接、走向线下的连续体验。不是对历史亲子任务路线的简单合并。',
 M16:'创作动作和拟声留言后，先由本人预览，可重做、私存、删除或主动分享。私人把玩不自动成为发送给家长的数据。',
 M17:'双方都能发起和接续留言，也能暂缓回应。家长端按需提供简短回应支持，熟悉动作可带到见面后的相处中。',
 M18:'轮流操控角色、尝试不同回应，并自愿把互动延伸到现实。它是共同游戏的候选机制，亲子关系改善仍待验证。',
 M19:'围绕队友的树懒方案追问目标年龄、声音识别依据与亲子交流方式，提出声音记录、回放等候选。与贴贴的版本关系仍待核查。',
 M20:'树懒方案出现在11月17日评审记录中。现有材料没有可明确归属的口头点评，后续书面反馈尚未取得。'
};
function toggle(node){
 const isOpen=!open.has(node.id);isOpen?open.add(node.id):open.delete(node.id);
 for(const b of document.querySelectorAll(`[data-node="${node.id}"]`))b.setAttribute('aria-expanded',String(isOpen));
 if(isOpen){
  const article=document.createElement('article');article.className='record';article.id='record-'+node.id;
  const close=document.createElement('button');close.className='close';close.textContent='×';close.setAttribute('aria-label','收回'+node.title);close.onclick=()=>{toggle(node);document.getElementById('pin-'+node.id).focus();};article.append(close);
  for(const[tag,cls,txt]of [['p','meta',node.id+' / 研究记录'],['h2','',node.title],['p','status',node.status],['p','',notes[node.id]],['p','source','依据 · '+node.source]]){const n=document.createElement(tag);n.className=cls;n.textContent=txt;article.append(n);}
  if(links[node.id]){const a=document.createElement('a');a.href=links[node.id];a.textContent='阅读相关案例 ↗';article.append(a);}
  cards.append(article);
 }else document.getElementById('record-'+node.id)?.remove();
 document.getElementById('empty').hidden=open.size>0;
 document.getElementById('announce').textContent=(isOpen?'已展开':'已收回')+node.title;
 latest=isOpen?node:data.nodes.find(n=>n.id===[...open].at(-1));
 const peek=document.getElementById('peek');peek.hidden=!latest;
 if(latest){document.getElementById('peek-title').textContent=latest.title;document.getElementById('peek-meta').textContent=latest.id+' / 已展开 '+open.size+' 处';document.getElementById('peek-status').textContent=latest.status;document.getElementById('peek-link').href='#record-'+latest.id;}
 renderSlips();
}
document.getElementById('peek-close').onclick=()=>{if(latest)toggle(latest);};
for(const node of data.nodes){
 const b=document.createElement('button');b.className='pin';b.id='pin-'+node.id;b.dataset.node=node.id;b.setAttribute('aria-label',node.title);b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls','record-'+node.id);b.onclick=()=>toggle(node);
 const label=document.createElement('span');label.className='pin-label';label.textContent=node.title;b.append(label);pins.append(b);markers.push({node,b});
 const entry=document.createElement('button');entry.dataset.node=node.id;entry.textContent=node.title;entry.setAttribute('aria-expanded','false');entry.onclick=()=>toggle(node);document.getElementById('index-list').append(entry);
}
function renderSlips(){
 for(const[id,c]of cutouts)if(!open.has(id)&&!c.closing){c.closing=true;c.g.classList.add('returning');c.timer=setTimeout(()=>{c.g.remove();cutouts.delete(id);},200);}
 for(const node of data.nodes.filter(n=>open.has(n.id))){
  // Lift an actual cutout of the neighbouring terrain. The original river and dot stay fixed.
  const [x,y]=project([node.x,node.y],4);
  const id='cut-'+node.id;
  const ring=[[x-35,y-44],[x+11,y-48],[x+35,y-26],[x+22,y-4],[x-24,y-9]];
  const d='M'+ring.map(p=>p.join(',')).join('L')+'Z';
  let c=cutouts.get(node.id);
  if(!c){
   defs.querySelector('#'+id)?.remove();
   const clip=svg('clipPath',{id},defs),mask=svg('path',{d},clip);
   const g=svg('g',{class:'lifted-cut',transform:'translate(-9,-14)'},slips);
   const shade=svg('path',{d,fill:'#564165',opacity:.25,transform:'translate(5,7)'},g);
   const sample=svg('g',{'clip-path':`url(#${id})`},g);svg('use',{href:'#whole-terrain'},sample);
   const outline=svg('path',{d,fill:'none',stroke:'#f8f3fc','stroke-width':1},g);
   c={g,mask,shade,outline};cutouts.set(node.id,c);
  }else if(c.closing){clearTimeout(c.timer);c.closing=false;c.g.classList.remove('returning');}
  for(const el of [c.mask,c.shade,c.outline])el.setAttribute('d',d);
 }
}
function draw(){
 drop.setAttribute('d',path([board],-23));
 for(const s of paperParts){s.side.setAttribute('d',path(s.rings,s.z-2));for(const n of [s.face,s.light,s.texture])n.setAttribute('d',path(s.rings,s.z));}
 for(const r of riverParts){r.edge.setAttribute('d',path(r.rings,4));r.water.setAttribute('d',path(r.rings,5.2));}
 for(const {node,b}of markers){const [x,y]=project([node.x,node.y],5.2);b.style.left=((x+30)/1200*100)+'%';b.style.top=((y-15)/720*100)+'%';}
 renderSlips();
}
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{view=b.dataset.view;document.querySelectorAll('[data-view]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));draw();});
document.getElementById('zoom').onclick=e=>{const scroll=document.querySelector('.map-scroll'),zoom=scroll.classList.toggle('zoomed');e.currentTarget.setAttribute('aria-pressed',String(zoom));e.currentTarget.textContent=zoom?'缩小查看 −':'放大查看 ＋';};
draw();
})();

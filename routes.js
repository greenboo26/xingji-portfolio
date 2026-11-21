/* 内部审阅稿。原有路线依据正式数据库和公开白名单，两条早期贡献核对至 PBL-021、PBL-022。 */
'use strict';

const nodeData=[
{id:'PBL-013',route:'MAIN',name:'初期方案没有统一的目标用户与形态',status:'11月3日 · 团队早期讨论',note:'初期设想包含数字自我、目标任务、随身或桌面陪伴。评审要求先澄清初中生使用场景、家长角色和数据权限，尚无最终形态。'},
{id:'PBL-021',route:'MAIN',name:'调研心理机制并拆解成长伙伴功能',status:'11月4日 · 个人案头研究',note:'建立含15条记录的研究库，比较青少年心理技能游戏的试验结果与真实使用，形成功能取舍和三层定位。'},
{id:'PBL-022',route:'MAIN',name:'设计产品记录与独立心理测量',status:'11月5日 · 个人测量与交互设计',note:'用五分钟学习任务区分受阻原因与下一步支持，提出最小数据范围。示例使用模拟记录。'},
{id:'PBL-001',route:'MAIN',name:'追问每项成长功能是否必要',status:'11月6日 · 个人发起问题',note:'在组会逐项追问冥想、自主设目标、休息和成就反馈要解决的具体困难，以及居家场景是否适合这些任务。'},
{id:'PBL-002',route:'MAIN',name:'提出三段式应对支持',status:'11月6日 · 个人提议，尚未验证',note:'提出梳理受挫经历、选择下一步、回顾尝试的候选流程。团队继续讨论倾诉与行动助手的衔接，采纳尚未确认。'},
{id:'PBL-003',route:'MAIN',name:'讨论表达入口与信息可见范围',status:'11月6日 · 个人提议与团队讨论',note:'我提出选项式开场和访问方式问题，团队同时讨论自由表达；声纹、表情等复杂感知尚无实现证据。'},
{id:'PBL-014',route:'MAIN',name:'质疑「理想目标」是否出自孩子自身',status:'11月6日 · 个人提问与共同讨论',note:'用成绩目标作为讨论例子，追问孩子自主选择与家长学校期待之间的关系；尚未直接验证目标所有权。'},
{id:'PBL-004',route:'MAIN',name:'提出先问真实经历与已有应对',status:'11月7—8日 · 团队探索性问卷',note:'我参与问卷研究问题与题项统筹，团队收集42份探索性答卷。数据不具有总体代表性，真实图表需授权后公开。'},
{id:'PBL-005',route:'MAIN',name:'将隐私与被监督顾虑列为设计约束',status:'11月8日 · 分析建议形成',note:'相关调查分析提出信息可见范围、是否允许拒绝和退出等问题；个人统计与写作分工尚未全部核实。'},
{id:'PBL-015',route:'MAIN',name:'两项探索性相关没有获得校正后支持',status:'11月8日 · 研究报告完成',note:'困扰与改变意愿、自由时间与兴趣的探索性检验经多重比较校正后不显著；不据此预先划分用户类型。'},
{id:'PBL-020',route:'MAIN',name:'梳理现有替代方法与研究缺口',status:'11月10—11日 · 首轮公开资料扫描',note:'形成公开资料扫描与研究流程框架。桌面研究并非亲自试用，也未证明真实付费或产品需求。'},
{id:'PBL-018',route:'MAIN',name:'将研究资料整理成功能取舍建议',status:'11月10日 · 建议已形成',note:'讨论快捷与自由表达入口，以及复杂表情、振动、自动识别能否后置；团队采纳未核实。'},
{id:'PBL-006',route:'MAIN',name:'团队确认两条方案并行探索',status:'11月10—11日 · 团队分工确认',note:'路线 A 是居家身心支持与瑜伽游戏，路线 B 是亲子任务与成长宠物。两条路线均处于概念探索阶段。'},
{id:'PBL-008',route:'A',name:'取消实体机器人，保留其他硬件候选',status:'11月11日 · 路线负责人决定',note:'负责人认为实体机器人成本与替代价值不足而不继续。我的参与是追问硬件必要性和设计比较条件；垫子与投影尚未确定。'},
{id:'PBL-016',route:'A',name:'追问角色素材的版权和许可',status:'11月11日 · 已提出授权问题',note:'曾对角色形象来源提出疑问，队友回复注意；没有取得明确授权结论，作品集采用原创示意。'},
{id:'PBL-017',route:'A',name:'先确定测量目标，再选择传感器',status:'11月11日 · 个人提问',note:'我追问手环、垫子和摄像头究竟为了测动作还是测压力；识别动作本身不能作为压力或韧性指标。'},
{id:'PBL-009',route:'A',name:'提出用身体动作推动剧情',status:'11月11日 · 提议已被接收',note:'个人提出心理技能游戏与瑜伽结合、动作触发剧情的方向；队友回复收到，没有已采纳、识别精度或效果证据。'},
{id:'PBL-010',route:'A',name:'审查瑜伽—韧性—BDNF证据链',status:'11月12日前 · 审查已形成，采纳待核',note:'逐项核对研究人群、测量指标和统计比较，提出撤回夸大因果与效果主张的建议。论文核查完成不等于团队已修改汇报。'},
{id:'PBL-011',route:'A',name:'组织同任务竞品与硬件比较',status:'11月12日 · 委托与界定桌面研究',note:'我界定比较任务，并借助人工智能整理公开资料。桌面研究已交付，实际试用与商业需求仍待验证。'},
{id:'PBL-012',route:'A',name:'构思一次可退出的交互课程',status:'11月12日 · 个人构思与人工智能辅助',note:'候选回合包含情境、选择与动作反馈等元素，但完整课程、专业审核、运动安全与用户测试均未完成。'},
{id:'PBL-019',route:'A',name:'将长期研究安排收敛为概念交付',status:'11月11—12日 · 优先级已更新',note:'优先完成概念使用情境、最小交互和证据边界；11月16日仅为计划节点，不能写成已经交付或通过。'},
{id:'PBL-007',route:'B',name:'亲子任务中谁有任务控制权',status:'11月11日 · 团队共同问题清单',note:'团队讨论家长安排、亲子协商与孩子自定任务，以及奖励是否造成压力；尚无个人逐条归属或测试结果。'}
];
const routeDetails = {
  all: {
    label: '共同主线及两条分支',
    title: '从成长伙伴到两条产品路线',
    summary: '团队先讨论居家支持的使用情境、表达方式及权限，再分别探索身心支持和亲子任务。',
    cases: [['浏览三个精选案例', '#cases']]
  },
  MAIN: {
    label: '共同主线',
    title: '初中生在家会主动使用什么支持？',
    summary: '我先调研心理机制和游戏案例，用五分钟学习情境设计记录方式。组会上，我提出先了解孩子的受挫经历与已有应对。团队随后开展探索问卷，并确认两条路线并行。',
    cases: [['阅读需求研究', 'case-needs.html']]
  },
  A: {
    label: '路线 A',
    title: '居家身心支持与瑜伽游戏',
    summary: '负责人取消实体机器人，继续探索垫子、投影和课程。我提出由动作触发剧情，并复核瑜伽相关证据。动作识别、投影的额外价值及运动安全仍待验证。',
    cases: [['阅读证据核查', 'case-evidence.html'], ['阅读动作交互', 'case-interaction.html']]
  },
  B: {
    label: '路线 B',
    title: '亲子任务与成长宠物',
    summary: '团队讨论由家长安排、亲子协商或孩子自定任务，以及宠物奖励可能带来的压力。现有记录是一份共同问题清单，具体归属与概念测试待核。',
    cases: []
  }
};

function initRoutes() {
  const root = document.getElementById('routes');
  const controls = [...root.querySelectorAll('.route-filters button')];
  const list = document.getElementById('record-list');
  const counts = {all:nodeData.length, MAIN:0, A:0, B:0};
  for (const node of nodeData) counts[node.route]++;
  for (const counter of root.closest('main').querySelectorAll('[data-count-route]')) {
    const count = String(counts[counter.dataset.countRoute]);
    counter.textContent = counter.hasAttribute('data-pad-count') ? count.padStart(2,'0') : count;
  }
  const recordLinks = {
    'PBL-021': ['阅读个人案头研究','case-needs.html#from-concept'],
    'PBL-022': ['阅读五分钟测量设计','case-needs.html#five-minutes']
  };

  const records = nodeData.map(node => {
    const item = document.createElement('li');
    const entry = document.createElement('details');
    const title = document.createElement('summary');
    const state = document.createElement('span');
    const description = document.createElement('p');
    title.textContent = node.name;
    state.className = 'record-state';
    state.textContent = node.status;
    title.append(state);
    description.textContent = node.note;
    entry.append(title, description);
    const related = recordLinks[node.id];
    if (related) {
      const [label, href] = related;
      const link = document.createElement('a');
      link.className = 'record-case-link';
      link.href = href;
      link.textContent = label+' ↗';
      entry.append(link);
    }
    item.append(entry);
    list.append(item);
    return {item, route:node.route};
  });

  function showRoute(route) {
    const url = new URL(window.location.href);
    if (route === 'all') url.searchParams.delete('route');
    else url.searchParams.set('route', route);
    if (url.href !== window.location.href) history.replaceState(history.state, '', url);

    const details = routeDetails[route];
    document.getElementById('route-kicker').textContent = route==='all' ? details.label : details.label+' · '+counts[route]+' 条记录';
    document.getElementById('route-title').textContent = details.title;
    document.getElementById('route-summary').textContent = details.summary;
    const links = details.cases.map(([label,href]) => {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = label+' ↗';
      return link;
    });
    if (route !== 'all') {
      const link = document.createElement('a');
      link.href = '#project-records';
      link.textContent = '查看本路线记录 ↓';
      links.unshift(link);
    }
    document.getElementById('route-links').replaceChildren(...links);
    for (const record of records) {
      record.item.hidden = route !== 'all' && record.route !== route;
    }
    document.getElementById('record-count').textContent = counts[route]+' 条';
    controls.forEach(button => button.setAttribute('aria-pressed',String(button.dataset.route===route)));
  }

  // The full terrain manages its own paper/card state. Route filters belong to the timeline.
  const map = root.querySelector('[data-terrain-version]')
    ? {selectRoute: showRoute}
    : mountPaperMap(root, showRoute);
  controls.forEach(button => button.addEventListener('click', () => map.selectRoute(button.dataset.route)));

  const initialRoute = new URLSearchParams(window.location.search).get('route');
  map.selectRoute(initialRoute !== null && Object.hasOwn(routeDetails, initialRoute) ? initialRoute : 'all');
}
document.addEventListener('DOMContentLoaded', initRoutes);

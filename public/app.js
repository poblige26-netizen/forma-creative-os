'use strict';
const $ = id => document.getElementById(id);
const stages = {idea:'Идеи',doing:'В работе',done:'Готово'};
const uid = () => crypto.randomUUID();
const key = 'forma.workspace.v1';
let config = {mode:'demo',token:''}, editing = null, pending = null;
const initial = () => ({version:1,active:'sample',projects:[{id:'sample',name:'Студия у моря',description:'Визуальная айдентика для маленькой творческой студии.',brief:'Создать айдентику для творческой студии у моря: логотип, палитру и три шаблона публикаций. Аудитория — независимые бренды и авторы.',tasks:[{id:uid(),title:'Найти визуальное направление',description:'Собрать 5 референсов: морской свет, архитектура, фактуры. Отметить подходящие композиции.',stage:'done'},{id:uid(),title:'Разработать знак студии',description:'Нарисовать три варианта. Проверить каждый на маленьком размере и в одном цвете.',stage:'doing'},{id:uid(),title:'Собрать шаблоны публикаций',description:'Обложка проекта, цитата и анонс. Объединить палитрой и типографикой.',stage:'idea'}]}]});
function validState(s){return s && s.version===1 && Array.isArray(s.projects) && s.projects.length>0 && s.projects.some(p=>p.id===s.active) && s.projects.every(p=>typeof p.id==='string' && typeof p.name==='string' && typeof p.description==='string' && typeof p.brief==='string' && Array.isArray(p.tasks) && p.tasks.every(t=>typeof t.id==='string' && typeof t.title==='string' && typeof t.description==='string' && Object.hasOwn(stages,t.stage)));}
let state;
try{const raw=localStorage.getItem(key);state=raw?JSON.parse(raw):initial();if(!validState(state))throw Error('Invalid workspace');}catch{state=initial();$('notice').textContent='Не удалось восстановить сохранение. Открыт пример проекта.';}
const project = () => state.projects.find(p=>p.id===state.active);
function announce(message){$('notice').textContent=message;}
function save(){try{localStorage.setItem(key,JSON.stringify(state));}catch{announce('Браузер не сохранил изменения. Выгрузи проект через «Экспорт».');}}
function element(tag,className,text){const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el;}
function render(){
  const p=project();$('name').textContent=p.name;$('crumb').textContent=p.name;$('summary').textContent=p.description;$('brief').value=p.brief;
  const done=p.tasks.filter(t=>t.stage==='done').length,percent=p.tasks.length?Math.round(done/p.tasks.length*100):0;
  $('percent').textContent=percent+'%';$('progress').value=percent;
  $('projects').replaceChildren();
  state.projects.forEach(item=>{const b=element('button','',item.name);b.setAttribute('aria-current',String(item.id===p.id));b.onclick=()=>{state.active=item.id;save();render();announce('');};$('projects').append(b);});
  $('board').replaceChildren();
  Object.entries(stages).forEach(([stage,label])=>{
    const column=element('section','column'),heading=element('h3','');heading.append(element('i','stage-dot'),document.createTextNode(label));
    const tasks=p.tasks.filter(t=>t.stage===stage);heading.append(element('span','',String(tasks.length)));column.append(heading);
    tasks.forEach(t=>{const card=element('article','task');const title=element('button','task-title',t.title);title.setAttribute('aria-label','Редактировать: '+t.title);title.onclick=()=>openTask(t);card.append(title,element('p','',t.description));
      const select=element('select','');select.setAttribute('aria-label','Этап: '+t.title);Object.entries(stages).forEach(([v,n])=>{const opt=element('option','',n);opt.value=v;select.append(opt);});select.value=t.stage;select.onchange=()=>{t.stage=select.value;save();render();announce('Этап задачи обновлён.');};card.append(select);column.append(card);});
    if(!tasks.length)column.append(element('p','empty','Здесь появятся задачи этого этапа.'));
    $('board').append(column);
  });
}
function openTask(task){editing=task?task.id:null;$('task-heading').textContent=task?'Редактировать задачу':'Новая задача';$('task-title').value=task?.title||'';$('task-description').value=task?.description||'';$('task-dialog').showModal();$('task-title').focus();}
$('new').onclick=()=>{$('project-form').reset();$('project-dialog').showModal();$('project-name').focus();};
$('add').onclick=()=>openTask(null);
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());
$('project-form').onsubmit=e=>{e.preventDefault();const name=$('project-name').value.trim();if(!name)return;const p={id:uid(),name,description:$('project-description').value.trim(),brief:'',tasks:[]};state.projects.push(p);state.active=p.id;save();render();$('project-dialog').close();announce('Проект создан. Опиши идею или добавь первую задачу.');};
$('task-form').onsubmit=e=>{e.preventDefault();const title=$('task-title').value.trim();if(!title)return;const description=$('task-description').value.trim();const existing=project().tasks.find(t=>t.id===editing);if(existing)Object.assign(existing,{title,description});else project().tasks.push({id:uid(),title,description,stage:'idea'});save();render();$('task-dialog').close();announce('Задача сохранена.');};
$('brief').oninput=()=>{project().brief=$('brief').value;save();};
function applyPlan(p,tasks,mode){p.tasks.push(...tasks.map(t=>({...t,id:uid()})));save();render();announce(mode==='ai'?'AI-план готов. Проверь задачи и уточни детали.':'Демонстрационный план добавлен. Это шаблон, а не ответ AI.');}
$('confirm-plan').onclick=()=>{if(pending)applyPlan(pending.project,pending.tasks,pending.mode);pending=null;$('confirm-dialog').close();};
$('confirm-dialog').addEventListener('close',()=>{pending=null;});
$('brief-form').onsubmit=async e=>{
  e.preventDefault();const p=project(),brief=$('brief').value.trim();if(brief.length<10){announce('Добавь несколько деталей: нужно минимум 10 символов.');return;}
  $('generate').disabled=true;$('generate').textContent='Собираю…';$('brief-form').setAttribute('aria-busy','true');announce('Разбиваю идею на шаги…');
  try{const response=await fetch('/api/plan',{method:'POST',headers:{'Content-Type':'application/json','X-Forma-Token':config.token},body:JSON.stringify({brief}),signal:AbortSignal.timeout(60000)});const data=await response.json();if(!response.ok)throw Error(data.error||'Не удалось собрать план.');
    if(state.active!==p.id){announce('План готов для другого проекта. Открой его и повтори генерацию.');return;}
    if(p.tasks.length){pending={project:p,tasks:data.tasks,mode:data.mode};$('confirm-dialog').showModal();}else applyPlan(p,data.tasks,data.mode);
  }catch(error){announce(error.name==='TimeoutError'?'AI отвечает слишком долго. Попробуй ещё раз.':error.message);}
  finally{$('generate').disabled=false;$('generate').textContent='Собрать план ↗';$('brief-form').removeAttribute('aria-busy');}
};
$('export').onclick=()=>{const p=project();const content=`# ${p.name}\n\n${p.description}\n\n## Идея\n${p.brief}\n\n`+Object.entries(stages).map(([s,label])=>`## ${label}\n\n`+p.tasks.filter(t=>t.stage===s).map(t=>`- [${s==='done'?'x':' '}] ${t.title}\n  ${t.description.replaceAll('\n','\n  ')}`).join('\n\n')).join('\n\n');const url=URL.createObjectURL(new Blob([content],{type:'text/markdown;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='forma-project.md';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);announce('Проект выгружен в Markdown.');};
render();
fetch('/api/config').then(r=>{if(!r.ok)throw Error();return r.json();}).then(c=>{config=c;$('mode').textContent=c.mode==='ai'?'AI подключён':'Демо-режим';$('disclosure').textContent=c.mode==='ai'?'Бриф отправляется в OpenAI для создания плана.':'Демонстрационный план по шаблону. Без отправки данных.';}).catch(()=>{$('mode').textContent='Сервер недоступен';$('generate').disabled=true;announce('Для генерации запусти локальный сервер. Редактор и экспорт доступны.');});

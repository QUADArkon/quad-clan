/* QUAD admin/easter-egg coordinator. Works with file:// and http(s) via postMessage. */
(function () {
  'use strict';
  function isDesktop() { var desktop=document.querySelector('.desktop-site'); return !!desktop && getComputedStyle(desktop).display!=='none'; }
  function sendToHeader(active) { var frame=document.querySelector('iframe.quad-header'); if(!frame||!frame.contentWindow)return; frame.contentWindow.postMessage({type:'quad-admin-arm',active:!!active&&isDesktop()},'*'); }
  function showAdminMenu() { if(!isDesktop())return; var frame=document.querySelector('iframe.quad-nav'); if(!frame||!frame.contentWindow)return; frame.contentWindow.postMessage({type:'quad-admin-show-menu'},'*'); }
  window.addEventListener('message',function(event){
    if(!event.data)return;
    if(event.data.type==='quad-admin-arm'){sendToHeader(event.data.active);return;}
    if(event.data.type==='quad-admin-header-complete'){showAdminMenu();return;}
    if(event.data.type==='quad-admin-logout'){
      sendToHeader(false);
      var nav=document.querySelector('iframe.quad-nav'); if(nav)nav.src=nav.getAttribute('src')||'nav.html';
      var main=document.querySelector('iframe.quad-main'); if(main)main.src='news/news.html';
    }
  });
  window.addEventListener('resize',function(){if(!isDesktop())sendToHeader(false);});
}());

/* QUAD Administration editor. Deliberately isolated from the coordinator above. */
(function(){
  'use strict';
  if(!document.body||!document.body.classList.contains('admin-page'))return;
  var $=function(id){return document.getElementById(id);};
  var TYPES={news:{file:'news-data.js',label:'NEWS ARCHIVE'},files:{file:'files-data.js',label:'FILES CATALOGUE'}};
  var CATS=['bots','engines','improvements','maps_mp','maps_sp','mods','tools'];
  var state={type:null,text:'',originalText:'',name:'',source:'',records:[],spans:[],bounds:null,dirty:false,mode:'',selected:-1};
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function fileName(){return state.type?TYPES[state.type].file:'';}
  function setStatus(text,bad){$('adminSourceStatus').textContent=text;$('adminSourceStatus').className=bad?'admin-status-bad':'admin-muted';}
  function findArray(text){var eq=text.indexOf('='),start=text.indexOf('[',eq<0?0:eq),depth=0,str=false,q='',escp=false;if(start<0)throw Error('Archive array not found.');for(var i=start;i<text.length;i++){var c=text[i];if(str){if(escp)escp=false;else if(c==='\\')escp=true;else if(c===q)str=false;continue;}if(c==='"'||c==="'"){str=true;q=c;}else if(c==='[')depth++;else if(c===']'&&--depth===0)return{start:start,end:i};}throw Error('Archive array is incomplete.');}
  function parseRecord(raw){try{return JSON.parse(raw);}catch(e){try{return Function('"use strict";return ('+raw+');')();}catch(x){throw Error('Invalid archive record: '+x.message);}}}
  function parseArchive(text){var b=findArray(text),out=[],depth=0,str=false,q='',escp=false,start=-1;for(var i=b.start+1;i<b.end;i++){var c=text[i];if(str){if(escp)escp=false;else if(c==='\\')escp=true;else if(c===q)str=false;continue;}if(c==='"'||c==="'"){str=true;q=c;}else if(c==='{'){if(depth++===0)start=i;}else if(c==='}'&&--depth===0){var raw=text.slice(start,i+1);out.push({start:start,end:i+1,raw:raw,obj:parseRecord(raw)});}}return{bounds:b,spans:out,records:out.map(function(x){return x.obj;})};}
  function loadArchive(text,name,source,keepOriginal){var parsed=parseArchive(text);state.text=text;if(keepOriginal!==false)state.originalText=text;state.name=name||fileName();state.source=source;state.records=parsed.records;state.spans=parsed.spans;state.bounds=parsed.bounds;state.selected=-1;state.dirty=false;$('adminModeTabs').hidden=false;$('adminDownload').hidden=false;setStatus(state.name+' | '+state.records.length+' records | '+source,false);setMode('new');}
  function verify(text,count){var parsed=parseArchive(text);if(parsed.records.length!==count)throw Error('Record verification failed: expected '+count+', found '+parsed.records.length+'.');return parsed;}
  function replaceRecord(index,raw){var span=state.spans[index],out=state.text.slice(0,span.start)+raw+state.text.slice(span.end);verify(out,state.records.length);return out;}
  function insertRecord(raw){var has=state.text.slice(state.bounds.start+1,state.bounds.end).trim(),out=state.text.slice(0,state.bounds.start+1)+'\n'+raw+(has?',':'')+state.text.slice(state.bounds.start+1);verify(out,state.records.length+1);return out;}
  function deleteRecord(index){var span=state.spans[index],left=span.start,right=span.end,before=state.text.slice(0,left),after=state.text.slice(right),commaAfter=after.match(/^\s*,/),commaBefore=before.match(/,\s*$/);if(commaAfter)right+=commaAfter[0].length;else if(commaBefore)left-=commaBefore[0].length;var out=state.text.slice(0,left)+state.text.slice(right);verify(out,state.records.length-1);return out;}
  function applyChange(text,message){var parsed=verify(text,parseArchive(text).records.length);state.text=text;state.records=parsed.records;state.spans=parsed.spans;state.bounds=parsed.bounds;state.selected=-1;state.dirty=true;setStatus(message+' | '+state.records.length+' records verified',false);renderMode();}
  function saveBlob(text,name){var url=URL.createObjectURL(new Blob([text],{type:'text/javascript;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url);},1000);}
  function timestamp(){var d=new Date(),p=function(n){return String(n).padStart(2,'0');};return d.getFullYear()+p(d.getMonth()+1)+p(d.getDate())+'-'+p(d.getHours())+p(d.getMinutes());}
  function downloadArchive(){if(!state.text)return false;verify(state.text,state.records.length);if($('adminBackup').checked&&state.originalText){var base=fileName().replace(/\.js$/,'');saveBlob(state.originalText,base+'-backup-'+timestamp()+'.js');}saveBlob(state.text,fileName());state.dirty=false;setStatus(fileName()+' downloaded | '+state.records.length+' records verified',false);return true;}
  function dialog(title,text,buttons){$('adminModalTitle').textContent=title;$('adminModalText').textContent=text;var host=$('adminModalActions');host.innerHTML='';buttons.forEach(function(x){var b=document.createElement('button');b.type='button';b.className='admin-button'+(x.danger?' admin-button-danger':'');b.textContent=x.label;b.onclick=function(){$('adminModal').hidden=true;x.run();};host.appendChild(b);});$('adminModal').hidden=false;}
  function chooseType(type){if(state.type===type)return;if(state.dirty){dialog('Unsaved changes',fileName()+' has not been downloaded.',[{label:'DOWNLOAD',run:function(){downloadArchive();openType(type);}},{label:'DISCARD',danger:true,run:function(){openType(type);}},{label:'CANCEL',run:function(){}}]);}else openType(type);}
  function openType(type){state={type:type,text:'',originalText:'',name:'',source:'',records:[],spans:[],bounds:null,dirty:false,mode:'',selected:-1};document.querySelectorAll('[data-admin-archive]').forEach(function(b){b.classList.toggle('is-active',b.dataset.adminArchive===type);});$('adminSourceTitle').textContent=TYPES[type].label;$('adminLoadLabel').hidden=false;$('adminDownload').hidden=true;$('adminModeTabs').hidden=true;$('adminEmpty').hidden=false;$('adminEmpty').textContent=location.protocol==='file:'?'Offline mode: load '+fileName()+'.':'Loading '+fileName()+' from site...';$('adminNewPane').hidden=true;$('adminEditPane').hidden=true;setStatus('No archive loaded.',false);if(/^https?:$/.test(location.protocol))autoload();}
  async function autoload(){try{var response=await fetch('../js/'+fileName(),{cache:'no-store'});if(!response.ok)throw Error('HTTP '+response.status);loadArchive(await response.text(),fileName(),'SITE',true);}catch(e){setStatus('Automatic load failed. Use LOAD LOCAL COPY.',true);}}
  function setMode(mode){if(!state.text)return;state.mode=mode;document.querySelectorAll('[data-admin-mode]').forEach(function(b){b.classList.toggle('is-active',b.dataset.adminMode===mode);});$('adminEmpty').hidden=true;$('adminNewPane').hidden=mode!=='new';$('adminEditPane').hidden=mode!=='edit';renderMode();}
  function renderMode(){if(state.type==='news')renderNews();else renderFiles();}
  function bodyHtml(r){return Array.isArray(r.content)?r.content.map(function(x){return x&&x.html||'';}).join(''):String(r.content||'');}
    function renderNewsPreview(container,news){
      container.innerHTML='';
      var header=document.createElement('header');header.className='news-header';
      var title=document.createElement('div');title.className='news-title';
      title.innerHTML='<img src="../images/news/menudot_l.gif" alt="" width="28" height="15"><strong></strong><img src="../images/news/menudot_r.gif" alt="" width="28" height="15">';
      title.querySelector('strong').textContent=news.title||'';
      var meta=document.createElement('div');meta.className='news-meta';
      var d=String(news.date||''),dateText=d;
      if(/^\d{8}$/.test(d)){var dt=new Date(Number(d.slice(0,4)),Number(d.slice(4,6))-1,Number(d.slice(6,8)));dateText=dt.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});}
      meta.appendChild(document.createTextNode('Posted on '+dateText+' by '));
      if(news.author==='Arkon'||news.author==='Raistlin'){var a=document.createElement('a');a.href=news.author==='Arkon'?'../members/arkon.html':'../members/raistlin.html';a.textContent=news.author;meta.appendChild(a);}else meta.appendChild(document.createTextNode(news.author||''));
      header.append(title,meta);
      var content=document.createElement('div');content.className='news-content';
      (news.content||[]).forEach(function(block){if(block.type==='paragraph'){var p=document.createElement('p');p.innerHTML=block.html||'';content.appendChild(p);}else if(block.type==='command'){var p=document.createElement('p'),span=document.createElement('span');span.className='news-command';span.textContent=block.text||'';p.appendChild(span);content.appendChild(p);}});
      container.append(header,content);
      container.onclick=function(event){event.preventDefault();};
    }
  function renderNews(){if(state.mode==='new')renderNewsNew();else renderNewsEdit();}
  function renderNewsNew(){$('adminNewPane').innerHTML='<div class="admin-grid-new"><section class="admin-panel"><h2>New news</h2><div class="admin-field"><label>Title</label><input id="nnTitle"></div><div class="admin-field"><label>Author</label><input id="nnAuthor" value="Arkon"></div><div class="admin-field"><label>Date (YYYYMMDD)</label><input id="nnDate"></div><div class="admin-field"><label>HTML</label><textarea id="nnBody"></textarea></div><div class="admin-actions"><button id="nnInsert" class="admin-button">INSERT NEWS</button></div><div id="nnMessage"></div></section><section class="admin-panel"><h2>Preview</h2><div id="nnPreview" class="admin-preview"></div></section></div>';function preview(){renderNewsPreview($('nnPreview'),{title:$('nnTitle').value||'Untitled news',date:$('nnDate').value,author:$('nnAuthor').value,content:[{type:'paragraph',html:$('nnBody').value}]});}['nnTitle','nnAuthor','nnDate','nnBody'].forEach(function(id){$(id).oninput=preview;});$('nnInsert').onclick=function(){try{var d=$('nnDate').value.trim(),title=$('nnTitle').value.trim(),author=$('nnAuthor').value.trim(),html=$('nnBody').value.trim();if(!/^\d{8}$/.test(d)||!title||!author||!html)throw Error('Complete all required fields.');var record={id:d+'-'+title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''),date:d,author:author,title:title,content:[{type:'paragraph',html:html}]};applyChange(insertRecord(JSON.stringify(record,null,2)),'News inserted');}catch(e){$('nnMessage').textContent=e.message;}};preview();}
  function renderNewsEdit(){renderRecordList('news');}
  function renderFiles(){if(state.mode==='new')renderFilesNew();else renderRecordList('files');}
  function displayFileDate(value){
    var v=String(value||''),m=v.match(/^(\d{4})(\d{2})(\d{2})$/);
    return m?m[2]+'/'+m[3]+'/'+m[1]:v;
  }
  function renderFilePreview(container,file){
    var href=file.url||('../files/'+file.category+'/'+file.filename);
    container.innerHTML='<article class="file-entry"><h4 class="file-title"></h4><p class="file-description"></p><p class="file-meta"></p><a class="file-download" href="#"></a></article>';
    container.querySelector('.file-title').textContent=file.title||'';
    container.querySelector('.file-description').textContent=file.description||'';
    var meta=[];
    if(file.version)meta.push('Version: '+file.version);
    if(file.author)meta.push('Author: '+file.author);
    if(file.size)meta.push('Size: '+file.size);
    if(file.date)meta.push('Date: '+displayFileDate(file.date));
    container.querySelector('.file-meta').textContent=meta.join(' | ');
    var link=container.querySelector('.file-download');
    link.textContent='Download '+(file.filename||'');link.title=href;
    link.onclick=function(event){event.preventDefault();};
  }
  function generateFileId(title){
    var base=String(title||'file').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'')||'file';
    var used=new Set(state.records.map(function(r){return String(r.id||'');}));
    if(!used.has(base))return base;
    var n=2;while(used.has(base+'-'+n))n++;return base+'-'+n;
  }
  function renderFilesNew(){
    $('adminNewPane').innerHTML='<div class="admin-grid-new"><section class="admin-panel"><h2>New file</h2><div class="admin-field"><label>Category</label><select id="nfCategory">'+CATS.map(function(c){return'<option>'+c+'</option>';}).join('')+'</select></div><div class="admin-field"><label>Title</label><input id="nfTitle"></div><div class="admin-field"><label>Latest title</label><input id="nfLatestTitle"><div class="admin-muted">Displayed in the Latest Files box on News.</div></div><div class="admin-field"><label>Filename</label><input id="nfFilename"></div><div class="admin-field"><label>External URL</label><input id="nfUrl"><div class="admin-muted">Enter only for externally hosted files.</div></div><div class="admin-field"><label>Date (YYYYMMDD)</label><input id="nfDate"></div><div class="admin-field"><label>Version</label><input id="nfVersion"></div><div class="admin-field"><label>Author</label><input id="nfAuthor"></div><div class="admin-field"><label>Size</label><input id="nfSize"></div><div class="admin-field"><label>Description</label><textarea id="nfDescription"></textarea></div><div class="admin-field"><label><input id="nfActive" type="checkbox" checked> Active</label></div><div class="admin-actions"><button id="nfInsert" class="admin-button">INSERT FILE</button></div><div id="nfMessage"></div></section><section class="admin-panel"><h2>Preview</h2><div id="nfPreview" class="admin-preview"></div></section></div>';
    var latestTouched=false;
    function preview(){if(!latestTouched)$('nfLatestTitle').value=$('nfTitle').value;renderFilePreview($('nfPreview'),{category:$('nfCategory').value,title:$('nfTitle').value||'Untitled file',filename:$('nfFilename').value,url:$('nfUrl').value.trim(),date:$('nfDate').value,version:$('nfVersion').value,author:$('nfAuthor').value,size:$('nfSize').value,description:$('nfDescription').value});}
    $('nfLatestTitle').oninput=function(){latestTouched=true;preview();};
    ['nfCategory','nfTitle','nfFilename','nfUrl','nfDate','nfVersion','nfAuthor','nfSize','nfDescription','nfActive'].forEach(function(id){$(id).oninput=preview;});
    $('nfInsert').onclick=function(){try{var title=$('nfTitle').value.trim(),latest=$('nfLatestTitle').value.trim(),url=$('nfUrl').value.trim();var r={id:generateFileId(title),category:$('nfCategory').value,title:title,latestTitle:latest,filename:$('nfFilename').value.trim()};if(url)r.url=url;r.date=$('nfDate').value.trim();r.version=$('nfVersion').value.trim();r.author=$('nfAuthor').value.trim();r.size=$('nfSize').value.trim();r.description=$('nfDescription').value.trim();r.active=$('nfActive').checked;if(!r.title||!r.latestTitle||!r.filename||!/^\d{8}$/.test(r.date)||!r.version||!r.author||!r.size||!r.description)throw Error('Complete all required fields.');applyChange(insertRecord(JSON.stringify(r,null,2)),'File inserted');}catch(e){$('nfMessage').textContent=e.message;}};
    preview();
  }
  function renderRecordList(type){$('adminEditPane').innerHTML='<div class="admin-grid-edit"><aside class="admin-panel admin-list-panel"><h2>'+(type==='news'?'Archive':'Catalogue')+'</h2><input id="recordSearch" class="admin-search-input" placeholder="Search..."><div id="recordList" class="admin-list"></div><div id="recordCount" class="admin-count"></div></aside><section id="recordEditor" class="admin-panel"><h2>Select a record</h2></section><section id="recordPreview" class="admin-panel admin-preview-panel"><h2>Preview</h2></section></div>';function draw(){var q=$('recordSearch').value.toLowerCase(),rows=state.records.map(function(r,i){return{r:r,i:i};}).filter(function(x){return JSON.stringify(x.r).toLowerCase().includes(q);});$('recordList').innerHTML=rows.map(function(x){return'<button type="button" data-index="'+x.i+'">'+esc(x.r.title||x.r.filename||x.r.id||'(untitled)')+'<small>'+esc(type==='news'?(x.r.date||''):(x.r.category||''))+'</small></button>';}).join('');$('recordCount').textContent=rows.length+' of '+state.records.length+' records';$('recordList').querySelectorAll('button').forEach(function(b){b.onclick=function(){editRecord(type,Number(b.dataset.index));};});} $('recordSearch').oninput=draw;draw();}
  function editRecord(type,index){var r=state.records[index],editor=$('recordEditor'),preview=$('recordPreview');if(type==='news'){editor.innerHTML='<h2>Edit news</h2><div class="admin-field"><label>Title</label><input id="eTitle" value="'+esc(r.title||'')+'"></div><div class="admin-field"><label>Author</label><input id="eAuthor" value="'+esc(r.author||'')+'"></div><div class="admin-field"><label>Date</label><input id="eDate" value="'+esc(r.date||'')+'"></div><div class="admin-field"><label>HTML</label><textarea id="eBody">'+esc(bodyHtml(r))+'</textarea></div><div class="admin-actions"><button id="eSave" class="admin-button">SAVE CHANGES</button><button id="eDelete" class="admin-button admin-button-danger">DELETE</button></div>';function current(){var x=JSON.parse(JSON.stringify(r));x.title=$('eTitle').value.trim();x.author=$('eAuthor').value.trim();x.date=$('eDate').value.trim();x.content=[{type:'paragraph',html:$('eBody').value}];return x;}function pv(){var x=current();preview.innerHTML='<h2>Preview</h2><div id="adminEditNewsPreview" class="admin-preview"></div>';renderNewsPreview($('adminEditNewsPreview'),x);}['eTitle','eAuthor','eDate','eBody'].forEach(function(id){$(id).oninput=pv;});$('eSave').onclick=function(){applyChange(replaceRecord(index,JSON.stringify(current(),null,2)),'News updated');};$('eDelete').onclick=function(){applyChange(deleteRecord(index),'News deleted');};pv();}else{editor.innerHTML='<h2>Edit file</h2><div class="admin-field"><label>Category</label><select id="eCategory">'+CATS.map(function(c){return'<option'+(c===r.category?' selected':'')+'>'+c+'</option>';}).join('')+'</select></div><div class="admin-field"><label>Title</label><input id="eTitle" value="'+esc(r.title||'')+'"></div><div class="admin-field"><label>Latest title</label><input id="eLatestTitle" value="'+esc(r.latestTitle||'')+'"><div class="admin-muted">Displayed in the Latest Files box on News.</div></div><div class="admin-field"><label>Filename</label><input id="eFilename" value="'+esc(r.filename||'')+'"></div><div class="admin-field"><label>External URL</label><input id="eUrl" value="'+esc(r.url||'')+'"><div class="admin-muted">Enter only for externally hosted files.</div></div><div class="admin-field"><label>Date (YYYYMMDD)</label><input id="eFileDate" value="'+esc(r.date||'')+'"></div><div class="admin-field"><label>Version</label><input id="eVersion" value="'+esc(r.version||'')+'"></div><div class="admin-field"><label>Author</label><input id="eFileAuthor" value="'+esc(r.author||'')+'"></div><div class="admin-field"><label>Size</label><input id="eSize" value="'+esc(r.size||'')+'"></div><div class="admin-field"><label>Description</label><textarea id="eDescription">'+esc(r.description||'')+'</textarea></div><div class="admin-field"><label><input id="eActive" type="checkbox" '+(r.active===true?'checked':'')+'> Active</label></div><div class="admin-actions"><button id="eSave" class="admin-button">SAVE CHANGES</button><button id="eDelete" class="admin-button admin-button-danger">DELETE</button></div>';function current(){var x=JSON.parse(JSON.stringify(r));x.category=$('eCategory').value;x.title=$('eTitle').value.trim();x.latestTitle=$('eLatestTitle').value.trim();x.filename=$('eFilename').value.trim();var u=$('eUrl').value.trim();if(u)x.url=u;else delete x.url;x.date=$('eFileDate').value.trim();x.version=$('eVersion').value.trim();x.author=$('eFileAuthor').value.trim();x.size=$('eSize').value.trim();x.description=$('eDescription').value;x.active=$('eActive').checked;return x;}function pv(){var x=current();preview.innerHTML='<h2>Preview</h2><div id="adminEditFilePreview" class="admin-preview"></div>';renderFilePreview($('adminEditFilePreview'),x);}['eCategory','eTitle','eLatestTitle','eFilename','eUrl','eFileDate','eVersion','eFileAuthor','eSize','eDescription','eActive'].forEach(function(id){$(id).oninput=pv;});$('eSave').onclick=function(){var x=current();if(!x.title||!x.latestTitle||!x.filename||!/^\d{8}$/.test(x.date)||!x.version||!x.author||!x.size||!x.description)return;applyChange(replaceRecord(index,JSON.stringify(x,null,2)),'File updated');};$('eDelete').onclick=function(){applyChange(deleteRecord(index),'File deleted');};pv();}}
  function logout(){if(state.dirty&&!confirm('Discard unsaved changes and log out?'))return;window.parent.postMessage({type:'quad-admin-logout'},'*');}
  document.querySelectorAll('[data-admin-archive]').forEach(function(b){b.onclick=function(){chooseType(b.dataset.adminArchive);};});
  document.querySelectorAll('[data-admin-mode]').forEach(function(b){b.onclick=function(){setMode(b.dataset.adminMode);};});
  $('adminFileInput').onchange=async function(e){var f=e.target.files[0];if(!f)return;try{loadArchive(await f.text(),f.name,'LOCAL',true);}catch(x){setStatus(x.message,true);}e.target.value='';};
  $('adminDownload').onclick=downloadArchive;
  $('adminLogout').onclick=logout;
  if(innerWidth<=767){$('adminWorkspace').hidden=true;$('adminDesktopOnly').hidden=false;}
}());

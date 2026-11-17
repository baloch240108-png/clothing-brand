/* Shared data layer (localStorage acts as the database), layout, cart helpers */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const load=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v??d}catch(e){return d}};
const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const money=n=>'PKR '+Number(n).toLocaleString('en-PK');
const STAGES=['Order Placed','Order Confirmed','Processing','Packed','Shipped','Out for Delivery','Delivered'];
const ph=(c,bg)=>'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect width="400" height="500" fill="${bg}"/><circle cx="200" cy="105" r="40" fill="#e0b99a"/><path d="M125 185q75-42 150 0l32 175h-62l-10 130h-40l-10-120-10 120h-40l-10-130h-62z" fill="${c}"/><text x="200" y="488" font-size="14" text-anchor="middle" fill="#fff9">Replace with model photo in Admin</text></svg>`);
const SZ=['S','M','L','XL','XXL'];
function seed(){
 if(!load('settings'))save('settings',{brand:'Threadline',phone:'+92 300 0000000',wa:'923000000000',email:'hello@threadline.pk',addr:'Main Boulevard, Faisalabad, Pakistan',promo:'Free delivery over PKR 5,000',banner:'Winter Sale — up to 30% off hoodies & jackets',pass:'admin123'});
 if(!load('cats'))save('cats',['T-Shirts','Hoodies','Jeans','Jackets','Traditional Wear']);
 if(!load('products')){
  const P=(n,d,cat,g,c1,bg,price,sale,cols,nw)=>({id:'p'+(Math.random()*1e9|0),name:n,desc:d,cat,gender:g,sizes:SZ,colors:cols,price,sale,isNew:nw,imgs:[ph(c1,bg),ph('#0b2a5b',bg),ph('#faf6ee','#d62839')]});
  save('products',[
   P('Crimson Classic Tee','Soft combed cotton, relaxed fit.','T-Shirts','Men','#d62839','#143b7a',1800,1350,['Red','Navy','White'],1),
   P('Harbor Oversized Hoodie','Heavy fleece with kangaroo pocket.','Hoodies','Men','#0b2a5b','#d62839',4500,3600,['Navy','Red','Grey'],1),
   P('Indigo Slim Jeans','Stretch denim, mid-rise.','Jeans','Men','#143b7a','#faf6ee',3800,3200,['Indigo','Black'],0),
   P('Storm Bomber Jacket','Water-resistant shell, ribbed cuffs.','Jackets','Men','#0b2a5b','#d62839',7200,5900,['Navy','Black'],1),
   P('Rose Everyday Tee','Lightweight tee with soft drape.','T-Shirts','Women','#d62839','#faf6ee',1700,1400,['Red','White','Blue'],0),
   P('Ruby Cropped Hoodie','Cropped fit, brushed inside.','Hoodies','Women','#b01e2d','#143b7a',4200,3500,['Red','Navy'],1),
   P('Sky High-Waist Jeans','Wide-leg, high-rise denim.','Jeans','Women','#3d6fc0','#faf6ee',4000,3400,['Light Blue','Indigo'],0),
   P('Embroidered Kurta','Cotton kurta with hand-style embroidery.','Traditional Wear','Women','#d62839','#0b2a5b',5500,4600,['Red','Blue','Off-White'],1),
   P('Classic Shalwar Kameez','Wash-and-wear fabric, tailored cut.','Traditional Wear','Men','#faf6ee','#0b2a5b',6200,5200,['Off-White','Navy'],0)
  ]);
 }
 if(!load('orders'))save('orders',[]);
}
seed();
const S=()=>load('settings'),prods=()=>load('products',[]),getP=id=>prods().find(p=>p.id===id);
const cur=p=>p.sale&&p.sale<p.price?p.sale:p.price;
function priceHTML(p){return `<span class="pr">${money(cur(p))}${cur(p)<p.price?`<s>${money(p.price)}</s>`:''}</span>`}
const cart=()=>load('cart',[]);
function addCart(id,size,color,qty=1){const c=cart(),p=getP(id);size=size||p.sizes[0];color=color||p.colors[0];
 const f=c.find(i=>i.id===id&&i.size===size&&i.color===color);f?f.qty+=qty:c.push({id,size,color,qty});save('cart',c);cnt()}
function cnt(){const e=$('#cc');if(e)e.textContent=cart().reduce((a,i)=>a+i.qty,0)}
function card(p,i=0){return `<article class="card rv ${i%2?'':'l'}" style="transition-delay:${(i%4)*80}ms"><a class="im" href="#/product?id=${p.id}"><img loading="lazy" src="${p.imgs[0]}" alt="${p.name}">${cur(p)<p.price?'<span class="tag">SALE</span>':p.isNew?'<span class="tag">NEW</span>':''}</a><div class="bd"><h3>${p.name}</h3><div class="d">${p.desc}</div>${priceHTML(p)}<div class="meta">Sizes: ${p.sizes.join(', ')}<br>Colors: ${p.colors.join(', ')}</div><div class="acts"><button class="btn sm b" onclick="quick('${p.id}',0)">Add to Cart</button><button class="btn sm" onclick="quick('${p.id}',1)">Buy Now</button></div></div></article>`}
function quick(id,go){addCart(id);if(go)location.href='#/cart';else toast('Added to cart')}
function toast(t){const d=document.createElement('div');d.textContent=t;d.style.cssText='position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#0b2a5b;color:#fff;padding:12px 22px;border-radius:30px;z-index:99;border-left:5px solid #d62839';document.body.append(d);setTimeout(()=>d.remove(),1800)}
function grid(el,list){el.innerHTML=list.length?list.map(card).join(''):'<p>No products found.</p>';reveal()}
function reveal(){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});$$('.rv:not(.in)').forEach(e=>io.observe(e))}
function layout(){const s=S();
 $('#hdr').innerHTML=`<div class="top"><span>${s.promo}</span><a href="tel:${s.phone.replace(/\s/g,'')}">📞 Call to Order: ${s.phone}</a><a href="https://wa.me/${s.wa}">💬 WhatsApp Order: +${s.wa}</a></div><nav class="nav"><a class="logo" href="#/">${s.brand}</a><button id="mb" aria-label="Menu">☰</button><div class="links" id="lk"><a href="#/">Home</a><a href="#/shop?g=Men">Men</a><a href="#/shop?g=Women">Women</a><a href="#/shop?new=1">New Arrivals</a><a href="#/shop">Collections</a><a href="#/contact">Contact Us</a><a href="#/track">Track Order</a></div><a class="cartb" href="#/cart">🛒 <b id="cc">0</b></a></nav>`;
 $('#ftr').innerHTML=`<footer><div class="wrap"><div class="fg"><div><h4 class="logo">${s.brand}</h4><p>Modern everyday and traditional clothing, made for Pakistan.</p></div><div><h4>Contact</h4><a href="tel:${s.phone.replace(/\s/g,'')}">📞 ${s.phone}</a><a href="https://wa.me/${s.wa}">💬 WhatsApp +${s.wa}</a><a href="mailto:${s.email}">✉ ${s.email}</a><a>📍 ${s.addr}</a></div><div><h4>Follow</h4><a href="https://instagram.com" target="_blank">Instagram</a><a href="https://facebook.com" target="_blank">Facebook</a><a href="https://tiktok.com" target="_blank">TikTok</a></div><div><h4>Policies</h4><a href="#/policy?s=privacy">Privacy Policy</a><a href="#/policy?s=terms">Terms and Conditions</a><a href="#/policy?s=returns">Return and Exchange Policy</a><a href="#/admin">Admin</a></div></div><div class="copy">© ${new Date().getFullYear()} ${s.brand}. All prices in PKR.</div></div></footer>`;
 $('#mb').onclick=()=>$('#lk').classList.toggle('open');cnt();reveal();
 }
addEventListener('scroll',()=>{const b=$('.hbg');if(b)b.style.transform=`translateY(${scrollY*.3}px)`},{passive:true});

/* ===== home page ===== */
function viewHome(){const s=S(),P=prods();
 $('#cats').innerHTML=load('cats').map(c=>`<a class="cat rv" href="#/shop?c=${encodeURIComponent(c)}">${c}</a>`).join('');
 grid($('#feat'),P.slice(0,4));grid($('#new'),P.filter(p=>p.isNew).slice(0,4));
 $('#bn').textContent=s.banner;
 $('#ordbox').innerHTML=`<div><h2>Place your order</h2><p>Order by WhatsApp or phone, or use the cart.</p></div><div><p>WhatsApp Order</p><a class="btn wa" href="https://wa.me/${s.wa}?text=${encodeURIComponent('Hi, I want to place an order.')}">+${s.wa}</a></div><div><p>Call to Order</p><a class="btn" href="tel:${s.phone.replace(/\s/g,'')}">${s.phone}</a></div>`;
 reveal()}
/* ===== shop page ===== */
function viewShop(){const q=Q,g=q.get('g'),c=q.get('c'),nw=q.get('new');
 let L=prods();if(g)L=L.filter(p=>p.gender===g||p.gender==='Unisex');if(c)L=L.filter(p=>p.cat===c);if(nw)L=L.filter(p=>p.isNew);
 $('#t').textContent=nw?'New Arrivals':g?(g==='Men'?"Men's Clothing":"Women's Clothing"):c||'Collections';
 $('#n').textContent=L.length+' items';
 const base=g?'g='+g+'&':'';
 $('#chips').innerHTML=`<a class="chip ${!c&&!nw?'on':''}" href="#/shop${g?'?g='+g:''}">All</a>`+load('cats').map(x=>`<a class="chip ${c===x?'on':''}" href="#/shop?${base}c=${encodeURIComponent(x)}">${x}</a>`).join('');
 grid($('#g'),L)}
/* ===== product page ===== */
function viewProduct(){const p=getP(Q.get('id'));
 if(!p){$('#pd').innerHTML='<p class="sec">Product not found. <a href="#/shop">Back to shop</a></p>';return}
 let size=p.sizes[0],color=p.colors[0],qty=1;
 const opt=(a,k)=>a.map(v=>`<button data-k="${k}" data-v="${v}" class="${(k==='s'?size:color)===v?'on':''}">${v}</button>`).join('');
 $('#pd').innerHTML=`<div class="pd"><div><div class="main"><img id="mi" src="${p.imgs[0]}" alt="${p.name}"></div><div class="th">${p.imgs.map((s,i)=>`<img src="${s}" class="${i?'':'on'}">`).join('')}</div></div>
 <div><p class="meta">${p.cat} · ${p.gender}</p><h1>${p.name}</h1><p style="margin:10px 0">${p.desc}</p><h2>${priceHTML(p)}</h2>
 <label>Size</label><div class="opt" id="so">${opt(p.sizes,'s')}</div><label>Color</label><div class="opt" id="co">${opt(p.colors,'c')}</div>
 <label>Quantity</label><div class="qty"><button id="m">−</button><span id="q">1</span><button id="pl">+</button></div>
 <div class="acts" style="margin-top:22px;max-width:420px"><button class="btn b" id="ac">Add to Cart</button><button class="btn" id="bn">Buy Now</button></div>
 <p class="meta" style="margin-top:18px">Cash on delivery available. Exchange within 7 days (see Return and Exchange Policy).</p></div></div>`;
 $$('.th img').forEach(i=>i.onclick=()=>{$('#mi').src=i.src;$$('.th img').forEach(x=>x.classList.remove('on'));i.classList.add('on')});
 $$('.opt button').forEach(b=>b.onclick=()=>{b.dataset.k==='s'?size=b.dataset.v:color=b.dataset.v;$$('button',b.parentNode).forEach(x=>x.classList.toggle('on',x===b))});
 $('#m').onclick=()=>$('#q').textContent=qty=Math.max(1,qty-1);$('#pl').onclick=()=>$('#q').textContent=++qty;
 $('#ac').onclick=()=>{addCart(p.id,size,color,qty);toast('Added to cart')};$('#bn').onclick=()=>{addCart(p.id,size,color,qty);location.href='#/cart'}}
/* ===== cart page ===== */
const total=()=>cart().reduce((a,i)=>a+cur(getP(i.id)||{price:0})*i.qty,0);
function draw(){const c=cart().filter(i=>getP(i.id));save('cart',c);cnt();
 $('#items').innerHTML=c.length?c.map((i,x)=>{const p=getP(i.id);return `<div class="ci"><img src="${p.imgs[0]}"><div><b>${p.name}</b><div class="meta">Size ${i.size} · ${i.color}</div>${priceHTML(p)}<div class="qty" style="margin-top:6px"><button onclick="chg(${x},-1)">−</button><span>${i.qty}</span><button onclick="chg(${x},1)">+</button></div></div><button class="btn sm o" onclick="rm(${x})">Remove</button></div>`}).join(''):'<p>Your cart is empty. <a href="#/shop"><u>Start shopping</u></a></p>';
 $('#tot').textContent=money(total());$('#f').style.display=c.length?'':'none'}
function chg(x,d){const c=cart();c[x].qty=Math.max(1,c[x].qty+d);save('cart',c);draw()}
function rm(x){const c=cart();c.splice(x,1);save('cart',c);draw()}
function viewCart(){draw();
 $('#f').onsubmit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target)),items=cart().map(i=>{const p=getP(i.id);return{name:p.name,size:i.size,color:i.color,qty:i.qty,price:cur(p)}});
  const now=new Date(),eta=new Date(now.getTime()+5*864e5),id='THL-'+Date.now().toString(36).toUpperCase().slice(-6);
  const o={id,...d,items,total:total(),date:now.toISOString(),eta:eta.toISOString(),status:0,log:[{s:0,t:now.toISOString()}]};
  const os=load('orders',[]);os.unshift(o);save('orders',os);save('cart',[]);
  const msg=`New order ${id}\nName: ${d.name}\nPhone: ${d.phone}\nAddress: ${d.addr}, ${d.city} ${d.zip}\n`+items.map(i=>`- ${i.name} (${i.size}, ${i.color}) x${i.qty} = ${money(i.price*i.qty)}`).join('\n')+`\nTotal: ${money(o.total)}`;
  $('#cl').style.display='none';
  $('#done').innerHTML=`<div class="msg" style="margin-top:36px"><h2>Order placed</h2><p>Your Order ID is <b>${id}</b>. Save it to track your order.</p><p style="margin-top:14px"><a class="btn wa" href="https://wa.me/${S().wa}?text=${encodeURIComponent(msg)}" target="_blank">Send order on WhatsApp</a> <a class="btn b" href="#/track?id=${id}">Track this order</a></p></div>`;cnt()}}
/* ===== track page ===== */
const fd=d=>new Date(d).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
function look(id){const o=load('orders',[]).find(x=>x.id.toLowerCase()===id.trim().toLowerCase()),r=$('#r');
 if(!o){r.innerHTML='<div class="msg err">No order found with that ID. Check the ID and try again.</div>';return}
 const can=o.status===-1;
 r.innerHTML=`<div class="box"><h3>Order ${o.id}</h3><p class="meta">Customer: ${o.name} · Ordered: ${fd(o.date)} · Expected delivery: ${can?'—':fd(o.eta)}</p>
 ${can?'<div class="msg err">This order was cancelled.</div>':`<div class="tl">${STAGES.map((s,i)=>`<div class="st ${i<o.status?'done':i===o.status?'cur':''}"><i>${i<o.status?'✓':i+1}</i>${s}</div>`).join('')}</div><p>Current status: <b style="color:var(--red)">${STAGES[o.status]}</b></p>`}
 <h4 style="margin:18px 0 6px">Products</h4>${o.items.map(i=>`<p>${i.name} — ${i.size}, ${i.color} × ${i.qty} · ${money(i.price*i.qty)}</p>`).join('')}<p><b>Total: ${money(o.total)}</b></p>
 <h4 style="margin:18px 0 6px">Delivery information</h4><p>${o.addr}, ${o.city} ${o.zip}<br>Contact: ${o.phone}</p></div>`}
function viewTrack(){$('#f').onsubmit=e=>{e.preventDefault();look($('#oid').value)};const i=Q.get('id');if(i){$('#oid').value=i;look(i)}}
/* ===== admin page ===== */
let tab='orders',edit=null;
const authed=()=>sessionStorage.getItem('adm')==='1';
const rd=f=>new Promise(r=>{const fr=new FileReader();fr.onload=()=>{const i=new Image();i.onload=()=>{const k=Math.min(1,700/i.width),c=document.createElement('canvas');c.width=i.width*k;c.height=i.height*k;c.getContext('2d').drawImage(i,0,0,c.width,c.height);r(c.toDataURL('image/jpeg',.8))};i.src=fr.result};fr.readAsDataURL(f)});
const csv=v=>v.split(',').map(x=>x.trim()).filter(Boolean);
function render(){const a=$('#app');
 if(!authed()){a.innerHTML=`<form class="box" id="lf" style="max-width:360px;margin:auto"><h2>Admin login</h2><label>Password</label><input type="password" id="pw" required><br><br><button class="btn">Log in</button><p class="meta" style="margin-top:10px">Default password: admin123 (change it in Settings).</p></form>`;
  $('#lf').onsubmit=e=>{e.preventDefault();if($('#pw').value===S().pass){sessionStorage.setItem('adm','1');render()}else toast('Wrong password')};return}
 a.innerHTML=`<h2>Admin dashboard</h2><div class="tabs">${['orders','products','categories','settings'].map(t=>`<button class="btn sm ${t===tab?'':'o'}" onclick="tab='${t}';edit=null;render()">${t[0].toUpperCase()+t.slice(1)}</button>`).join('')}<button class="btn sm o" onclick="sessionStorage.clear();render()">Log out</button></div><div id="tc"></div>`;
 ({orders,products,categories,settings})[tab]($('#tc'))}
function orders(el){const os=load('orders',[]);el.innerHTML=os.length?os.map(o=>`<div class="ocard"><b>${o.id}</b> · ${new Date(o.date).toLocaleString()} · <b>${o.status<0?'Cancelled':STAGES[o.status]}</b><br>${o.name} · <a href="tel:${o.phone}">${o.phone}</a><br>${o.addr}, ${o.city} ${o.zip}<br>${o.items.map(i=>`${i.name} (${i.size}, ${i.color}) ×${i.qty}`).join('; ')}<br><b>${money(o.total)}</b><div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap"><select style="width:auto" onchange="setSt('${o.id}',+this.value)">${STAGES.map((s,i)=>`<option value="${i}" ${i===o.status?'selected':''}>${s}</option>`).join('')}</select><button class="btn sm b" onclick="setSt('${o.id}',1)">Confirm</button><button class="btn sm" onclick="setSt('${o.id}',-1)">Cancel</button></div></div>`).join(''):'<p>No orders yet.</p>'}
function setSt(id,s){const os=load('orders',[]),o=os.find(x=>x.id===id);o.status=s;o.log.push({s,t:new Date().toISOString()});save('orders',os);render()}
function products(el){const P=prods(),e=edit&&edit!=='new'?getP(edit):null,v=e||{name:'',desc:'',cat:load('cats')[0],gender:'Men',sizes:SZ,colors:[],price:'',sale:'',isNew:0,imgs:[]};
 el.innerHTML=`<form class="box" id="pf"><h3>${e?'Edit':'Add'} product</h3><div class="two"><div><label>Name</label><input name="name" required value="${v.name}"></div><div><label>Category</label><select name="cat">${load('cats').map(c=>`<option ${c===v.cat?'selected':''}>${c}</option>`).join('')}</select></div></div>
 <label>Description</label><textarea name="desc">${v.desc}</textarea><div class="two"><div><label>For</label><select name="gender">${['Men','Women','Unisex'].map(g=>`<option ${g===v.gender?'selected':''}>${g}</option>`).join('')}</select></div><div><label>Sizes (comma separated)</label><input name="sizes" value="${v.sizes.join(', ')}"></div></div>
 <div class="two"><div><label>Colors (comma separated)</label><input name="colors" required value="${v.colors.join(', ')}"></div><div><label>New arrival</label><select name="isNew"><option value="0">No</option><option value="1" ${v.isNew?'selected':''}>Yes</option></select></div></div>
 <div class="two"><div><label>Original price (PKR)</label><input type="number" name="price" required value="${v.price}"></div><div><label>Discounted price (PKR)</label><input type="number" name="sale" value="${v.sale||''}"></div></div>
 <label>Model photos (new uploads replace existing)</label><input type="file" id="im" accept="image/*" multiple><br><button class="btn">Save product</button> ${edit?'<button type="button" class="btn o" onclick="edit=null;render()">Cancel</button>':''}</form>
 <h3 style="margin:24px 0 10px">All products</h3><table><tr><th></th><th>Name</th><th>Category</th><th>Price</th><th></th></tr>${P.map(p=>`<tr><td><img src="${p.imgs[0]}" width="44"></td><td>${p.name}</td><td>${p.cat}</td><td>${priceHTML(p)}</td><td><button class="btn sm b" onclick="edit='${p.id}';render();scrollTo(0,0)">Edit</button> <button class="btn sm" onclick="delP('${p.id}')">Delete</button></td></tr>`).join('')}</table>`;
 $('#pf').onsubmit=async ev=>{ev.preventDefault();const d=Object.fromEntries(new FormData(ev.target)),fs=[...$('#im').files];
  const imgs=fs.length?await Promise.all(fs.map(rd)):(e?e.imgs:[ph('#d62839','#0b2a5b')]);
  const o={id:e?e.id:'p'+Date.now(),name:d.name,desc:d.desc,cat:d.cat,gender:d.gender,sizes:csv(d.sizes),colors:csv(d.colors),price:+d.price,sale:+d.sale||0,isNew:+d.isNew,imgs};
  const L=prods();e?L[L.findIndex(p=>p.id===e.id)]=o:L.unshift(o);try{save('products',L)}catch(x){toast('Images too large — upload fewer photos');return}edit=null;render();toast('Saved')}}
function delP(id){if(confirm('Delete this product?')){save('products',prods().filter(p=>p.id!==id));render()}}
function categories(el){const C=load('cats');el.innerHTML=`<div class="box"><h3>Categories</h3>${C.map((c,i)=>`<p>${c} <button class="btn sm" onclick="delC(${i})">Remove</button></p>`).join('')}<form id="cf" style="display:flex;gap:8px;margin-top:12px"><input id="nc" placeholder="New category" required><button class="btn">Add</button></form></div>`;
 $('#cf').onsubmit=e=>{e.preventDefault();save('cats',[...C,$('#nc').value.trim()]);render()}}
function delC(i){const C=load('cats');C.splice(i,1);save('cats',C);render()}
function settings(el){const s=S(),F=[['brand','Brand name'],['phone','Phone number (Call to Order)'],['wa','WhatsApp number (digits only, with 92)'],['email','Email'],['addr','Store location'],['promo','Top bar offer'],['banner','Promotional banner text'],['pass','Admin password']];
 el.innerHTML=`<form class="box" id="sf"><h3>Brand, contact and promotions</h3>${F.map(([k,l])=>`<label>${l}</label><input name="${k}" value="${s[k]}" required>`).join('')}<br><button class="btn">Save settings</button></form>`;
 $('#sf').onsubmit=e=>{e.preventDefault();save('settings',{...s,...Object.fromEntries(new FormData(e.target))});toast('Saved');layout()}}
function viewAdmin(){render()}

function viewPolicy(){const e=Q.get('s')&&$('#'+Q.get('s'));if(e)setTimeout(()=>e.scrollIntoView(),50)}
/* ===== router ===== */
const V={home:viewHome,shop:viewShop,product:viewProduct,cart:viewCart,track:viewTrack,admin:viewAdmin,policy:viewPolicy};
let Q=new URLSearchParams();
function route(){const [r,qs]=(location.hash.slice(2)||'home').split('?'),n=r==='contact'?'home':V[r]?r:'home';
 Q=new URLSearchParams(qs||'');$('#view').replaceChildren($('#v-'+n).content.cloneNode(true));
 const l=$('#lk');if(l)l.classList.remove('open');scrollTo(0,0);V[n]();reveal();
 if(r==='contact')setTimeout(()=>$('#contact').scrollIntoView(),50)}
addEventListener('hashchange',route);layout();route();
(this["webpackJsonpdistributed-town-web"]=this["webpackJsonpdistributed-town-web"]||[]).push([[0],{87:function(t,e,n){},88:function(t,e,n){},96:function(t,e,n){var i={"./auth-image_10.entry.js":[101,4]};function c(t){if(!n.o(i,t))return Promise.resolve().then((function(){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}));var e=i[t],c=e[0];return n.e(e[1]).then((function(){return n(c)}))}c.keys=function(){return Object.keys(i)},c.id=96,t.exports=c},97:function(t,e,n){},98:function(t,e,n){},99:function(t,e,n){"use strict";n.r(e);var i=n(0),c=n.n(i),a=n(31),o=n.n(a),s=(n(87),n(29)),r=n(30),l=n(33),j=n(34),d=(n(88),n(67)),b=n(19),u=n(73),h=n(136),m=n(14),x=n(137),O=n(138),p=n(27),f=(n(97),n(2)),w=function(){return Object(f.jsxs)("div",{className:"sw-get-started-container",children:[Object(f.jsxs)(x.a,{sx:{p:0,m:0},className:"sw-box",children:[Object(f.jsx)(x.a,{className:"sw-box-logo",children:Object(f.jsx)(b.a,{width:"280px"})}),Object(f.jsx)(x.a,{className:"sw-box-quote",children:Object(f.jsxs)("div",{className:"quote text-white",children:[Object(f.jsxs)("p",{children:[Object(f.jsx)("strong",{children:"Distributed Town"})," is a new financial infrastructure for public goods, designed for the real world."]}),Object(f.jsx)("p",{children:"It\u2019s built upon mutual, collaborative economics between individuals and communities - and a universal identity management based on skills, rather than personal data."})]})})]}),Object(f.jsx)(O.a,{color:"white",sx:{width:4,marginLeft:"40px",marginRight:"40px"},orientation:"vertical"}),Object(f.jsxs)(x.a,{sx:{p:0,m:0},className:"sw-box",children:[Object(f.jsx)(x.a,{className:"sw-box-title",children:Object(f.jsxs)("h1",{className:"text-white text-2xl",children:["This is ",Object(f.jsx)("span",{className:"underline",children:"your Community"})]})}),Object(f.jsxs)(x.a,{className:"sw-box-actions",children:[Object(f.jsx)(b.d,{label:"Create",component:p.b,to:"/community/create"}),Object(f.jsx)(b.d,{label:"Join",component:p.b,to:"/community/join"})]})]})]})};n(98);function g(){return Object(f.jsx)(b.f,{width:"50",height:"50"})}var v=function(t){Object(l.a)(n,t);var e=Object(j.a)(n);function n(t){var i;return Object(s.a)(this,n),(i=e.call(this,t)).state={isLoading:!0,isAutheticated:!1},i}return Object(r.a)(n,[{key:"componentDidMount",value:function(){console.log(this.props)}},{key:"componentWillUnmount",value:function(){}},{key:"render",value:function(){var t=this.props.match.path;return Object(f.jsxs)(f.Fragment,{children:[Object(f.jsx)(m.a,{from:"/community",to:"".concat(t,"/dTown-hall")}),Object(f.jsx)(m.b,{path:"".concat(t,"/dTown-hall"),component:g})]})}}]),n}(c.a.Component),y=encodeURIComponent(Object(d.renderToStaticMarkup)(Object(f.jsx)(b.c,{}))),k=function(t){Object(l.a)(n,t);var e=Object(j.a)(n);function n(t){var i;return Object(s.a)(this,n),(i=e.call(this,t)).state={isLoading:!0,isAutheticated:!1},i}return Object(r.a)(n,[{key:"componentDidMount",value:function(){Object(u.a)(window),window.addEventListener("onSkillwalletLogin",this.onSWLogin.bind(this))}},{key:"componentWillUnmount",value:function(){window.removeEventListener("onSkillwalletLogin",this.onSWLogin.bind(this))}},{key:"onSWLogin",value:function(){var t=this;setTimeout((function(){return t.setState({isLoading:!1,isAutheticated:!0})}),2e3)}},{key:"render",value:function(){var t=[{label:"SkillWallet",href:"/",icon:Object(f.jsx)(h.a,{component:b.b})},{label:"dTown Hall",href:"/community/dTown-hall",icon:Object(f.jsx)(h.a,{component:b.b})},{label:"Notifications",href:"/community/notifications",icon:Object(f.jsx)(h.a,{component:b.b})},{label:"Settings",href:"/community/settings",icon:Object(f.jsx)(h.a,{component:b.b})},{type:"divider"},{label:"Log off",href:"/community/logout",icon:Object(f.jsx)(h.a,{component:b.b})}];return Object(f.jsx)(b.e,{className:this.state.isLoading?"loading":"",children:Object(f.jsxs)(f.Fragment,{children:[Object(f.jsx)("div",{className:"wallet-btn",style:{visibility:this.state.isLoading?"hidden":"visible"},children:Object(f.jsx)("skillwallet-auth",{id:"walletButton"})}),this.state.isLoading?Object(f.jsx)(D,{}):this.state.isAutheticated?Object(f.jsx)(S,{}):Object(f.jsx)(T,{})]}),backgroundUrl:"url('data:image/svg+xml;utf8, ".concat(y,"')"),drawer:this.state.isAutheticated&&Object(f.jsx)(b.g,{open:!0,menuItems:t})})}}]),n}(c.a.Component),L=Object(m.h)(k);function N(){return Object(f.jsx)("h2",{style:{color:"white"},children:"Test"})}var D=function(){return Object(f.jsx)("div",{className:"app-loading",children:Object(f.jsx)(b.f,{width:"80",height:"80"})})},S=function(){return Object(f.jsx)(f.Fragment,{children:Object(f.jsxs)(m.d,{children:[Object(f.jsx)(m.b,{path:"/community",component:v}),Object(f.jsx)(m.b,{path:"/notifications",component:N})]})})},T=function(){return Object(f.jsx)(f.Fragment,{children:Object(f.jsx)(m.d,{children:Object(f.jsx)(m.b,{exact:!0,path:"/",component:w})})})},F=n(72),C=n(133),U=n(135),W=Object(F.a)({palette:{type:"dark",text:{primary:"#fff",secondary:"rgba(255, 255, 255, 0.7)"},primary:{main:"#161615"},secondary:{main:"#D8D8D8"},background:{default:"#161615",paper:"#D8D8D8"}},shape:{borderRadius:0},typography:{fontFamily:["Josefin Sans"," sans-serif"].join(",")}});o.a.render(Object(f.jsx)(C.a,{injectFirst:!0,children:Object(f.jsx)(U.a,{theme:W,children:Object(f.jsx)(p.a,{children:Object(f.jsx)(L,{})})})}),document.getElementById("root"))}},[[99,2,3]]]);
//# sourceMappingURL=main.2e5cc3e2.chunk.js.map
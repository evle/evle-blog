webpackJsonp([0xd2a57dc1d883],{83:function(n,e,t){"use strict";function o(n,e,t){var o=a.map(function(t){if(t.plugin[n]){var o=t.plugin[n](e,t.options);return o}});return o=o.filter(function(n){return"undefined"!=typeof n}),o.length>0?o:t?[t]:[]}function r(n,e,t){return a.reduce(function(t,o){return o.plugin[n]?t.then(function(){return o.plugin[n](e,o.options)}):t},Promise.resolve())}e.__esModule=!0,e.apiRunner=o,e.apiRunnerAsync=r;var a=[{plugin:t(391),options:{plugins:[]}},{plugin:t(389),options:{plugins:[]}}]},212:function(n,e,t){"use strict";var o;e.components={"component---node-modules-gatsby-plugin-offline-app-shell-js":t(340),"component---src-templates-page-template-jsx":t(347),"component---src-templates-post-template-jsx":t(348),"component---src-templates-tag-template-jsx":t(349),"component---src-templates-category-template-jsx":t(346),"component---src-pages-404-jsx":t(342),"component---src-pages-categories-jsx":t(343),"component---src-pages-index-jsx":t(344),"component---src-pages-tags-jsx":t(345)},e.json=(o={"layout-index.json":t(350),"offline-plugin-app-shell-fallback.json":t(364),"about.json":t(353),"posts-english-writing-skills.json":t(368),"tags-english-skills.json":t(382),"categories-english-skills.json":t(356),"contact.json":t(362),"posts-float-character.json":t(370),"tags-css.json":t(381),"tags-float.json":t(383),"categories-css.json":t(355),"posts-webpack-dev-server-source.json":t(377),"tags-webpack.json":t(386),"tags-java-script.json":t(384),"categories-webpack.json":t(360),"posts-chrome-web-push.json":t(365),"tags-webpush.json":t(387),"categories-webpush.json":t(361),"posts-translation-react-renderless-components-to-handle-data.json":t(376),"tags.json":t(173),"categories-react.json":t(358),"posts-koa-source.json":t(371),"categories-node-js.json":t(357),"posts-express-source.json":t(369),"posts-webpack-hmr-source.json":t(378),"posts-saga-source.json":t(373),"posts-webpack-source.json":t(379),"posts-translation-diving-into-antd-button.json":t(375),"tags-antd.json":t(380),"posts-dva-source.json":t(367),"categories-redux.json":t(359),"posts-translation-best-practices-for-writing-react-components.json":t(374),"posts-create-react-app.json":t(366),"tags-react.json":t(385),"posts-react-router-source.json":t(372),"404.json":t(351),"categories.json":t(354),"index.json":t(363)},o["tags.json"]=t(173),o["404-html.json"]=t(352),o),e.layouts={"layout---index":t(341)}},213:function(n,e,t){"use strict";function o(n){return n&&n.__esModule?n:{default:n}}function r(n,e){if(!(n instanceof e))throw new TypeError("Cannot call a class as a function")}function a(n,e){if(!n)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?n:e}function u(n,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);n.prototype=Object.create(e&&e.prototype,{constructor:{value:n,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(n,e):n.__proto__=e)}e.__esModule=!0;var s=Object.assign||function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(n[o]=t[o])}return n},c=t(2),i=o(c),l=t(8),p=o(l),f=t(145),d=o(f),m=t(59),h=o(m),g=t(83),x=t(595),y=o(x),j=function(n){var e=n.children;return i.default.createElement("div",null,e())},v=function(n){function e(t){r(this,e);var o=a(this,n.call(this)),u=t.location;return d.default.getPage(u.pathname)||(u=s({},u,{pathname:"/404.html"})),o.state={location:u,pageResources:d.default.getResourcesForPathname(u.pathname)},o}return u(e,n),e.prototype.componentWillReceiveProps=function(n){var e=this;if(this.state.location.pathname!==n.location.pathname){var t=d.default.getResourcesForPathname(n.location.pathname);if(t)this.setState({location:n.location,pageResources:t});else{var o=n.location;d.default.getPage(o.pathname)||(o=s({},o,{pathname:"/404.html"})),d.default.getResourcesForPathname(o.pathname,function(n){e.setState({location:o,pageResources:n})})}}},e.prototype.componentDidMount=function(){var n=this;h.default.on("onPostLoadPageResources",function(e){d.default.getPage(n.state.location.pathname)&&e.page.path===d.default.getPage(n.state.location.pathname).path&&n.setState({pageResources:e.pageResources})})},e.prototype.shouldComponentUpdate=function(n,e){return!e.pageResources||(!(this.state.pageResources||!e.pageResources)||(this.state.pageResources.component!==e.pageResources.component||(this.state.pageResources.json!==e.pageResources.json||(!(this.state.location.key===e.location.key||!e.pageResources.page||!e.pageResources.page.matchPath&&!e.pageResources.page.path)||(0,y.default)(this,n,e)))))},e.prototype.render=function(){var n=(0,g.apiRunner)("replaceComponentRenderer",{props:s({},this.props,{pageResources:this.state.pageResources}),loader:f.publicLoader}),e=n[0];return this.props.page?this.state.pageResources?e||(0,c.createElement)(this.state.pageResources.component,s({key:this.props.location.pathname},this.props,this.state.pageResources.json)):null:this.props.layout?e||(0,c.createElement)(this.state.pageResources&&this.state.pageResources.layout?this.state.pageResources.layout:j,s({key:this.state.pageResources&&this.state.pageResources.layout?this.state.pageResources.layout:"DefaultLayout"},this.props)):null},e}(i.default.Component);v.propTypes={page:p.default.bool,layout:p.default.bool,location:p.default.object},e.default=v,n.exports=e.default},59:function(n,e,t){"use strict";function o(n){return n&&n.__esModule?n:{default:n}}var r=t(482),a=o(r),u=(0,a.default)();n.exports=u},214:function(n,e,t){"use strict";function o(n){return n&&n.__esModule?n:{default:n}}var r=t(82),a=t(146),u=o(a),s={};n.exports=function(n){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";return function(t){var o=decodeURIComponent(t),a=(0,u.default)(o,e);if(a.split("#").length>1&&(a=a.split("#").slice(0,-1).join("")),a.split("?").length>1&&(a=a.split("?").slice(0,-1).join("")),s[a])return s[a];var c=void 0;return n.some(function(n){if(n.matchPath){if((0,r.matchPath)(a,{path:n.path})||(0,r.matchPath)(a,{path:n.matchPath}))return c=n,s[a]=n,!0}else{if((0,r.matchPath)(a,{path:n.path,exact:!0}))return c=n,s[a]=n,!0;if((0,r.matchPath)(a,{path:n.path+"index.html"}))return c=n,s[a]=n,!0}return!1}),c}}},215:function(n,e,t){"use strict";function o(n){return n&&n.__esModule?n:{default:n}}var r=t(398),a=o(r),u=t(83),s=(0,u.apiRunner)("replaceHistory"),c=s[0],i=c||(0,a.default)();n.exports=i},352:function(n,e,t){t(1),n.exports=function(n){return t.e(0xa2868bfb69fc,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(401)})})}},351:function(n,e,t){t(1),n.exports=function(n){return t.e(0xe70826b53c04,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(402)})})}},353:function(n,e,t){t(1),n.exports=function(n){return t.e(0xf927f8900006,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(403)})})}},355:function(n,e,t){t(1),n.exports=function(n){return t.e(51077202873962,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(404)})})}},356:function(n,e,t){t(1),n.exports=function(n){return t.e(0xe0ebc296c305,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(405)})})}},357:function(n,e,t){t(1),n.exports=function(n){return t.e(99570036377916,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(406)})})}},358:function(n,e,t){t(1),n.exports=function(n){return t.e(0xa4758d51a8c8,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(407)})})}},359:function(n,e,t){t(1),n.exports=function(n){return t.e(0xda60261ed6db,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(408)})})}},360:function(n,e,t){t(1),n.exports=function(n){return t.e(91497887388271,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(409)})})}},361:function(n,e,t){t(1),n.exports=function(n){return t.e(20990376623382,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(410)})})}},354:function(n,e,t){t(1),n.exports=function(n){return t.e(30875753179511,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(411)})})}},362:function(n,e,t){t(1),n.exports=function(n){return t.e(0xa7f31e1aeaea,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(412)})})}},363:function(n,e,t){t(1),n.exports=function(n){return t.e(0x81b8806e4260,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(413)})})}},350:function(n,e,t){t(1),n.exports=function(n){return t.e(60335399758886,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(110)})})}},364:function(n,e,t){t(1),n.exports=function(n){return t.e(0xbf4c176e203a,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(414)})})}},365:function(n,e,t){t(1),n.exports=function(n){return t.e(0xe678e2321003,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(415)})})}},366:function(n,e,t){t(1),n.exports=function(n){return t.e(0xc0ed6e00809f,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(416)})})}},367:function(n,e,t){t(1),n.exports=function(n){return t.e(0xf9e83b652f60,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(417)})})}},368:function(n,e,t){t(1),n.exports=function(n){return t.e(71040202780299,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(418)})})}},369:function(n,e,t){t(1),n.exports=function(n){return t.e(0x638d4fcf0a80,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(419)})})}},370:function(n,e,t){t(1),n.exports=function(n){return t.e(84035053340424,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(420)})})}},371:function(n,e,t){t(1),n.exports=function(n){return t.e(0xac9f961a6be4,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(421)})})}},372:function(n,e,t){t(1),n.exports=function(n){return t.e(0xb76d332d8ed5,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(422)})})}},373:function(n,e,t){t(1),n.exports=function(n){return t.e(0xf3d9d749a7a9,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(423)})})}},374:function(n,e,t){t(1),n.exports=function(n){return t.e(68237591569990,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(424)})})}},375:function(n,e,t){t(1),n.exports=function(n){return t.e(0xb51d403d019f,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(425)})})}},376:function(n,e,t){t(1),n.exports=function(n){return t.e(57137080336376,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(426)})})}},377:function(n,e,t){t(1),n.exports=function(n){return t.e(0xec3ebeb2b1f3,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(427)})})}},378:function(n,e,t){t(1),n.exports=function(n){return t.e(0xb31baa41537d,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(428)})})}},379:function(n,e,t){t(1),n.exports=function(n){return t.e(28022896516486,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(429)})})}},380:function(n,e,t){t(1),n.exports=function(n){return t.e(0x679d2df732bc,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(430)})})}},381:function(n,e,t){t(1),n.exports=function(n){return t.e(0xbe2449c8444b,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(431)})})}},382:function(n,e,t){t(1),n.exports=function(n){return t.e(61810573369755,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(432)})})}},383:function(n,e,t){t(1),n.exports=function(n){return t.e(73987681764263,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(433)})})}},384:function(n,e,t){t(1),n.exports=function(n){return t.e(0xc1658d68ad40,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(434)})})}},385:function(n,e,t){t(1),n.exports=function(n){return t.e(84586273293571,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(435)})})}},386:function(n,e,t){t(1),n.exports=function(n){return t.e(0xa341cc436753,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(436)})})}},387:function(n,e,t){t(1),n.exports=function(n){return t.e(0x736f02b0a9bf,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(437)})})}},173:function(n,e,t){t(1),n.exports=function(n){return t.e(55702396619907,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(438)})})}},341:function(n,e,t){t(1),n.exports=function(n){return t.e(79611799117203,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(216)})})}},145:function(n,e,t){(function(n){"use strict";function o(n){return n&&n.__esModule?n:{default:n}}e.__esModule=!0,e.publicLoader=void 0;var r=t(2),a=(o(r),t(214)),u=o(a),s=t(59),c=o(s),i=t(146),l=o(i),p=void 0,f={},d={},m={},h={},g={},x=[],y=[],j={},v="",N=[],C={},b=function(n){return n&&n.default||n},k=void 0,w=!0,R=[],_={},P={},E=5;k=t(217)({getNextQueuedResources:function(){return N.slice(-1)[0]},createResourceDownload:function(n){L(n,function(){N=N.filter(function(e){return e!==n}),k.onResourcedFinished(n)})}}),c.default.on("onPreLoadPageResources",function(n){k.onPreLoadPageResources(n)}),c.default.on("onPostLoadPageResources",function(n){k.onPostLoadPageResources(n)});var O=function(n,e){return C[n]>C[e]?1:C[n]<C[e]?-1:0},T=function(n,e){return j[n]>j[e]?1:j[n]<j[e]?-1:0},L=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(){};if(h[e])n.nextTick(function(){t(null,h[e])});else{var o=void 0;o="component---"===e.slice(0,12)?d.components[e]:"layout---"===e.slice(0,9)?d.layouts[e]:d.json[e],o(function(n,o){h[e]=o,R.push({resource:e,succeeded:!n}),P[e]||(P[e]=n),R=R.slice(-E),t(n,o)})}},S=function(e,t){g[e]?n.nextTick(function(){t(null,g[e])}):P[e]?n.nextTick(function(){t(P[e])}):L(e,function(n,o){if(n)t(n);else{var r=b(o());g[e]=r,t(n,r)}})},A=function(){var n=navigator.onLine;if("boolean"==typeof n)return n;var e=R.find(function(n){return n.succeeded});return!!e},D=function(n,e){console.log(e),_[n]||(_[n]=e),A()&&window.location.pathname.replace(/\/$/g,"")!==n.replace(/\/$/g,"")&&(window.location.pathname=n)},F=1,M={empty:function(){y=[],j={},C={},N=[],x=[],v=""},addPagesArray:function(n){x=n,v="",p=(0,u.default)(n,v)},addDevRequires:function(n){f=n},addProdRequires:function(n){d=n},dequeue:function(){return y.pop()},enqueue:function(n){var e=(0,l.default)(n,v);if(!x.some(function(n){return n.path===e}))return!1;var t=1/F;F+=1,j[e]?j[e]+=1:j[e]=1,M.has(e)||y.unshift(e),y.sort(T);var o=p(e);return o.jsonName&&(C[o.jsonName]?C[o.jsonName]+=1+t:C[o.jsonName]=1+t,N.indexOf(o.jsonName)!==-1||h[o.jsonName]||N.unshift(o.jsonName)),o.componentChunkName&&(C[o.componentChunkName]?C[o.componentChunkName]+=1+t:C[o.componentChunkName]=1+t,N.indexOf(o.componentChunkName)!==-1||h[o.jsonName]||N.unshift(o.componentChunkName)),N.sort(O),k.onNewResourcesAdded(),!0},getResources:function(){return{resourcesArray:N,resourcesCount:C}},getPages:function(){return{pathArray:y,pathCount:j}},getPage:function(n){return p(n)},has:function(n){return y.some(function(e){return e===n})},getResourcesForPathname:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(){};w&&navigator&&navigator.serviceWorker&&navigator.serviceWorker.controller&&"activated"===navigator.serviceWorker.controller.state&&(p(e)||navigator.serviceWorker.getRegistrations().then(function(n){if(n.length){for(var e=n,t=Array.isArray(e),o=0,e=t?e:e[Symbol.iterator]();;){var r;if(t){if(o>=e.length)break;r=e[o++]}else{if(o=e.next(),o.done)break;r=o.value}var a=r;a.unregister()}window.location.reload()}})),w=!1;if(_[e])return D(e,'Previously detected load failure for "'+e+'"'),t();var o=p(e);if(!o)return D(e,"A page wasn't found for \""+e+'"'),t();if(e=o.path,m[e])return n.nextTick(function(){t(m[e]),c.default.emit("onPostLoadPageResources",{page:o,pageResources:m[e]})}),m[e];c.default.emit("onPreLoadPageResources",{path:e});var r=void 0,a=void 0,u=void 0,s=function(){if(r&&a&&(!o.layoutComponentChunkName||u)){m[e]={component:r,json:a,layout:u,page:o};var n={component:r,json:a,layout:u,page:o};t(n),c.default.emit("onPostLoadPageResources",{page:o,pageResources:n})}};return S(o.componentChunkName,function(n,e){n&&D(o.path,"Loading the component for "+o.path+" failed"),r=e,s()}),S(o.jsonName,function(n,e){n&&D(o.path,"Loading the JSON for "+o.path+" failed"),a=e,s()}),void(o.layoutComponentChunkName&&S(o.layout,function(n,e){n&&D(o.path,"Loading the Layout for "+o.path+" failed"),u=e,s()}))},peek:function(n){return y.slice(-1)[0]},length:function(){return y.length},indexOf:function(n){return y.length-y.indexOf(n)-1}};e.publicLoader={getResourcesForPathname:M.getResourcesForPathname};e.default=M}).call(e,t(125))},439:function(n,e){n.exports=[{componentChunkName:"component---node-modules-gatsby-plugin-offline-app-shell-js",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"offline-plugin-app-shell-fallback.json",path:"/offline-plugin-app-shell-fallback/"},{componentChunkName:"component---src-templates-page-template-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"about.json",path:"/about"},{componentChunkName:"component---src-templates-post-template-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"posts-english-writing-skills.json",path:"/posts/English-writing-skills/"},{componentChunkName:"component---src-templates-tag-template-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"tags-english-skills.json",path:"/tags/english-skills/"},{componentChunkName:"component---src-templates-category-template-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"categories-english-skills.json",path:"/categories/english-skills/"},{componentChunkName:"component---src-templates-page-template-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"contact.json",path:"/contact"},{componentChunkName:"component---src-templates-post-template-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"posts-float-character.json",path:"/posts/float-character"},{componentChunkName:"component---src-templates-tag-template-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"tags-css.json",path:"/tags/css/"},{componentChunkName:"component---src-templates-tag-template-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"tags-float.json",path:"/tags/float/"},{componentChunkName:"component---src-templates-category-template-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"categories-css.json",path:"/categories/css/"},{componentChunkName:"component---src-templates-post-template-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"posts-webpack-dev-server-source.json",path:"/posts/webpack-dev-server-source"},{componentChunkName:"component---src-templates-tag-template-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"tags-webpack.json",path:"/tags/webpack/"},{componentChunkName:"component---src-templates-tag-template-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"tags-java-script.json",path:"/tags/java-script/"},{componentChunkName:"component---src-templates-category-template-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"categories-webpack.json",path:"/categories/webpack/"},{componentChunkName:"component---src-templates-post-template-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"posts-chrome-web-push.json",path:"/posts/chrome-web-push"},{componentChunkName:"component---src-templates-tag-template-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"tags-webpush.json",path:"/tags/webpush/"},{componentChunkName:"component---src-templates-category-template-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"categories-webpush.json",path:"/categories/webpush/"},{componentChunkName:"component---src-templates-post-template-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"posts-translation-react-renderless-components-to-handle-data.json",path:"/posts/translation-react-renderless-components-to-handle-data"},{componentChunkName:"component---src-templates-tag-template-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"tags.json",path:"/tags//"},{componentChunkName:"component---src-templates-category-template-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"categories-react.json",path:"/categories/react/"},{componentChunkName:"component---src-templates-post-template-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"posts-koa-source.json",path:"/posts/koa-source"},{componentChunkName:"component---src-templates-category-template-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"categories-node-js.json",path:"/categories/node-js/"},{componentChunkName:"component---src-templates-post-template-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"posts-express-source.json",path:"/posts/express-source"},{componentChunkName:"component---src-templates-post-template-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"posts-webpack-hmr-source.json",path:"/posts/webpack-hmr-source"},{componentChunkName:"component---src-templates-post-template-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"posts-saga-source.json",path:"/posts/saga-source"},{componentChunkName:"component---src-templates-post-template-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"posts-webpack-source.json",path:"/posts/webpack-source"},{componentChunkName:"component---src-templates-post-template-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"posts-translation-diving-into-antd-button.json",path:"/posts/translation-diving-into-antd-button"},{componentChunkName:"component---src-templates-tag-template-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"tags-antd.json",path:"/tags/antd/"},{componentChunkName:"component---src-templates-post-template-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"posts-dva-source.json",path:"/posts/dva-source"},{componentChunkName:"component---src-templates-category-template-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"categories-redux.json",path:"/categories/redux/"},{componentChunkName:"component---src-templates-post-template-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"posts-translation-best-practices-for-writing-react-components.json",path:"/posts/translation-best-practices-for-writing-react-components"},{componentChunkName:"component---src-templates-post-template-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"posts-create-react-app.json",path:"/posts/create-react-app"},{componentChunkName:"component---src-templates-tag-template-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"tags-react.json",path:"/tags/react/"},{componentChunkName:"component---src-templates-post-template-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"posts-react-router-source.json",path:"/posts/react-router-source"},{componentChunkName:"component---src-pages-404-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"404.json",path:"/404/"},{componentChunkName:"component---src-pages-categories-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"categories.json",path:"/categories/"},{componentChunkName:"component---src-pages-index-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"index.json",path:"/"},{componentChunkName:"component---src-pages-tags-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"tags.json",path:"/tags/"},{componentChunkName:"component---src-pages-404-jsx",layout:"layout---index",layoutComponentChunkName:"component---src-layouts-index-jsx",jsonName:"404-html.json",path:"/404.html"}]},217:function(n,e){"use strict";n.exports=function(n){var e=n.getNextQueuedResources,t=n.createResourceDownload,o=[],r=[],a=function(){var n=e();n&&(r.push(n),t(n))},u=function(n){switch(n.type){case"RESOURCE_FINISHED":r=r.filter(function(e){return e!==n.payload});break;case"ON_PRE_LOAD_PAGE_RESOURCES":o.push(n.payload.path);break;case"ON_POST_LOAD_PAGE_RESOURCES":o=o.filter(function(e){return e!==n.payload.page.path});break;case"ON_NEW_RESOURCES_ADDED":}setTimeout(function(){0===r.length&&0===o.length&&a()},0)};return{onResourcedFinished:function(n){u({type:"RESOURCE_FINISHED",payload:n})},onPreLoadPageResources:function(n){u({type:"ON_PRE_LOAD_PAGE_RESOURCES",payload:n})},onPostLoadPageResources:function(n){u({type:"ON_POST_LOAD_PAGE_RESOURCES",payload:n})},onNewResourcesAdded:function(){u({type:"ON_NEW_RESOURCES_ADDED"})},getState:function(){return{pagesLoading:o,resourcesDownloading:r}},empty:function(){o=[],r=[]}}}},0:function(n,e,t){"use strict";function o(n){return n&&n.__esModule?n:{default:n}}var r=Object.assign||function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(n[o]=t[o])}return n},a=t(83),u=t(2),s=o(u),c=t(180),i=o(c),l=t(82),p=t(395),f=t(324),d=o(f),m=t(17),h=t(215),g=o(h),x=t(59),y=o(x),j=t(439),v=o(j),N=t(440),C=o(N),b=t(213),k=o(b),w=t(212),R=o(w),_=t(145),P=o(_);t(245),window.___history=g.default,window.___emitter=y.default,P.default.addPagesArray(v.default),P.default.addProdRequires(R.default),window.asyncRequires=R.default,window.___loader=P.default,window.matchPath=l.matchPath;var E=C.default.reduce(function(n,e){return n[e.fromPath]=e,n},{}),O=function(n){var e=E[n];return null!=e&&(g.default.replace(e.toPath),!0)};O(window.location.pathname),(0,a.apiRunnerAsync)("onClientEntry").then(function(){function n(n){window.___history&&c!==!1||(window.___history=n,c=!0,n.listen(function(n,e){O(n.pathname)||setTimeout(function(){(0,a.apiRunner)("onRouteUpdate",{location:n,action:e})},0)}))}function e(n,e){var t=e.location.pathname,o=(0,a.apiRunner)("shouldUpdateScroll",{prevRouterProps:n,pathname:t});if(o.length>0)return o[0];if(n){var r=n.location.pathname;if(r===t)return!1}return!0}(0,a.apiRunner)("registerServiceWorker").length>0&&t(218);var o=function(n,e){function t(n){n.page.path===P.default.getPage(r).path&&(y.default.off("onPostLoadPageResources",t),clearTimeout(c),s(o))}var o=(0,m.createLocation)(n,null,null,g.default.location),r=o.pathname,a=E[r];a&&(r=a.toPath);var u=window.location;if(u.pathname!==o.pathname||u.search!==o.search||u.hash!==o.hash){var s=e?window.___history.replace:window.___history.push,c=setTimeout(function(){y.default.off("onPostLoadPageResources",t),y.default.emit("onDelayedLoadPageResources",{pathname:r}),s(o)},1e3);P.default.getResourcesForPathname(r)?(clearTimeout(c),s(o)):y.default.on("onPostLoadPageResources",t)}};window.___push=function(n){return o(n,!1)},window.___replace=function(n){return o(n,!0)},window.___navigateTo=window.___push,(0,a.apiRunner)("onRouteUpdate",{location:g.default.location,action:g.default.action});var c=!1,f=(0,a.apiRunner)("replaceRouterComponent",{history:g.default})[0],h=function(n){var e=n.children;return s.default.createElement(l.Router,{history:g.default},e)},x=(0,l.withRouter)(k.default);P.default.getResourcesForPathname(window.location.pathname,function(){var t=function(){return(0,u.createElement)(f?f:h,null,(0,u.createElement)(p.ScrollContext,{shouldUpdateScroll:e},(0,u.createElement)(x,{layout:!0,children:function(e){return(0,u.createElement)(l.Route,{render:function(t){n(t.history);var o=e?e:t;return P.default.getPage(o.location.pathname)?(0,u.createElement)(k.default,r({page:!0},o)):(0,u.createElement)(k.default,{page:!0,location:{pathname:"/404.html"}})}})}})))},o=(0,a.apiRunner)("wrapRootComponent",{Root:t},t)[0],c=(0,a.apiRunner)("replaceHydrateFunction",void 0,i.default.render)[0];(0,d.default)(function(){return c(s.default.createElement(o,null),"undefined"!=typeof window?document.getElementById("___gatsby"):void 0,function(){(0,a.apiRunner)("onInitialClientRender")})})})})},440:function(n,e){n.exports=[]},218:function(n,e,t){"use strict";function o(n){return n&&n.__esModule?n:{default:n}}var r=t(59),a=o(r),u="/";u="/","serviceWorker"in navigator&&navigator.serviceWorker.register(u+"sw.js").then(function(n){n.addEventListener("updatefound",function(){var e=n.installing;console.log("installingWorker",e),e.addEventListener("statechange",function(){switch(e.state){case"installed":navigator.serviceWorker.controller?window.location.reload():(console.log("Content is now available offline!"),a.default.emit("sw:installed"));break;case"redundant":console.error("The installing service worker became redundant.")}})})}).catch(function(n){console.error("Error during service worker registration:",n)})},146:function(n,e){"use strict";e.__esModule=!0,e.default=function(n){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";return n.substr(0,e.length)===e?n.slice(e.length):n},n.exports=e.default},43:function(n,e){function t(n){return n&&n.__esModule?n:{default:n}}n.exports=t},324:function(n,e,t){!function(e,t){n.exports=t()}("domready",function(){var n,e=[],t=document,o=t.documentElement.doScroll,r="DOMContentLoaded",a=(o?/^loaded|^c/:/^loaded|^i|^c/).test(t.readyState);return a||t.addEventListener(r,n=function(){for(t.removeEventListener(r,n),a=1;n=e.shift();)n()}),function(n){a?setTimeout(n,0):e.push(n)}})},325:function(n,e){"use strict";var t=/[|\\{}()[\]^$+*?.]/g;n.exports=function(n){if("string"!=typeof n)throw new TypeError("Expected a string");return n.replace(t,"\\$&")}},1:function(n,e,t){"use strict";function o(){function n(n){var e=o.lastChild;return"SCRIPT"!==e.tagName?void("undefined"!=typeof console&&console.warn&&console.warn("Script is not a script",e)):void(e.onload=e.onerror=function(){e.onload=e.onerror=null,setTimeout(n,0)})}var e,o=document.querySelector("head"),r=t.e,a=t.s;
t.e=function(o,u){var s=!1,c=!0,i=function(n){u&&(u(t,n),u=null)};return!a&&e&&e[o]?void i(!0):(r(o,function(){s||(s=!0,c?setTimeout(function(){i()}):i())}),void(s||(c=!1,n(function(){s||(s=!0,a?a[o]=void 0:(e||(e={}),e[o]=!0),i(!0))}))))}}o()},388:function(n,e,t){"use strict";function o(n){return n&&n.__esModule?n:{default:n}}e.__esModule=!0,e.routeThroughBrowserOrApp=e.hashShouldBeFollowed=e.pathIsNotHandledByApp=e.urlsAreOnSameOrigin=e.authorIsForcingNavigation=e.anchorsTargetIsEquivalentToSelf=e.findClosestAnchor=e.navigationWasHandledElsewhere=e.slashedPathname=e.userIsForcingNavigation=void 0,e.default=function(n,e){var t=g(e);return n.addEventListener("click",t),function(){return n.removeEventListener("click",t)}};var r=t(325),a=o(r),u=t(15),s=e.userIsForcingNavigation=function(n){return 0!==n.button||n.altKey||n.ctrlKey||n.metaKey||n.shiftKey},c=e.slashedPathname=function(n){return"/"===n[0]?n:"/"+n},i=e.navigationWasHandledElsewhere=function(n){return n.defaultPrevented},l=e.findClosestAnchor=function(n){for(;n.parentNode;n=n.parentNode)if("a"===n.nodeName.toLowerCase())return n;return null},p=e.anchorsTargetIsEquivalentToSelf=function(n){return n.hasAttribute("target")===!1||null==n.target||["_self",""].indexOf(n.target)!==-1||"_parent"===n.target&&(!n.ownerDocument.defaultView.parent||n.ownerDocument.defaultView.parent===n.ownerDocument.defaultView)||"_top"===n.target&&(!n.ownerDocument.defaultView.top||n.ownerDocument.defaultView.top===n.ownerDocument.defaultView)},f=e.authorIsForcingNavigation=function(n){return n.hasAttribute("download")===!0||p(n)===!1},d=e.urlsAreOnSameOrigin=function(n,e){return n.protocol===e.protocol&&n.host===e.host},m=e.pathIsNotHandledByApp=function(n){var e=new RegExp("^"+(0,a.default)((0,u.withPrefix)("/"))),t=/^.*\.((?!htm)[a-z0-9]{1,5})$/i;return e.test(c(n.pathname))===!1||n.pathname.search(t)!==-1},h=e.hashShouldBeFollowed=function(n,e){return""!==e.hash&&(""===e.pathname||e.pathname===n.pathname)},g=e.routeThroughBrowserOrApp=function(n){return function(e){if(s(e))return!0;if(i(e))return!0;var t=l(e.target);if(null==t)return!0;if(f(t))return!0;var o=document.createElement("a");o.href=t.href;var r=document.createElement("a");return r.href=window.location.href,d(r,o)===!1||(!!m(o)||(!!h(r,o)||(e.preventDefault(),n(""+c(o.pathname)+o.search+o.hash),!1)))}}},389:function(n,e,t){"use strict";function o(n){return n&&n.__esModule?n:{default:n}}var r=t(15),a=t(388),u=o(a);e.onClientEntry=function(){(0,u.default)(window,function(n){(0,r.navigateTo)(n)})}},340:function(n,e,t){t(1),n.exports=function(n){return t.e(99219681209289,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(390)})})}},391:function(n,e){"use strict";e.registerServiceWorker=function(){return!0}},482:function(n,e){function t(n){return n=n||Object.create(null),{on:function(e,t){(n[e]||(n[e]=[])).push(t)},off:function(e,t){n[e]&&n[e].splice(n[e].indexOf(t)>>>0,1)},emit:function(e,t){(n[e]||[]).slice().map(function(n){n(t)}),(n["*"]||[]).slice().map(function(n){n(e,t)})}}}n.exports=t},125:function(n,e){function t(){throw new Error("setTimeout has not been defined")}function o(){throw new Error("clearTimeout has not been defined")}function r(n){if(l===setTimeout)return setTimeout(n,0);if((l===t||!l)&&setTimeout)return l=setTimeout,setTimeout(n,0);try{return l(n,0)}catch(e){try{return l.call(null,n,0)}catch(e){return l.call(this,n,0)}}}function a(n){if(p===clearTimeout)return clearTimeout(n);if((p===o||!p)&&clearTimeout)return p=clearTimeout,clearTimeout(n);try{return p(n)}catch(e){try{return p.call(null,n)}catch(e){return p.call(this,n)}}}function u(){h&&d&&(h=!1,d.length?m=d.concat(m):g=-1,m.length&&s())}function s(){if(!h){var n=r(u);h=!0;for(var e=m.length;e;){for(d=m,m=[];++g<e;)d&&d[g].run();g=-1,e=m.length}d=null,h=!1,a(n)}}function c(n,e){this.fun=n,this.array=e}function i(){}var l,p,f=n.exports={};!function(){try{l="function"==typeof setTimeout?setTimeout:t}catch(n){l=t}try{p="function"==typeof clearTimeout?clearTimeout:o}catch(n){p=o}}();var d,m=[],h=!1,g=-1;f.nextTick=function(n){var e=new Array(arguments.length-1);if(arguments.length>1)for(var t=1;t<arguments.length;t++)e[t-1]=arguments[t];m.push(new c(n,e)),1!==m.length||h||r(s)},c.prototype.run=function(){this.fun.apply(null,this.array)},f.title="browser",f.browser=!0,f.env={},f.argv=[],f.version="",f.versions={},f.on=i,f.addListener=i,f.once=i,f.off=i,f.removeListener=i,f.removeAllListeners=i,f.emit=i,f.prependListener=i,f.prependOnceListener=i,f.listeners=function(n){return[]},f.binding=function(n){throw new Error("process.binding is not supported")},f.cwd=function(){return"/"},f.chdir=function(n){throw new Error("process.chdir is not supported")},f.umask=function(){return 0}},595:function(n,e){"use strict";function t(n,e){for(var t in n)if(!(t in e))return!0;for(var o in e)if(n[o]!==e[o])return!0;return!1}e.__esModule=!0,e.default=function(n,e,o){return t(n.props,e)||t(n.state,o)},n.exports=e.default},342:function(n,e,t){t(1),n.exports=function(n){return t.e(0xa6bc690a59e9,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(228)})})}},343:function(n,e,t){t(1),n.exports=function(n){return t.e(0x81a450a7cd7a,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(229)})})}},344:function(n,e,t){t(1),n.exports=function(n){return t.e(0xc23565d713b7,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(230)})})}},345:function(n,e,t){t(1),n.exports=function(n){return t.e(36530248567819,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(231)})})}},346:function(n,e,t){t(1),n.exports=function(n){return t.e(90179704293519,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(232)})})}},347:function(n,e,t){t(1),n.exports=function(n){return t.e(0xa485d5bf544,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(233)})})}},348:function(n,e,t){t(1),n.exports=function(n){return t.e(0x623bdfc73907,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(234)})})}},349:function(n,e,t){t(1),n.exports=function(n){return t.e(2638498282051,function(e,o){o?(console.log("bundle loading error",o),n(!0)):n(null,function(){return t(235)})})}}});
//# sourceMappingURL=app-d49997cf3993c49041d3.js.map
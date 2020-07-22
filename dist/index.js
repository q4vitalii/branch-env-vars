module.exports=function(e,t){"use strict";var r={};function __webpack_require__(t){if(r[t]){return r[t].exports}var n=r[t]={i:t,l:false,exports:{}};var o=true;try{e[t].call(n.exports,n,n.exports,__webpack_require__);o=false}finally{if(o)delete r[t]}n.l=true;return n.exports}__webpack_require__.ab=__dirname+"/";function startup(){return __webpack_require__(676)}t(__webpack_require__);return startup()}({87:function(e){e.exports=require("os")},431:function(e,t,r){"use strict";var n=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var r in e)if(Object.hasOwnProperty.call(e,r))t[r]=e[r];t["default"]=e;return t};Object.defineProperty(t,"__esModule",{value:true});const o=n(r(87));function issueCommand(e,t,r){const n=new Command(e,t,r);process.stdout.write(n.toString()+o.EOL)}t.issueCommand=issueCommand;function issue(e,t=""){issueCommand(e,{},t)}t.issue=issue;const i="::";class Command{constructor(e,t,r){if(!e){e="missing.command"}this.command=e;this.properties=t;this.message=r}toString(){let e=i+this.command;if(this.properties&&Object.keys(this.properties).length>0){e+=" ";let t=true;for(const r in this.properties){if(this.properties.hasOwnProperty(r)){const n=this.properties[r];if(n){if(t){t=false}else{e+=","}e+=`${r}=${escapeProperty(n)}`}}}}e+=`${i}${escapeData(this.message)}`;return e}}function toCommandValue(e){if(e===null||e===undefined){return""}else if(typeof e==="string"||e instanceof String){return e}return JSON.stringify(e)}t.toCommandValue=toCommandValue;function escapeData(e){return toCommandValue(e).replace(/%/g,"%25").replace(/\r/g,"%0D").replace(/\n/g,"%0A")}function escapeProperty(e){return toCommandValue(e).replace(/%/g,"%25").replace(/\r/g,"%0D").replace(/\n/g,"%0A").replace(/:/g,"%3A").replace(/,/g,"%2C")}},470:function(e,t,r){"use strict";var n=this&&this.__awaiter||function(e,t,r,n){function adopt(e){return e instanceof r?e:new r(function(t){t(e)})}return new(r||(r=Promise))(function(r,o){function fulfilled(e){try{step(n.next(e))}catch(e){o(e)}}function rejected(e){try{step(n["throw"](e))}catch(e){o(e)}}function step(e){e.done?r(e.value):adopt(e.value).then(fulfilled,rejected)}step((n=n.apply(e,t||[])).next())})};var o=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var r in e)if(Object.hasOwnProperty.call(e,r))t[r]=e[r];t["default"]=e;return t};Object.defineProperty(t,"__esModule",{value:true});const i=r(431);const s=o(r(87));const u=o(r(622));var a;(function(e){e[e["Success"]=0]="Success";e[e["Failure"]=1]="Failure"})(a=t.ExitCode||(t.ExitCode={}));function exportVariable(e,t){const r=i.toCommandValue(t);process.env[e]=r;i.issueCommand("set-env",{name:e},r)}t.exportVariable=exportVariable;function setSecret(e){i.issueCommand("add-mask",{},e)}t.setSecret=setSecret;function addPath(e){i.issueCommand("add-path",{},e);process.env["PATH"]=`${e}${u.delimiter}${process.env["PATH"]}`}t.addPath=addPath;function getInput(e,t){const r=process.env[`INPUT_${e.replace(/ /g,"_").toUpperCase()}`]||"";if(t&&t.required&&!r){throw new Error(`Input required and not supplied: ${e}`)}return r.trim()}t.getInput=getInput;function setOutput(e,t){i.issueCommand("set-output",{name:e},t)}t.setOutput=setOutput;function setCommandEcho(e){i.issue("echo",e?"on":"off")}t.setCommandEcho=setCommandEcho;function setFailed(e){process.exitCode=a.Failure;error(e)}t.setFailed=setFailed;function isDebug(){return process.env["RUNNER_DEBUG"]==="1"}t.isDebug=isDebug;function debug(e){i.issueCommand("debug",{},e)}t.debug=debug;function error(e){i.issue("error",e instanceof Error?e.toString():e)}t.error=error;function warning(e){i.issue("warning",e instanceof Error?e.toString():e)}t.warning=warning;function info(e){process.stdout.write(e+s.EOL)}t.info=info;function startGroup(e){i.issue("group",e)}t.startGroup=startGroup;function endGroup(){i.issue("endgroup")}t.endGroup=endGroup;function group(e,t){return n(this,void 0,void 0,function*(){startGroup(e);let r;try{r=yield t()}finally{endGroup()}return r})}t.group=group;function saveState(e,t){i.issueCommand("save-state",{name:e},t)}t.saveState=saveState;function getState(e){return process.env[`STATE_${e}`]||""}t.getState=getState},622:function(e){e.exports=require("path")},676:function(e,t,r){"use strict";r.r(t);var n=r(470);var o=r.n(n);const i=["INPUT_BEVOVERWRITE","INPUT_BEVACTIONONNOREF","INPUT_BEVSETEMPTYVARS"];let s;let u;let a;function parseBranchName(e){if(!e){switch(u){case"error":n.setFailed("Unable to get github.ref/GITHUB_REF");return;case"warn":n.warning("Unable to get github.ref/GITHUB_REF");break;case"continue":break;default:n.setFailed(`Invalid value for bevActionOnNoRef: ${u}`);return}}const[t,r]=e.replace("refs/","").split("/");let o="!default";switch(t){case"heads":o=r;break;case"pulls":o="!pr";break;case"tags":o="!tag";break}return o}function parseEnvVarPossibilities(e){return Object.entries(e).filter(([e])=>e.startsWith("INPUT_")&&!i.includes(e)).map(([e,t])=>{const r=e.replace("INPUT_","").toUpperCase();if(!t.includes("\n")){return[r,{"!default":t.trim()}]}const n=t.split("\n").reduce((e,t)=>{if(t.trim().startsWith("#")||!t.trim().length){return e}const n=t.indexOf(":");if(n===-1){throw new Error(`Invalid value for ${r}: ${t} does not contain a colon`)}const o=t.substring(0,n).trim();e[o]=t.substring(n+1);return e},{});return[r,n]})}try{s=n.getInput("bevOverwrite")==="true";u=n.getInput("bevActionOnNoRef");a=n.getInput("bevSetEmptyVars")==="true";const e=process.env.GITHUB_REF;const t=parseBranchName(e);const r=parseEnvVarPossibilities(process.env).forEach(([e,r])=>{if(!s&&!!process.env[e]){return}const o=r[t]||r["!default"];if(!o){if(a){n.exportVariable(e,"");n.debug(`Exporting ${e} with an empty value`)}}else{n.exportVariable(e,o);n.debug(`Exporting ${e} with value ${o}`)}})}catch(e){n.setFailed(e)}}},function(e){"use strict";!function(){e.r=function(e){if(typeof Symbol!=="undefined"&&Symbol.toStringTag){Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}Object.defineProperty(e,"__esModule",{value:true})}}();!function(){e.n=function(t){var r=t&&t.__esModule?function getDefault(){return t["default"]}:function getModuleExports(){return t};e.d(r,"a",r);return r}}();!function(){var t=Object.prototype.hasOwnProperty;e.d=function(e,r,n){if(!t.call(e,r)){Object.defineProperty(e,r,{enumerable:true,get:n})}}}()});
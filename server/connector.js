import {mkdirSync,writeFileSync,chmodSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export function createLocalConnector(classroom,secret,{directory=resolve(root,'data/connectors')}={}){
  const actor=classroom.authenticate(secret,'student');
  mkdirSync(directory,{recursive:true,mode:0o700});chmodSync(directory,0o700);
  const file=resolve(directory,actor.id+'.json');
  writeFileSync(file,JSON.stringify({studentSession:secret}),{mode:0o600});chmodSync(file,0o600);
  return {config:{mcpServers:{knovine:{command:process.execPath,args:[resolve(root,'server/mcp.js')],env:{KNOVINE_PROFILE_FILE:file}}}},learner:actor.name,note:'Private local configuration. This client may read/write this learner’s records. Per-class sharing still requires the learner’s consent.'};
}

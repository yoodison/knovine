import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StdioClientTransport} from '@modelcontextprotocol/sdk/client/stdio.js';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

// An isolated engineering demonstration, not a ChatGPT or Meta inference simulator.
export function createDemoBridge(classroom) {
  const sessions=new Map();
  const digest=s=>createHash('sha256').update(s).digest('hex');
  function start(){
    const teacher=classroom.createAccount('Demo teacher','teacher');
    const student=classroom.createAccount('Alex (demo)','student');
    const group=classroom.createClass(teacher.token,'Demo: Equivalent fractions');
    classroom.joinClass(student.token,classroom.createInvite(teacher.token,group.id).invite);
    classroom.setSharing(student.token,group.id,true);
    classroom.addLesson(teacher.token,group.id,'A shared whole','Goal: Explain why equivalent fractions represent the same quantity.\n\n1. Show one half and two quarters.\n2. Introduce multiplying numerator and denominator.\n3. Practice with three equivalent fraction pairs.\n4. Ask each learner to explain their reasoning.');
    sessions.set(digest(teacher.token),{student:student.token,classId:group.id});
    return {...teacher,classId:group.id};
  }
  function scope(teacher){classroom.authenticate(teacher,'teacher');const s=sessions.get(digest(teacher));if(!s)throw Error('FORBIDDEN');return s;}
  async function record(teacher){
    const s=scope(teacher),client=new Client({name:'knovine-demo-client',version:'1.0'});
    const transport=new StdioClientTransport({command:process.execPath,args:[fileURLToPath(new URL('./mcp.js',import.meta.url))],env:{...process.env,KNOVINE_STUDENT_SESSION:s.student},stderr:'pipe'});
    try{
      await client.connect(transport);
      const result=await client.callTool({name:'record_learning_observation',arguments:{classId:s.classId,externalId:'demo-equivalent-fractions-1',rawText:'[Fictional learner] Why is 1/2 the same as 2/4? I thought a bigger denominator meant a smaller amount.',topic:'Equivalent fractions',signal:'question',observation:'Asked how equivalent fractions preserve the amount while the denominator changes.',path:['Same whole','Equal parts','Equivalent fractions']}});
      if(result.isError)throw Error('DEMO_MCP_FAILED');
      return {tool:'record_learning_observation',transport:'MCP / STDIO',result:result.structuredContent||result.content};
    }finally{await client.close();}
  }
  function share(teacher,enabled){const s=scope(teacher);return classroom.setSharing(s.student,s.classId,enabled);}
  return {start,record,share};
}

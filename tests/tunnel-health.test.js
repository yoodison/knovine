import test from 'node:test';
import assert from 'node:assert/strict';
import {createPollMonitor} from '../server/tunnel-health.js';
const metric=(status,count)=>`http_client_request_duration_seconds_count{http_response_status_code="${status}",http_route="/v1/tunnels/test/poll"} ${count}`;

test('tunnel startup is not considered authenticated before a successful remote poll',()=>{
  const read=createPollMonitor();
  assert.equal(read('').ready,false);
  assert.deepEqual(read(metric(204,1)),{ready:true,error:null});
});
test('authentication failures remain visible until a new successful poll',()=>{
  const read=createPollMonitor();
  assert.equal(read(metric(204,1)).ready,true);
  const failed=metric(204,1)+'\n'+metric(401,1);
  assert.match(read(failed).error,/key or its permissions/);
  assert.equal(read(failed).ready,false);
  assert.deepEqual(read(metric(204,2)+'\n'+metric(401,1)),{ready:true,error:null});
});

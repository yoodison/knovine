const translated={
'이 수업에 공유된 학습 단서가 없어요.':'No learning observations are shared with this class yet.',
'API 키를 확인해 주세요.':'Please check your API key.',
'Meta에서 키를 확인하지 못했어요. 키와 계정 상태를 확인해 주세요.':'Meta could not verify the key. Check the key and account status.',
'질문을 확인해 주세요.':'Please check your question.',
'수업 계획을 찾지 못했어요.':'Lesson plan not found.',
'먼저 학습 단서 공유를 켜 주세요.':'Turn on sharing first.',
'이 기기에서 다시 시작해 주세요.':'Your session is unavailable. Start again on this device.',
'이 수업에 접근할 권한이 없어요.':'You do not have access to this class.',
'Meta API 키가 설정되지 않았습니다.':'Connect a Meta API key first.',
'입력 내용을 확인해 주세요.':'Please check your input.',
'Meta에서 API 키를 거부했습니다. 키를 다시 확인해 주세요.':'Meta rejected the API key. Check the key and try again.',
'Meta 계정의 결제 또는 크레딧 상태를 확인해 주세요.':'Check the billing or credit status of your Meta account.',
'이 계정에 모델 사용 권한이 없거나 결제 설정이 필요합니다.':'This account needs model access or billing setup.',
'Meta 요청 한도에 도달했습니다. 잠시 후 다시 시도해 주세요.':'Meta request limit reached. Try again shortly.',
'요청을 처리하지 못했습니다. Meta 연결과 입력 내용을 확인해 주세요.':'Could not complete the request. Check your connection and input.'};
export function uiError(message){return translated[message]||message||'Something went wrong. Please try again.';}

// An explicitly fictional preview. Never used as model or connector verification.
export function createDemoClassroom(classroom) {
  const teacher=classroom.createAccount('Sample teacher','teacher');
  const lessonClass=classroom.createClass(teacher.token,'Sample: Everyday mathematics');
  const examples=[
    ['Alex','Equivalent fractions','question','Why is 1/2 the same as 2/4?','Asked why changing both numbers can preserve the fraction.',['Fractions','Equivalent fractions']],
    ['Sam','Equivalent fractions','learner_explanation','I split each of the two pieces in half. Two out of four pieces is still half.','Explained equivalence by subdividing the same whole.',['Fractions','Equivalent fractions']],
    ['Jamie','Adding fractions','possible_confusion','I added 1/2 and 1/4 and got 2/6. Do I add both numbers?','Proposed adding numerators and denominators; a follow-up explanation is needed.',['Equivalent fractions','Common denominators','Adding fractions']]
  ];
  for(const [name,topic,signal,rawText,observation,path] of examples){const student=classroom.createAccount(name+' (sample)','student');classroom.joinClass(student.token,classroom.createInvite(teacher.token,lessonClass.id).invite);classroom.setSharing(student.token,lessonClass.id,true);classroom.addObservation(student.token,{classId:lessonClass.id,topic,signal,rawText:'[Fictional example] '+rawText,observation,path});}
  classroom.addLesson(teacher.token,lessonClass.id,'Fractions that tell the same story','Goal: Explain equivalent fractions and add fractions with different denominators.\n\n1. Warm-up: Show 1/2 and 2/4 on a number line.\n2. Model finding a common denominator.\n3. Pair practice with fraction strips.\n4. Exit question: Explain 1/2 + 1/4 without using a rule alone.');
  return {token:teacher.token,actor:teacher.actor,classId:lessonClass.id};
}

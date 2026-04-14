const SCORE_OPTIONS = [
  { label: '从来没有', value: 0 },
  { label: '有几天', value: 1 },
  { label: '刚超过一半天数', value: 2 },
  { label: '接近每天', value: 3 }
];

const IMPAIRMENT_OPTIONS = [
  { label: '完全没有困难', value: 0 },
  { label: '有一些困难', value: 1 },
  { label: '非常困难', value: 2 },
  { label: '极度困难', value: 3 }
];

const PHQ9_QUESTIONS = [
  '做任何事都觉得沉闷或者根本不想做任何事',
  '情绪低落、抑郁或绝望',
  '难于入睡；半夜会醒，或相反，睡觉时间过多',
  '觉得疲倦或没有活力',
  '胃口极差或饮食过量',
  '不喜欢自己——觉得自己做得不好、对自己失望或有负家人期望',
  '难于集中精神做事，例如看报纸或看电视',
  '其他人反映你行动或说话迟缓；或者相反，你比平常活动更多——坐立不安、停不下来',
  '想到自己最好去死或者自残'
];

const GAD7_QUESTIONS = [
  '感到紧张、不安或烦躁',
  '无法停止或控制担忧',
  '对各种事情担忧过多',
  '很难放松下来',
  '由于不安而无法静坐',
  '变得容易烦恼或易被激怒',
  '感到害怕，就像有什么可怕的事即将发生'
];

function pad(v) {
  return String(v).padStart(2, '0');
}

function formatDate(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getPhq9Severity(score) {
  if (score <= 4) return { label: '极少/轻微抑郁症状', short: 'none', color: 'info', desc: '抑郁症状不明显，整体心理健康状态良好' };
  if (score <= 9) return { label: '轻度抑郁症状', short: 'mild', color: 'info', desc: '存在轻度抑郁倾向，建议自我观察与调节' };
  if (score <= 14) return { label: '中度抑郁症状', short: 'moderate', color: 'warn', desc: '存在中度抑郁倾向，建议预约专业评估' };
  if (score <= 19) return { label: '中重度抑郁症状', short: 'moderatelysevere', color: 'warn', desc: '存在较明显抑郁倾向，建议尽快专业评估' };
  return { label: '重度抑郁症状', short: 'severe', color: 'danger', desc: '存在严重抑郁倾向，建议立即寻求专业帮助' };
}

function getGad7Severity(score) {
  if (score <= 4) return { label: '极少/轻微焦虑', short: 'none', color: 'info', desc: '焦虑症状不明显，整体情绪状态较稳定' };
  if (score <= 9) return { label: '轻度焦虑', short: 'mild', color: 'info', desc: '存在轻度焦虑，可尝试放松与调节' };
  if (score <= 14) return { label: '中度焦虑', short: 'moderate', color: 'warn', desc: '存在中度焦虑倾向，建议专业评估' };
  return { label: '重度焦虑', short: 'severe', color: 'danger', desc: '存在重度焦虑，建议尽快寻求专业帮助' };
}

function getImpairmentText(value) {
  const found = IMPAIRMENT_OPTIONS.find(item => item.value === value);
  return found ? found.label : '未填写';
}

function buildTestResult(phq9Score, gad7Score, q9, impairment) {
  const phq9Severity = getPhq9Severity(phq9Score);
  const gad7Severity = getGad7Severity(gad7Score);
  const impairmentText = getImpairmentText(impairment);
  const hasSafetyConcern = q9 > 0;

  let phq9Highlight = '本次筛查提示抑郁症状较少或较轻。';
  if (phq9Score <= 4) {
    phq9Highlight = '本次筛查提示抑郁症状较少或较轻。';
  } else if (phq9Score <= 9) {
    phq9Highlight = '本次筛查提示轻度抑郁症状，可先自我照护并持续观察。';
  } else if (phq9Score <= 14) {
    phq9Highlight = '本次筛查提示中度抑郁症状，建议安排专业评估。';
  } else if (phq9Score <= 19) {
    phq9Highlight = '本次筛查提示中重度抑郁症状，建议尽快进行专业评估。';
  } else {
    phq9Highlight = '本次筛查提示重度抑郁症状，应尽快获得专业帮助。';
  }

  let gad7Highlight = '本次筛查提示焦虑症状较轻。';
  if (gad7Score <= 4) {
    gad7Highlight = '本次筛查提示焦虑症状较轻。';
  } else if (gad7Score <= 9) {
    gad7Highlight = '本次筛查提示轻度焦虑，可先自我调节并持续观察。';
  } else if (gad7Score <= 14) {
    gad7Highlight = '本次筛查提示中度焦虑，建议安排专业评估。';
  } else {
    gad7Highlight = '本次筛查提示重度焦虑，应尽快获得专业帮助。';
  }

  const advice = [];

  if (phq9Score <= 4) {
    advice.push('保持规律作息、适度运动、减少酒精和熬夜，留意接下来 1 至 2 周的情绪变化。');
    if (gad7Score > 4) {
      advice.push('虽然抑郁指标较轻，但焦虑指标值得留意，建议持续观察 1-2 周。');
    }
  } else if (phq9Score <= 9) {
    advice.push('建议在 1 至 2 周后复测一次，观察分数是否持续升高。');
    advice.push('优先改善睡眠、日间活动、社交支持和压力管理；如持续不缓解，可预约咨询或门诊。');
  } else if (phq9Score <= 14) {
    advice.push('建议尽量在 1 至 2 周内预约精神科、心理科或全科医生做正式评估。');
    advice.push('如果低落、失眠、无力感影响到工作学习，越早就诊越好。');
  } else if (phq9Score <= 19) {
    advice.push('建议尽快预约专业机构评估，通常不建议只靠自己硬扛。');
    advice.push('可与可信任的家人或朋友同步当前状态，争取陪伴与支持。');
  } else {
    advice.push('建议尽快获得精神科/心理科专业帮助，必要时前往急诊或综合医院精神心理门诊。');
    advice.push('尽量不要独处，先联系身边可信任的人陪伴你。');
  }

  if (gad7Score >= 10 && phq9Score < 10) {
    advice.push('你的焦虑指标相对更突出，可以尝试深呼吸、正念放松等自助技巧；若持续加重，建议预约专业评估。');
  }

  if (impairment >= 2) {
    advice.push(`你在"功能受影响"中选择了"${impairmentText}"，说明现实影响已经比较明显，建议把就诊优先级再提高一级。`);
  }

  let riskNotice = null;
  if (hasSafetyConcern) {
    riskNotice = {
      level: 'danger',
      title: '安全提示',
      body: '你在第 9 题（PHQ-9）选择了非"从来没有"。这一题涉及"想到自己最好去死或者自残"，不代表一定存在迫切危险，但属于必须认真对待的信号。请尽快联系专业人员评估；如果你此刻觉得自己无法保证安全，请立即拨打 12356、120、110，联系可信任的人陪伴，或直接前往最近急诊。'
    };
    advice.unshift('由于第 9 题出现阳性，建议今天就主动联系专业帮助，而不是仅仅等待下次复测。');
  } else {
    riskNotice = {
      level: phq9Severity.color,
      title: '结果说明',
      body: 'PHQ-9 和 GAD-7 是经过验证的筛查量表，但它们不是临床诊断。阳性结果通常还需要结合访谈、病程、既往史、功能受损和共病情况进一步判断。本测评不替代专业医疗评估。'
    };
  }

  return {
    type: 'phq9_gad7',
    phq9Score,
    phq9Total: 27,
    phq9Severity,
    phq9Highlight,
    gad7Score,
    gad7Total: 21,
    gad7Severity,
    gad7Highlight,
    subtitle: `抑郁 ${phq9Score}/27 | 焦虑 ${gad7Score}/21 | 功能受影响：${impairmentText}`,
    impairment,
    riskNotice,
    highlight: phq9Highlight,
    advice,
    q9,
    hasSafetyConcern
  };
}

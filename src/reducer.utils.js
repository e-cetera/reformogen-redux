export function prefixObjectFields(formId, obj, postfix='stored') {
  const prefixedObj = {};
  for (const [ fieldName, value ] of Object.entries(obj)) {
    prefixedObj[`Form:${formId}:field:${fieldName}:${postfix}`] = value;
  }
  return prefixedObj;
}

export function mergeOptions(prevOptions=[], nextOptions=[]) {
  const options = [ ...prevOptions ];
  nextOptions.forEach(nextOpt => 
    !options.find(existing => existing.id === nextOpt.id)?.id &&
    options.push(nextOpt)
  );
  return options;
}

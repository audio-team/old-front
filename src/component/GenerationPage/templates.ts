import {GenSpecTemplate} from './index';

const langTemplate: GenSpecTemplate = {
  name: 'Language', params: [
    {name: 'Language', type: 'Option', extra: ['English', 'French'], defaultVal: 'English'}
  ], dto: spec => ({
    name: 'Language',
    language: spec.args[0].value
  })
};
const hierarchyTemplate: GenSpecTemplate = {
  name: 'Class Hierarchy', params: [
    {name: 'Hierarchy', type: 'Option', extra: ['AudioSet'], defaultVal: 'AudioSet'},
  ], dto: spec => ({
    name: 'Hierarchy',
    hierarchy: spec.args[0].value
  })
};
const scaleTemplate: GenSpecTemplate = {
  name: 'Dataset Scale', params: [
    {name: 'Lower Bound', type: 'Option', extra: [10, 100, 1000, 10000, 100000], defaultVal: 100},
    {name: 'Upper Bound', type: 'Option', extra: [10, 100, 1000, 10000, 100000, 1000000], defaultVal: 1000},
  ], dto: spec => ({
    name: 'Dataset Scale',
    lower: spec.args[0].value,
    upper: spec.args[1].value
  })
};
const qualityTemplate: GenSpecTemplate = {
  name: 'Audio Quality', params: [
    {name: 'Sample Rate', type: 'List', extra: [48000, 44100, 16000], defaultVal: []},
    {name: 'Lossless', type: 'Bool', extra: null, defaultVal: true}
  ], dto: spec => ({
    name: 'Audio Quality',
    sampleRate: spec.args[0].value,
    lossless: spec.args[1].value
  })
};
const durationTemplate: GenSpecTemplate = {
  name: 'Audio Duration', params: [
    {name: 'Duration', type: 'Num', extra: [0, 60], defaultVal: 10}
  ], dto: spec => ({
    name: 'Audio Duration',
    duration: spec.args[0].value
  })
};

export {
  langTemplate,
  hierarchyTemplate,
  scaleTemplate,
  qualityTemplate,
  durationTemplate
};

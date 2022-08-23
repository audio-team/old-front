import RuleCreator from './RuleCreator.vue';

type MetaType = 'TaskLabel' | 'Property' | 'Tag';

interface BatchRule {
  labelRegex: string;
  lineFormat: string;
  groupToAudio: string;
  metaType: MetaType;
  metaKey: string;
}

export default RuleCreator;

export {
  MetaType,
  BatchRule
};

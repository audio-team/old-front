import {InjectionKey} from 'vue';
import {EntryNode} from '../component/FileList/data';

const KEY_selectNode = Symbol() as InjectionKey<(node: EntryNode) => void>;

export {
  KEY_selectNode
};

import {ZipEntry} from '../../util/ZipLen';
import TreeNode from '../../util/TreeNode';

type EntryType = 'zip' | 'dir' | 'audio' | 'text' | 'unknown';

interface EntryDetail {
  entry: ZipEntry,
  entryName: string,
  type: EntryType,
  metaInfo?: AudioMeta[]
}

interface AudioMeta {
  metaKey: string;
  value: string;
  type: 'TaskLabel' | 'Property' | 'Tag';
}

interface AudioInfo {
  duration?: number;
  url?: string;
  format: string;
}

type EntryNode = TreeNode<EntryDetail>;

export type {
  EntryDetail,
  EntryNode,
  AudioInfo,
  AudioMeta
};

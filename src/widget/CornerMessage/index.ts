import CornerMessage from './CornerMessage.vue';

interface MessageOption {
  content?: string;
  vOffset?: number;
  hOffset?: number;
}

type MessageData = MessageOption & {
  id: string;
  zIndex: number;
};

export type {MessageOption, MessageData};
export default CornerMessage;

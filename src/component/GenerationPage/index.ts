import GenerationPage from './GenerationPage.vue';
import {TaskType} from '../../util/domain';

export default GenerationPage;

type GenParamType = 'Bool' | 'Option' | 'Tag' | 'Num' | 'List';

interface GenSpecParam {
  name: string
  type: GenParamType,
  extra: any
  defaultVal: any
}

interface GenSpecTemplate {
  name: string;
  desc?: string;
  params: GenSpecParam[];
  dto: (spec: GenSpec) => { name: string };
}

interface TaskDetail {
  type: TaskType,
  name: string,
  specificTemplates: GenSpecTemplate[]
}

interface GenSpec {
  template: GenSpecTemplate;
  args: {
    type: GenParamType,
    value: any
  }[];
}

export type {
  GenSpecTemplate,
  TaskDetail,
  GenSpec,
  GenSpecParam,
  GenParamType
};

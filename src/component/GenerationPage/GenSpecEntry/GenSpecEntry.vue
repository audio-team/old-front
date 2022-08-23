<script setup lang="ts">
import {GenSpec} from '../index';
import {Icon} from '@vicons/utils';
import {DeleteOutlined, InfoOutlined} from '@vicons/material';
import SpecParamQuery from '../SpecTemplate/SpecParamQuery/SpecParamQuery.vue';

defineProps<{
  spec: GenSpec
}>();

const emit = defineEmits<{
  (e: 'delete'): void
}>();

const deleteSpec = () => {
  emit('delete');
};

</script>

<template>
  <section class="soundwhere-gen-spec-entry">
    <div class="info">
      <h2>{{ spec.template.name }} </h2>
      <i>{{ 'default' }}</i>
      <h3>Customization</h3>
      <SpecParamQuery v-for="(param, index) in spec.template.params" :key="param.name"
                      :param="param" v-model="spec.args[index].value" />
      <!--      TODO!!!! -->
    </div>

    <div class="ops">
      <Icon size="24">
        <InfoOutlined />
      </Icon>
      <Icon size="24" @click="deleteSpec">
        <DeleteOutlined />
      </Icon>
    </div>
  </section>
</template>

<style lang="scss" src="./GenSpecEntry.scss" scoped />

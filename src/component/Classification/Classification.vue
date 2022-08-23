<script setup lang="ts">
    import Uploader from '../../widget/Uploader/Uploader.vue';
    import FileTree from '../FileList/FileList.vue';
    import {reactive, ref} from 'vue';
    import AudioDetail from '../AudioDetail/AudioDetail.vue';
    import ColorButton from '../../widget/ColorButton/ColorButton.vue';
    import classificationAPI from "../../api/classification/classificationAPI";
    import loginAPI from "../../api/user/loginAPI";

    let files = reactive<File[]>([]);
    const list = $ref<any>();
    let selected = ref<string>();
    let Tags = reactive<String>([]);

    const onFileReceived = (file: File) => {
        console.log('received');
        files.push(file);
        console.log("files里面有没有", files)
        classification().then();
    }

    const onUnselect = () => {
        console.log('ok');
        list.selected = undefined;
    }


    const classification = async () => {
      console.log(1)
      try {
        let myFormData=new FormData();
        console.log(files)
        console.log(files.length)
        myFormData.append('file',files[files.length-1]);
        const tag=await classificationAPI.debugRun(myFormData);
        console.log(tag);
        Tags.push(tag)
      } catch (code) {
        console.error(code);
      }
    };

</script>

<template>
    <div class="soundwhere-upload-page" style="padding: 0 50px">
        <div class="upload-layout">
            <div class="soundwhere-file-list" >
                <div class="scroll" style="padding-top: 60px" >
                    <div v-for="file in files">
                        <div class="soundwhere-file-item">
                            Name:{{file.name}}
                        </div>
                    </div>
                </div>
                <div><p style="font-size:20px;color:#2c3e50;font-weight: bold;padding-left: 130px">可能的分类结果</p>
                  <div style="padding-left: 100px;padding-top: 10px" v-for="(item,index) in Tags" :key="index">{{item}}</div>
                </div>
            </div>
        </div>

        <br>
        <div v-if="files.length===0">
            <p>还没有音频文件上传</p>
        </div>
    </div>
    <br>
    <Uploader  @fileReceived="onFileReceived"/>

</template>


<style lang="scss" src="./Classification.scss" scoped/>


const saveFile = async (blob: Blob) => {
  // @ts-ignore Experimental API
  const newHandle = await window.showSaveFilePicker();
  const ws = await newHandle.createWritable();
  await ws.write(blob);
  await ws.close();
};

export {
  saveFile
}

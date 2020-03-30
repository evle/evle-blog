---
title: "文件上传最佳实践"
date: "2020-03-29"
layout: post
draft: false
path: "/posts/file-upload"
category: "Node.js"
tags:
  - 
description: ""
---

本篇文章实现一个文件上传的功能, 有以下特性:

- 断点续传
- 重复文件秒传
- 小文件整体上传
- 大文件分片上传
- 断点续传(单个分片续传和浏览器刷新续传)
- 暂停和恢复

技术栈为 React + Node.js， 废话不多说, 开始操作

## 前端部分

前端部分梳理需求如下:

- 选择图片上传后应该有预览功能
- 选择文件的合法性:
  - 如果没选择上传文件, 则提示没选择文件
  - 如果上传类型不允许, 则提示不支持该文件
  - 如果上传文件大小超过限制, 则提示不支持该文件
- 上传进度条提示
- web worker切片上传
- 断点续传, 暂停, 恢复

### 文件预览

文件预览的流程是: 当用户选择文件, 浏览器读到文件, 然后输出到页面上, 有2种方式实现:

- URL.createObjectURL(file) / URL.revokeObjectURL
- FileReader / onload / readAsDataURL  

任选一种实现如下:

```javascript
const [objectURL, setObjectURL] = React.useState('');
React.useEffect(()=>{
  let imageUrl = URL.createObjectURL(selectedFile)
  setObjectURL(imageUrl)
  return () => URL.revokeObjectURL(imageUrl)
}, [selectedFile])

return (
  <>
      {objectURL && <img src={objectURL}>}
  </>
)
```

### 文件上传合法性校验

点击上传按钮后, 主要校验内容为:

- 是否选择了文件 file是否为空
- 文件是否超过限制大小 file.size
- 文件的类型 file.type

```javascript
function handleUpload(file){
  if(!currentFile){
    return message.error('未选择文件')
  }
  if(!allowUpload(currentFile)){
    return message.error('不支持')
  }
}

function allowUpload(file){
    const isValidFileType = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4'].includes(file.type);
    if (!isValidFileType) {
        message.error('不支持此文件类型!');
    }
    const isLt2G = file.size / 1024 / 1024 < 1024 * 1024 * 1024;
    if (!isLt2G) {
        message.error('上传的图片不能大于2MB!');
    }
    return isValidFileType && isLt2G;
}
```


```javascript

function Upload(){
  let [currentFile, setCurrentFile] = useState<File>();
  
  useEffect(()=>{
    window.URL.createObjectURL(currentFile)
  },[currentFile])
}
```

### 分片上传

分片思路: 用slice将文件切片, 放近一个对象数组里面, 上传文件格式为

```javascript
filename,//文件名
chunk_name: `${filename}-${index}`,//分块的名称
chunk: part.chunk,//代码块
size: part.chunk.size//此代码块的大小
```

通过Promise.all执行多个异步上传任务

```javascript
partList = partList.map((part, index: number) => ({
            filename,//文件名
            chunk_name: `${filename}-${index}`,//分块的名称
            chunk: part.chunk,//代码块
            size: part.chunk.size//此代码块的大小
        }));

await uploadParts(partList, filename);

async function uploadParts(partList: Part[], filename: string) {
    let requests = createRequests(partList);
    // 发送所有切片
    await Promise.all(requests);

    // 告诉服务器合并所有切片
    await request({
        url: '/merge',
        method: 'POST',
        headers: { 'Content-Type': "application/json" },
        data: JSON.stringify({ filename })
    });
}

// 组装每一个切片ajax请求
function createRequests(partList: Part[]) {
    return partList.map((part: Part) => {
        return request({
            url: `/upload/${part.filename}/${part.chunk_name!}`,
            method: 'POST',
            header: { 'Content-Type': 'application/octet-stream' },
            data: part.chunk,
        });
    })
}
```

文件切片:

```javascript
function createChunks(file: File): Part[] {
    let current = 0;
    const partList: Part[] = [];
    while (current < file.size) {
        const chunk = file.slice(current, current + SIZE);
        partList.push({ chunk, size: chunk.size });
        current += SIZE;
    }
    return partList;
}
```

### 重复文件秒传

如果文件上传到服务器过, 那么就不再上传了, 实现秒传.

实现思路: 在webworker中计算文件hash, 上传文件名由 `hash.mimeType`的格式组成

- 将切片的对象数组传给worker: `postMessage({ partList })`
- 当worker计算完毕后得到hash: `worker.onmessage = (event.data)`

worker部分:

- 引入sparkMd5进行计算hash: `importScripts`
- 将每一片Blob转成ArrayBuffer供sparkMd5使用 
- 使用`spark.append(buffer)`计算完哈希后通知浏览器`postMessage({hash})`

```javascript
const calculateHash = (partList: Part[]): Promise<string> => {
    return new Promise(resolve => {
        let worker = new Worker("/hash.js");
        setWorker(worker);
        worker.postMessage({ partList });
        worker.onmessage = (event) => {
            const { percent, hash } = event.data;
            setHashPercent(percent);
            if (hash) {
                resolve(hash);
            }
        };
    });
}

// handleHash.js
self.importScripts('https:spark-md5.js');
self.onmessage = async (event) => {
    var { partList } = event.data;
    const spark = new self.SparkMD5.ArrayBuffer();
    var percent = 0;
    var perSize = 100 / partList.length;
    var buffers = await Promise.all(partList.map(({ chunk }) => new Promise((resolve) => {
        // 也可以直接 chunk.ArrayBuffer()转
        const reader = new FileReader();
        reader.readAsArrayBuffer(chunk);
        reader.onload = (event) => {
            percent += perSize;
            self.postMessage({ percent: Number(percent.toFixed(2)) });
            resolve(event.target.result);
        }
    })));
    buffers.forEach(buffer => spark.append(buffer));
    self.postMessage({ percent: 100, hash: spark.end() });
    self.close();
}
```

### 断点续传

实现思路: 前端每次上传, 先把hash文件名给服务器, 服务端检查文件是否传过, 如果服务器上有这个文件夹就说明上传过

如果上传过, 读取已上传的目录, 看到底上传了多少个, 返回一个已上传列表, 前端拿到这个列表开始上传没传过的部分

断点续传支持: 暂停下载和恢复下载的逻辑

- 暂停: xhr.abort()
- 恢复: 调用上传接口

```javascript
async function handleUpload(){
  ...
  const verify = filename=>{
    return await request({url:`/verify/${filename}`})
  }
  // 上传之前,看把hash文件名给后端
  let {needUpload, uploadList} = verify(filename)
  if(!needUpload){
    return message.success('上传成功');
  }
  
  // 创建切片异步任务
  let requests = createRequests(partList, uploadedList);
  await Promise.all(requests);
  await request({
      url: '/merge',
      method: 'POST',
      headers: { 'Content-Type': "application/json" },
      data: JSON.stringify({ filename })
  });
  message.info('上传成功!');

  // 续传实现逻辑: 根据uploadedList 只上传位上传的
  function createRequests(partList: Part[], uploadedList: Uploaded[]) {
      return partList.filter((part: Part) => {

          // 根据filename查找没上传过的
          let uploadedFile = uploadedList.find(item => item.filename === part.chunk_name);

          // 没上传过的 需要上传
          if (!uploadedFile) {
              part.loaded = 0;
              part.percent = 0;
              return true;
          }

          // 上传过的, 但没上传完整, 也需要上传
          if (uploadedFile.size < part.chunk.size) {
              part.loaded = uploadedFile.size;
              part.percent = Number(((part.loaded / part.chunk.size) * 100).toFixed(2));
              return true;
          }

          // 不需要上传
          return false;
      }).map((part: Part) => {
          return request({
              url: `/upload/${part.filename}/${part.chunk_name!}/${part.loaded!}`,
              method: 'POST',
              header: { 'Content-Type': 'application/octet-stream' },
              data: part.chunk.slice(part.loaded!),
              // 用来拿到xhr实现暂停  option.setXHR && setXHR(xhr)
              setXHR: (xhr: XMLHttpRequest) => { part.xhr = xhr },
              onProgress: (event: ProgressEvent) => {
                  part.percent = Number((Number(part.loaded + event.loaded) / part.chunk.size * 100).toFixed(2));
                  setPartList([...partList]);
              }
          });
      })
  }
  ...
}
```

### 进度条 

上传文件2个进度条: hash计算的进度条和文件上传的进度条

worker把每个chunk从blob转ArrayBuffer的时候会通知进度:

```javascript
reader.onload = (event) => {
    percent += perSize;
    self.postMessage({ percent: Number(percent.toFixed(2)) });
    resolve(event.target.result);
}
```

文件上传的进度条:

通过`xhr.upload.onprogress`获取进度, `event.loaded`是传输了多少内容, `event.total`是总文件大小

```javascript
const onProgress = (event: ProgressEvent) => {
                  part.percent = Number((Number(part.loaded + event.loaded) / part.chunk.size * 100).toFixed(2));
                  setPartList([...partList]);
              }

xhr.upload.onprogress = onProgress;


let totalPercent = partList.length > 0 ? 
                   Math.round(partList.reduce((acc, curr) => acc + curr.percent!, 0) / 
                   (partList.length * 100) * 100) : 0;
```

## 后端部分 
 
### 合并切片

合并切片思路: 性能考虑，流处理.

```javascript
//  helpers, 读文件到writeStream
const pipeStream = (filePath: string, writeStream: WriteStream) => new Promise(resolve => {
    const readStream = fs.createReadStream(filePath);
    readStream.on('end', async () => {
        await fs.unlink(filePath);
        resolve();
    });
    readStream.pipe(writeStream);
});

export const mergeChunks = async (filename: string, size: number = SIZE) => {
    const filePath = path.resolve(PUBLIC_DIR, filename);
    const chunksDir = path.resolve(TEMP_DIR, filename);
    const chunkFiles = await fs.readdir(chunksDir);

    // 文件名升序排列
    chunkFiles.sort((a, b) => Number(a.split('-')[1]) - Number(b.split('-')[1]));
    await Promise.all(
        // 将每一片文件读到可写流 合并chunks成一个文件
        chunkFiles.map((chunkFile, index) => pipeStream(
            path.resolve(chunksDir, chunkFile),
            fs.createWriteStream(filePath, {
                start: index * size
            })
        ))
    );
    await fs.rmdir(chunksDir);
}
```

### 响应合并请求

```javascript
app.post('/merge', async (req: Request, res: Response) => {
    let { filename } = req.body;
    await mergeChunks(filename);
    res.json({
        success: true,
        url: `http://localhost:8000/${filename}`
    });
});
```

### 接收切片

```javascript
app.post('/upload/:filename/:chunk_name', async (req: Request, res: Response, _next: NextFunction) => {
    let file_dir = path.resolve(TEMP_DIR, req.params.filename);
    let exist = await fs.pathExists(file_dir);
    if (!exist) {
        await fs.mkdirs(file_dir);
    }
    const filePath = path.resolve(TEMP_DIR, req.params.filename, req.params.chunk_name);

    // 追加模式打开 
    let writeStream = fs.createWriteStream(filePath, { start: 0, flags: "a" });
    req.pipe(writeStream);
    req.on('end', () => {
        writeStream.close();
        res.json({
            success: true
        });
    });
});
```

### 断点续传 

```javascript
app.post('/verify', async (req: Request, res: Response): Promise<any> => {
    const { filename } = req.body;
    const filePath = path.resolve(PUBLIC_DIR, filename);
    let existFile = await fs.pathExists(filePath);
    // 如果有public里面有这个文件, 说明已经上传过了  实现秒传
    if (existFile) {
        return res.json({
            success: true,
            needUpload: false
        });
    }
    let tempFilePath = path.resolve(TEMP_DIR, filename);
    let uploadedList: any[] = [];
    let existTemporaryFile = await fs.pathExists(tempFilePath);
    // 如果上传过 没传完到情况
    if (existTemporaryFile) {
        uploadedList = await fs.readdir(tempFilePath);
        uploadedList = await Promise.all(uploadedList.map(async (filename: string) => {
            let stat = await fs.stat(path.resolve(tempFilePath, filename));
            // 把每个chunk的文件名和大小读出来
            return {
                filename,
                size: stat.size
            }
        }));
    }
    res.json({
        success: true,
        needUpload: true,
        uploadedList: uploadedList
    });
});
```

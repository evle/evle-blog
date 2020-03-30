---
title: "https原理之https是如何保障web安全的"
date: "2020-03-29"
layout: post
draft: false
path: "/posts/why-https"
category: "network"
tags:
  - 
description: ""
---

## Why https

HTTPS = HTTP + TLS/SSL, http端口80, https端口443

HTTP和TCP之间, 即应用层和网络层中间, 信息加密(防窃听), 完整性校验(防篡改), 信息劫持(身份验证)

多个client与server通信时信息如何加密?

- 使用AES? 所有浏览器用一个secret解密? 不安全
- 使用RSA？所有浏览器使用公钥加密内容, 服务器使用私钥解密, 内容就算被中间人获取, 也无法知道传输内容
  
RSA的方案合理, 但如果中间人篡改内容呢?

1. 中间人替换服务端公钥, 给浏览器
2. 浏览器用假公钥加密数据, 被中间人得到内容, 中间人篡改内容用真公钥发给服务器
3. 中间人拦截服务器内容, 用假私钥加密, 将内容篡改给客户端, 客户端用假公匙解密

那怎么怎么解决上面这些中间人安全问题呢？ RSA + AES + 第三方认证

增加第三方验证, 如果被中间人篡改, 浏览器如果通过第三方给的公匙验证数据失败, 则数据被篡改过

使用CA流程:

1. 服务器生成public key和private key 并且 将public key注册到 CA
2. CA用自己private key签名服务器的public key并颁发证书给服务器
3. 服务器把证书给浏览器 发送给浏览器, 浏览器用CA public key检查证书合法性
4. 如果合法浏览器生成随机对称密钥, 使用服务端public key加密后发送, 之后的通信使用AES加密

```javascript
let { generateKeyPairSync, createSign, createVerify, createHash } = require('crypto');
let passphrase = 'zhufeng';
let rsa = generateKeyPairSync('rsa', {
    modulusLength: 1024,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase
    }
});
const info = {
    domain: "http://127.0.0.1:8080",
    publicKey: rsa.publicKey
};
const hash = createHash('sha256').update(JSON.stringify(info)).digest('hex');
const sign = getSign(hash, rsa.privateKey, passphrase);
const cert = { info, sign };

let certIsValid = verifySign(hash, cert.sign, rsa.publicKey);
console.log('certIsValid', certIsValid);

function getSign(content, privateKey, passphrase) {
    var sign = createSign('RSA-SHA256');
    sign.update(content);
    return sign.sign({ key: privateKey, format: 'pem', passphrase }, 'hex');
}
function verifySign(content, sign, publicKey) {
    var verify = createVerify('RSA-SHA256');
    verify.update(content);
    return verify.verify(publicKey, sign, 'hex');
}
```


## 常见加密算法

### 对称加密: AES

加密解密用同一个secret (md5, sha1被破解了, 主流sha256)

```javascript
function encrypt(data, key, iv) {
    let decipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    decipher.update(data);
    return decipher.final('hex');
}

function decrypt(data, key, iv) {
    let decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    decipher.update(data, 'hex');
    return decipher.final('utf8');
}
```

### 非对称加密: RSA

p * q = K 
p * q? = K

```javascript
let { generateKeyPairSync, privateEncrypt, publicDecrypt } = require('crypto');
let rsa = generateKeyPairSync('rsa', {
    modulusLength: 1024,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: 'server_passphrase'
    }
});
let message = 'hello';
let enc_by_prv = privateEncrypt({
    key: rsa.privateKey, passphrase: 'server_passphrase'
}, Buffer.from(message, 'utf8'));
console.log('encrypted by private key: ' + enc_by_prv.toString('hex'));


let dec_by_pub = publicDecrypt(rsa.publicKey, enc_by_prv);
console.log('decrypted by public key: ' + dec_by_pub.toString('utf8'));
```

### 哈希

如果不同的输入得到了同一个哈希值,就发生了哈希碰撞, 可以扩大哈希值的取值空间避免这个问题, 用途: md5校验完整性, sha256用来加密

### 数字签名

私钥去签名，而用公钥去验证签名, 目的: 验证文件合法性 

```javascript
let passphrase = 'zhufeng';
let rsa = generateKeyPairSync('rsa', {
    modulusLength: 1024,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase
    }
});
let content = 'hello';
const sign = getSign(content, rsa.privateKey, passphrase);
let serverCertIsValid = verifySign(content, sign, rsa.publicKey);
console.log('serverCertIsValid', serverCertIsValid);
function getSign(content, privateKey, passphrase) {
    var sign = createSign('RSA-SHA256');
    sign.update(content);
    return sign.sign({ key: privateKey, format: 'pem', passphrase }, 'hex');
}
function verifySign(content, sign, publicKey) {
    var verify = createVerify('RSA-SHA256');
    verify.update(content);
    return verify.verify(publicKey, sign, 'hex');
}
```

### Diffie-Hellman

一种密钥交换协议，它可以让双方在不泄漏密钥的情况下协商出一个密钥来

```javascript
const { createDiffieHellman } = require('crypto');

var client = createDiffieHellman(512);
var client_keys = client.generateKeys();

var prime = client.getPrime();
var generator = client.getGenerator();

var server = createDiffieHellman(prime, generator);
var server_keys = server.generateKeys();

var client_secret = client.computeSecret(server_keys);
var server_secret = server.computeSecret(client_keys);

console.log('client_secret: ' + client_secret.toString('hex'));
console.log('server_secret: ' + server_secret.toString('hex'));
```

### ECC 

```javascript
let { createECDH } = require('crypto');
const clientDH = createECDH('secp521r1');
const clientDHParams = clientDH.generateKeys();

const serverDH = createECDH('secp521r1');
const serverDHParams = serverDH.generateKeys();

const clientKey = clientDH.computeSecret(serverDHParams);
const serverKey = serverDH.computeSecret(clientDHParams);
console.log('clientKey', clientKey.toString('hex'));
console.log('serverKey', serverKey.toString('hex'));
```




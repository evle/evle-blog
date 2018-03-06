---
title: "MongoDB Cheat Sheets"
date: "2017-09-02T03:10:03.284Z"
layout: post
draft: false
path: "/posts/mongodb-cheat-sheets/"
category: "MongoDB"
tags:
  - "MongoDB"
description: "MongoDB Cheat Sheets"
---
## Executables
|                 | MySQL/Oracle  | MongoDB |
| --------------- | ------------- | ------- |
| Database Server | mysqld/oracle | mongod  |
| Database Client | mysql/sqlplus | mongo   |



## Concepts
| SQL Terms/Concepts | MongoDB Terms/Concepts         |
| ------------------ | ------------------------------ |
| database           | database                       |
| table              | collection                     |
| row                | document or BSON document      |
| column             | field                          |
| index              | index                          |
| table joins        | embedded documents and linking |
| primary key        | primary key(default _id)       |


## Database Commands
| Command           | Notes                                              |
| ----------------- | -------------------------------------------------- |
| db                | Displays the database that you're currently using. |
| show dbs          | Displays the databases available on the server.    |
| use <db>          | Create or switch database                          |
| db.dropDatabase() | Drop database                                      |

## Collection
| Command                     | Note              |     
| --------------------------- | ----------------- |
| db.createCollection("user") | Create collection |
| db.COLLECTION_NAME.drop()   | Delete collection |

## Basic CRUD Operations
### Create
| MongoDB Schema Statements                      | Note  |
| ---------------------------------------------- | ----- |
| db.user.insert({name: "evle",age: 18})         |       |
| db.user.ensureIndex( { user_id: 1, age: -1 } ) | Index |

### Read
| MongoDB Schema Statements     | Note       |
| ----------------------------- | ---------- |
| db.users.find()               |            |
| db.users.find({ status: "A" } | status = A |

### update
| MongoDB Schema Statements                                              | Note                       |
| ---------------------------------------------------------------------- | -------------------------- |
| db.user.update({'name':'evle'},{$set:{'name':'max lee'}})              | Only update the first one. |
| db.user.update({'name':'evle'},{$set:{'name':'max lee'}},{multi:ture}) | Update all                 |

### Delete
| MongoDB Schema Statements        | Note       |
| -------------------------------- | ---------- |
| db.users.remove( )               |            |
| db.users.remove({ status: "D" }) | status = D |  

## Miscellaneous
| Command     | Note |
| ----------- | ---- |
| limit()     |      |
| skip()      |      |
| sort()      |      |
| $lt         |      |
| $lte        |      |
| $gt         |      |
| $gte        |      |
| $ne         |      |
| AND         |      |
| OR          |      |
| aggregate() |      |

const express=require("express");
const data=express.Router();
const User=require("../functions/user.js");
const DB_CONNECTION_URL=require("../config/db.js");
const config=require("../config/config.json");
const MongoClient=require("mongodb").MongoClient;

// This is data/statistics
// statistics data for graph in dashboard
data.get("/statistics",(req,res)=>{
  res.end("statistics");
});

//course Names
data.get("/course/name",async(req,res)=>{
  var department=[];
  await MongoClient.connect(DB_CONNECTION_URL,{
    useUnifiedTopology:true
  }).then(async mongo=>{
    const db=await mongo.db(config.DB_SERVER.DB_DATABASE);
    var cursor=await db.collection("department")
    .find({})
    .project({name:1,courses:1,engineering:1});
    await cursor.each((err,item)=>{
      if(err!=null || item==null)
      {
        res.json(department);
        cursor.close();
        return;
      }
      else
      {
        department.push(item);
      }
    });
  }).catch(error=>{
    console.log(error.message);
    res.json([]);
  });
});

// sitemap
data.get("/sitemap",async(req,res)=>{
  const user=new User(req);
  var siteMap,code;
  await user.initialize().then(data=>{
    code=data.userCode();
    siteMap=[
      {
        key:"home",
        url:"/home",
        access:[
          data.userCode("guest"),
          data.userCode("student"),
          data.userCode("coordinator"),
          data.userCode("recruiter"),
          data.userCode("admin")
        ]
      },
      {
        key:"statistics",
        url:"/statistics",
        access:[
          data.userCode("guest"),
          data.userCode("student"),
          data.userCode("coordinator"),
          data.userCode("admin")
        ]
      },
      {
        key:"about",
        url:"/about",
        access:[
          data.userCode("guest"),
          data.userCode("student"),
          data.userCode("coordinator"),
          data.userCode("recruiter"),
          data.userCode("admin")
        ]
      },
      {
        key:"help",
        url:"/contact",
        access:[
          data.userCode("guest"),
          data.userCode("student"),
          data.userCode("coordinator"),
          data.userCode("recruiter"),
          data.userCode("admin")
        ]
      },
      {
        key:"gallery",
        url:"/gallery",
        access:[
          data.userCode("guest"),
          data.userCode("student"),
          data.userCode("coordinator"),
          data.userCode("recruiter"),
          data.userCode("admin")
        ]
      },
      {
        key:"team",
        url:"/team",
        access:[
          data.userCode("guest"),
          data.userCode("student"),
          data.userCode("coordinator"),
          data.userCode("recruiter"),
          data.userCode("admin")
        ]
      },
      {
        key:"dashboard",
        url:"/student/dashboard",
        access:[
          data.userCode("student"),
          data.userCode("coordinator")
        ]
      },
      {
        key:"settings",
        url:"/student/dashboard?tab=settings",
        access:[
          data.userCode("student"),
          data.userCode("coordinator")
        ]
      },
      {
        key:"placement drive",
        url:"/student/dashboard?tab=drive",
        access:[
          data.userCode("student"),
          data.userCode("coordinator")
        ]
      },
      {
        key:"skill tracker",
        url:"/student/dashboard?tab=skill-tracker",
        access:[
          data.userCode("student"),
          data.userCode("coordinator")
        ]
      },
      {
        key:"external jobs",
        url:"/student/dashboard?tab=external-jobs",
        access:[
          data.userCode("student"),
          data.userCode("coordinator")
        ]
      },
      {
        key:"dashboard",
        url:"/recruiter/dashboard",
        access:[
          data.userCode("recruiter")
        ]
      },
      {
        key:"details",
        url:"/recruiter/details",
        access:[
          data.userCode("recruiter")
        ]
      },
      {
        key:"post jobs",
        url:"/recruiter/recruitments",
        access:[
          data.userCode("recruiter")
        ]
      }
    ];
  }).catch(error=>{
    console.log(error.message);
    siteMap=[];
    code=0;
  }).finally(()=>{
    siteMap=siteMap.filter(page=>{
      return page.access.includes(code);
    }).map(page=>{
      return {
        key:page.key,
        url:page.url
      }
    });
    res.json(siteMap);
  });
});

module.exports=data;

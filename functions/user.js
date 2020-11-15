// Important (for Refference)
// Accessing User Class in Route

// route.get("/test",async(req,res)=>{
//
//   const user=new User(req);
//   await user.initialize().then(data=>{
//     console.log("success");
//     console.log(data);
//   }).catch(error=>{
//     console.log("error");
//     console.log(error.message);
//   }).finally(()=>{
//     console.log("after");
//     res.end("OK");
//   });
//
// });

const MongoClient=require("mongodb").MongoClient;
const DB_CONNECTION_URL=require("../config/db.js");
const config=require("../config/config.json");
const userDefaultCodes={
  "guest":0,
  "student":1,
  "coordinator":2,
  "recruiter":3,
  "admin":4
};
class User
{
  constructor(req)
  {
    this.session=req.session;
    this.cookies=req.cookies;
    this.isLoggedIn=false;//default
    this.type="guest";//default
    this.user="Guest";//default
  }
  async initialize()
  {
    if(this.session!==undefined && this.session.user!==undefined && this.session.type!==undefined)
    {
      this.isLoggedIn=true;
      this.type=this.session.type;
      this.user=this.session.user;
      delete this.session;//porperty of this object
      delete this.cookies;//porperty of this object
      return this;
    }
    else if(this.cookies[config.COOKIE.KEY]!==undefined)
    {
      var cookie=this.cookies[config.COOKIE.KEY];
      cookie=Buffer.from(cookie,"base64").toString("ascii");
      cookie=JSON.parse(cookie);
      var data={};
      return await this.checkCredentials(cookie.u,cookie.p).then(data=>{
        this.session.user=cookie.u;
        this.session.type=data.type;
        if(data.success===true)
        {
          this.isLoggedIn=true;
          this.type=data.type;
          this.user=cookie.u;
        }
        else
        {
          this.isLoggedIn=false;
          this.type="guest";
          this.user="guest";
        }
        delete this.session;//porperty of this object
        delete this.cookies;//porperty of this object
        return this;
      }).catch(err=>{
        throw new Error("Some Other Error");
      });
    }
    else
    {
      this.isLoggedIn=false;
      this.type="guest";
      this.user="guest";
      delete this.session;//porperty of this object
      delete this.cookies;//porperty of this object
      return this;
    }
  }
  async checkCredentials(email,password)
  {
    var data={};
    await MongoClient.connect(DB_CONNECTION_URL,{
      useUnifiedTopology:true
    }).then(async mongo=>{
      const db=mongo.db(config.DB_SERVER.DB_DATABASE);
      await db.collection("user_data")
      .findOne({
        email,
        password
      })
      .then(result=>{
        if(result!==null)
        {
          data.success=true;
          data.type=result.type;
        }
        else
        {
          data.success=false;
          data.message="Invalid credentials";
        }
      }).catch(err=>{
        data.success=false;
        data.message="Loading Error";
        data.devlog=err.message;
      }).finally(()=>{
        mongo.close();
      });
    }).catch(error=>{
      data.success=false;
      data.message="Connection Error";
      data.devlog=error.message;
    });
    return data;
  }
  async getUserData(email)
  {
    var data={};
    await MongoClient.connect(DB_CONNECTION_URL,{
      useUnifiedTopology:true
    }).then(async mongo=>{
      const db=mongo.db(config.DB_SERVER.DB_DATABASE);
      await db.collection("user_data")
      .findOne({
        email
      })
      .then(result=>{
        if(result!==null)
        {
          data.success=true;
          data.result=result;
          delete data.result.password;
        }
        else
        {
          data.success=false;
          data.message="not Found";
        }
      }).catch(err=>{
        data.success=false;
        data.message=err.message;
      }).finally(()=>{
        mongo.close();
      });
    }).catch(error=>{
      data.success=false;
      data.message=error.message;
    });
    return data;
  }
  userCode(code=this.type)
  {
    return userDefaultCodes[code];
  }
  hasAccessOf(access)//type other user types
  {
    if(access=="guest")//All users have access previlage of guest
    {
      return true;
    }
    else if(this.type=="student" && access=="student")
    {
      return true;
    }
    else if(this.type=="coordinator" && ["student","coordinator"].includes(access))//coordinator is also a student
    {
      return true;
    }
    else if(this.type=="recruiter" && access=="recruiter")//recruiter has no other previlages.
    {
      return true;
    }
    else if(this.type=="admin" && access=="admin")//Admin have coordinator access too
    {
      return true;
    }
    else
    {
      return false;
    }
  }
}
module.exports=User;

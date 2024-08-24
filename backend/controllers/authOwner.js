import db from "../db/db.js"
const login=async (req,res)=>
{
    const {username,password}=req.body;
    const authHeader=req.headers.authorization;
    const token=null;
    if(authHeader&&authHeader.startsWith('Bearer '))
    {
        token =authHeader.split(' ')[1];
    }
    try {
        const result=db.query("SELECT * FROM owner WHERE owner_name=$1",[username])
        if((await result).rows.length>0)
            return res.status(401).json({messgae:"Username already exist"})
        
    } catch (error) {
        
    }
}
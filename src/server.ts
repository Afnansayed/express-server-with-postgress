import express, { NextFunction, Request, Response } from 'express';
import config from './config';
import initDB, { pool } from './config/db';




const app = express();
const port = config.port;

//parser
app.use(express.json());



initDB();

const loger = (req: Request , res: Response , next:NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
}

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World! I am a typescript server')
})

app.post('/users', async  (req: Request, res: Response) =>{
  const {name , email} = req.body;
  try{
      const result = await pool.query(
        `INSERT INTO users(name,email) VALUES($1,$2) RETURNING *;`, 
      [name , email]);
      console.log(result.rows[0]);
      res.status(201).send({
        success: true,
        message: "Data Instered Successfully",
        data: result.rows[0]
      })
  }catch(err:any){
    res.status(500).send({
      succes: false,
      message: err.message
    })
  }
});

app.get('/users', loger, async (req:Request, res:Response) => {
  try{
    const result = await pool.query(`SELECT * FROM users`);
    res.status(200).json({
      success: true,
      message: "Data Fetched Successfully",
      data: result.rows
    })
  }catch(err:any){
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
})

//users curd 
app.get('/users/:id', async (req:Request, res:Response) => {
        
       try{
          const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.params.id]);
          console.log(result.rows);
          if(result.rows.length > 0){
            res.status(200).json({
              success: true,
              message: "Data Fetched Successfully",
              data: result.rows[0]
            })
          }else{
            res.status(404).json({
              success: false,
              message: "Data Not Found"
            })
          }
       }catch(err:any){
         res.status(500).json({
           success: false,
           message: err.message
         })
       }
})
//users curd  put
app.put('/users/:id', async (req:Request, res:Response) => {
       const {name , email , age , phone , address} = req.body;
       try{
          const result = await pool.query(`UPDATE users SET name = $1, email = $2 , age = $3 , phone = $4 , address = $5 WHERE id = $6 RETURNING *`, [name, email ,age, phone, address, req.params.id]);
          console.log(result.rows);
          if(result.rows.length > 0){
            res.status(200).json({
              success: true,
              message: "Data Updated Successfully",
              data: result.rows[0]
            })
          }else{
            res.status(404).json({
              success: false,
              message: "Data Not Found"
            })
          }
       }catch(err:any){
         res.status(500).json({
           success: false,
           message: err.message
         })
       }
})
//users curd  delete
app.delete('/users/:id', async (req:Request, res:Response) => {
       try{
          const result = await pool.query(`DELETE FROM users WHERE id = $1`, [req.params.id]);
          console.log(result.rowCount);
          if(result.rowCount !== 0){
            res.status(200).json({
              success: true,
              message: "Data Deleted Successfully",
              data: result.rows
            })
          }else{
            res.status(404).json({
              success: false,
              message: "Data Not Found"
            })
          }
       }catch(err:any){
         res.status(500).json({
           success: false,
           message: err.message
         })
       }
})

// curd operation for todos
app.post('/todos', async(req:Request, res:Response) => {
     const {user_id , title , description , completed , due_date} = req.body;
   try{
      const result = await pool.query(`INSERT INTO todos(user_id,title,description,completed,due_date) VALUES($1,$2,$3,$4,$5) RETURNING *;`, [user_id , title , description , completed , due_date]);
      // console.log(result.rows[0]);
      res.status(201).json({
        success: true,
        message: "Data Instered Successfully",
        data: result.rows[0]
      })
   }catch(err:any){
    res.status(500).json({
      success: false,
      message: err.message
    })
   }
})

//get all todos
app.get("/todos", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM todos`);

    res.status(200).json({
      success: true,
      message: "todos retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      datails: err,
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Page Not Found",
    path: req.path
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

import express, { Request, Response } from 'express';
import {Pool} from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path:path.join(process.cwd(), '.env') })

const app = express()
const port = 5000

//parser
app.use(express.json());

const pool = new Pool({
  connectionString:`${process.env.CONNECTION_STR}`
})

const initDB = async() => {
  await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      age INT,
      phone VARCHAR(15),
      address TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos(
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      completed BOOLEAN DEFAULT false,
      due_date DATE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      )`)
}

initDB()

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World! I am a typescript server')
})

app.post('/users', async (req: Request, res: Response) =>{
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

app.get('/users', async (req:Request, res:Response) => {
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

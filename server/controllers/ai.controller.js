import OpenAI from "openai";
import sql from "../config/Db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import {v2 as cloudinary} from 'cloudinary'; 
import fs from 'fs';
// import * as pdf from 'pdf-parse';
import PDFParser from "pdf2json";

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const generateArticle = async (req ,res)=>{

    try {
        const {userId} = req.auth();
        const {prompt , length} = req.body;
         const plan = req.plan;
         const free_usage = req.free_usage;

         if (plan !== 'premium' && free_usage>=10){
            return res.json({
                success:false,
                message:"Limit reached. Upgrade to continue"
            })

         }

         const response = await AI.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
      
        {
            role: "user",
            content: prompt,
        },
    ],
    temperature:0.7,
    max_tokens:length,
});

const content = response.choices[0].message.content
await sql`
  INSERT INTO creations (user_id, prompt, content, type)
  VALUES (${userId}, ${prompt}, ${content}, 'article')
`;


if (plan !== 'premium'){
    await clerkClient.users.updateUserMetadata(userId ,{
        privateMetadata :{
            free_usage : free_usage +1
        }
    })
}
res.json({success:true,content})
    }
    catch (err){
        console.log(err);
        res.json({
            success:false,
            message:err.message
        })
    }

}




export const generateBlogTitle = async (req ,res)=>{

    try {
        const {userId} = req.auth();
        const {prompt} = req.body;
         const plan = req.plan;
         const free_usage = req.free_usage;

        if (plan !== 'premium' && free_usage >= 10)
{
            return res.json({
                success:false,
                message:"Limit reached. Upgrade to continue"
            })

         }

         const response = await AI.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
      
        {
            role: "user",
            content: prompt,
        },
    ],
    temperature:0.7,
    max_tokens:100,
});

const content = response.choices[0].message.content
await sql`
  INSERT INTO creations (user_id, prompt, content, type)
  VALUES (${userId}, ${prompt}, ${content}, 'blog-title')
`;


if (plan !== 'premium'){
    await clerkClient.users.updateUserMetadata(userId ,{
        privateMetadata :{
            free_usage : free_usage +1
        }
    })
}
res.json({success:true,content})
    }
    catch (err){
        console.log(err);
        res.json({
            success:false,
            message:err.message
        })
    }

}


export const generateImage = async (req ,res)=>{

    try {
        const {userId} = req.auth();
        const {prompt , publish} = req.body;
         const plan = req.plan;
         const free_usage = req.free_usage; // ✅ Add this line

          if (plan !== 'premium' && free_usage >= 10){ // ✅ Modify condition
            return res.json({
               success:false,
                message:"Limit reached. Upgrade to continue"
          })

         }
         

        
const form = new FormData()
form.append('prompt', prompt);

 const {data} = await axios.post('https://clipdrop-api.co/text-to-image/v1',form,{
    headers:{
    'x-api-key': process.env.CLIPDROP_API_KEY,},
    responseType:"arraybuffer",
  
});

const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;

 const {secure_url}=await cloudinary.uploader.upload(base64Image);

      

await sql`
  INSERT INTO creations (user_id, prompt, content, type,publish)
  VALUES (${userId}, ${prompt}, ${secure_url}, 'image',${publish ?? false})
`;

if (plan !== 'premium'){ // ✅ Add free usage increment
    await clerkClient.users.updateUserMetadata(userId ,{
        privateMetadata :{
            free_usage : free_usage +1
        }
    })
}


res.json({success:true,content:secure_url})
    }
    catch (err){
        console.log(err);
        res.json({
            success:false,
            message:err.message
        })
    }


}

export const removeImageBackground = async (req ,res)=>{

    try {
        const {userId} = req.auth();
        const image = req.file;
         const plan = req.plan;
         const free_usage = req.free_usage; // ✅ Add this line

          if (plan !== 'premium' && free_usage >= 10){ // ✅ Modify condition
            return res.json({
               success:false,
                message:"Limit reached. Upgrade to continue"
          })

         }
         

        


 const {secure_url}=await cloudinary.uploader.upload(image.path,{
    transformation:[
        {
            effect:'background_removal',
            background_removal :'remove_the_background'
        }
    ]

 });

      

await sql`
  INSERT INTO creations (user_id, prompt, content, type)
  VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image');
`;

if (plan !== 'premium'){ // ✅ Add free usage increment
    await clerkClient.users.updateUserMetadata(userId ,{
        privateMetadata :{
            free_usage : free_usage +1
        }
    })
}

res.json({success:true,content:secure_url})
    }
    catch (err){
        console.log(err);
        res.json({
            success:false,
            message:err.message
        })
    }


}

export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file;
    const { object } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage; // ✅ Add this line

    if (plan !== 'premium' && free_usage >= 10) { // ✅ Modify condition
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue"
      });
    }

    
    const { public_id } = await cloudinary.uploader.upload(image.path, {
      resource_type: 'image'
    });

    
    const imageUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:prompt_${object}` }],
      resource_type: 'image'
    });

    
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image');
    `;

    if (plan !== 'premium') { // ✅ Add free usage increment
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1
        }
      });
    }

    res.json({ success: true, content: imageUrl });

  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: err.message
    });
  }
};

export const summarizeDocument = async (req, res) => {
  try {
    const { userId } = req.auth();
    const file = req.file;
    const plan = req.plan;
    const free_usage = req.free_usage; 
    if (plan !== "premium" && free_usage >= 10) 
      { 

      return res.json({ 
        success: false, 
        message: "Limit reached. Upgrade to continue" 
      });
    }

    if (!file) {
      return res.json({ success: false, message: "Please upload a PDF file" });
    }

    if (file.size > 5 * 1024 * 1024) {
      return res.json({ success: false, message: "File size exceeds 5MB limit" });
    }

    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (err) => {
      console.error("PDF parse error:", err.parserError);
      res.json({ success: false, message: "Failed to parse PDF" });
    });

    pdfParser.on("pdfParser_dataReady", async (pdfData) => {
      const safeDecode = (text) => {
        try {
          return decodeURIComponent(text);
        } catch {
          return text; 
        }
      };

      // safely decode text from PDF
      const text = pdfData.Pages.map((page) =>
        page.Texts.map((t) => safeDecode(t.R[0].T)).join(" ")
      ).join("\n");

      const prompt = `
You are an expert summarizer with a deep understanding of context and meaning. Carefully read the following document and provide a clear, detailed, and insightful summary.

Focus on:
- The main themes and key takeaways
- Important details or data points
- The tone and intent of the author
- Any conclusions or recommendations made

Keep the summary engaging, concise, and well-structured in paragraphs.

Document:
${text}
`;

      const response = await AI.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1500,
      });

      const content = response.choices[0].message.content;

      await sql`
        INSERT INTO creations (user_id, prompt, content, type)
        VALUES (${userId}, 'Summarize uploaded document', ${content}, 'document-summary');
      `;

      if (plan !== 'premium') { 
        await clerkClient.users.updateUserMetadata(userId, {
          privateMetadata: {
            free_usage: free_usage + 1
          }
        });
      }

      res.json({ success: true, content });
    });

    pdfParser.loadPDF(file.path);
  } catch (err) {
    console.error("Error in summarizeDocument:", err);
    res.json({ success: false, message: err.message });
  }
};
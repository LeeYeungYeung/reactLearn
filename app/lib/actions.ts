'use server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import exp from 'constants';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending','paid']),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({
    id: true,
    date: true
});

const UpdateInvoice = FormSchema.omit({
    id: true,
    date: true,
});

export async function updateInvoice(
    id:string, formData: FormData
){
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
      });
     
      const amountInCents = amount * 100;
     
      try {
          await sql`
            UPDATE invoices
            SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
            WHERE id = ${id}
          `;
        
      } catch (error) {
        return {
            message: 'Database Error: Failed to update',
        }
      }
     
      revalidatePath('/dashboard/invoices');
      redirect('/dashboard/invoices');
}

export async function  deleteInvoice(id : string) { 
    throw new Error("Failed to Delete Invoice");
    
    try{
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
    }catch(error){
        return {
            message: 'Database Error: Failed to Delete',
        }
    }
    
}

export async function createInvoive(formData: FormData){
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
      });
    console.log(typeof amount);
   const amountInCents = amount * 100;
   const date = new Date().toISOString().split('T')[0];
   try{

       await sql`
       INSERT INTO invoices (customer_id, amount, status, date)
       VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
       `
   }catch(error){
    return {
        message: 'Database Error: Failed to Create Invoive',
    }
   }
    revalidatePath('/ui/dashboard/invoices');
    redirect('/ui/dashboard/invoices');
}
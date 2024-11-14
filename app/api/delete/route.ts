import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
    try{
        const {id} = await req.json();
        await prisma.cars.delete({
            where:{id},
        })
        return NextResponse.json({message:'Car deleted successfully'},{status:200})
    }catch (error) {
        console.error('Error deleting tenant:', error);
        return NextResponse.json({ message: 'Failed to delete tenant' }, { status: 500 });
      }
}
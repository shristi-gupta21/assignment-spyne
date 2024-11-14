import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req:NextRequest) {
    try{
        const cars = await prisma.cars.findMany();
        return NextResponse.json(cars, {status:200})
    }catch(error){
        console.error('Error fetching cars', error);
        return NextResponse.json({message:'Failed to retrieve cars'})
    }
}
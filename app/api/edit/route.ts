// app/api/edit/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  try {
    const { id, title, description, tags, images } = await req.json();

    const car = await prisma.cars.update({
      where: { id },
      data: { title, description, images, tags },
    });

    return NextResponse.json(car, { status: 200 });
  } catch (error) {
    console.error("Error updating car:", error);
    return NextResponse.json({ message: "Failed to update car" }, { status: 500 });
  }
}

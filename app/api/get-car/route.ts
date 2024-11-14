import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { id } = await req.json();
  if (!id || typeof id !== "string") {
    return NextResponse.json({ message: "Invalid or missing ID parameter" }, { status: 400 });
  }
  try {
    const car = await prisma.cars.findUnique({
      where: { id },
    });
    if (!car) {
      return NextResponse.json({ message: "Car not found" }, { status: 404 });
    }
    return NextResponse.json(car, { status: 200 });
  } catch (error) {
    console.error("Error fetching car:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

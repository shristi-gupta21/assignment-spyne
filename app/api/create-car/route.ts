// app/api/create-car/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import cloudinary from "cloudinary";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const formData = await req.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const tags = (formData.get("tags") as string)?.split(",") || [];
  const files = formData.getAll("images") as File[];

  // Validate inputs
  if (!title || !description || files.length > 10) {
    return NextResponse.json(
      { message: "Please provide title, description, and up to 10 images." },
      { status: 400 }
    );
  }

  try {
    // Upload images to Cloudinary
    const uploadPromises = files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer()); // Convert arrayBuffer to Buffer
      return new Promise<string>((resolve, reject) => {
        const uniqueFilename = `cars/${uuidv4()}`;
        cloudinary.v2.uploader.upload_stream(
          {
            folder: "cars",
            public_id: uniqueFilename,
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result?.secure_url!); // Resolve with the URL
          }
        ).end(buffer);
      });
    });

    const imageUrls = await Promise.all(uploadPromises);

    // Save the car with image URLs in the database
    const newCar = await prisma.cars.create({
      data: {
        title,
        description,
        tags,
        images: imageUrls,
      },
    });

    return NextResponse.json({ message: "Car created successfully", car: newCar }, { status: 201 });
  } catch (error) {
    console.error("Error creating car:", error);
    return NextResponse.json({ message: "Failed to create car" }, { status: 500 });
  }
}

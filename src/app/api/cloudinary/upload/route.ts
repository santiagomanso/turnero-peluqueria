import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No se recibió ningún archivo" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const folder = `${process.env.CLOUDINARY_FOLDER}/products`;

    const uploaded = await cloudinary.uploader.upload(base64, { folder });

    const result = await cloudinary.uploader.explicit(uploaded.public_id, {
      type: "upload",
      eager: [
        {
          effect: "background_removal",
          format: "png",
        },
      ],
      eager_async: false,
    });

    const url = result.eager?.[0]?.secure_url ?? result.secure_url;

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Error al subir la imagen" },
      { status: 500 },
    );
  }
}

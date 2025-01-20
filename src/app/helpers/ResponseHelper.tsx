
import { NextResponse } from "next/server";

export class ResponseHelper {
  static jsonResponse(message: string, status: number, data?: any) {
    return NextResponse.json({ message, data }, { status } );
  }
}

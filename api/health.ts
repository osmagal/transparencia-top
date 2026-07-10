export default async function handler(req: any, res: any) {
  res.status(200).json({ status: "ok", mode: process.env.NODE_ENV || "production" });
}

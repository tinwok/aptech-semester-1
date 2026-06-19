import { getAllStaffs } from "@/services/api";

export async function staffLoader() {
  let staffs = [];
  try {
    staffs = await getAllStaffs();
  } catch (error) {
    console.warn("Staff API unavailable:", error.message);
  }
  return { staffs };
}

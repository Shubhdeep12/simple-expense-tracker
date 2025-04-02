import { getTypes } from "@/lib/data";

export async function GET() {
    try {
      const types = await getTypes();
      return Response.json({ types });
    } catch (error) {
      console.error('Error fetching types:', error);
      return Response.json({ error: 'Failed to fetch expense types' }, {status: 500});
    }
  
  
}
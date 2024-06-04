import { NextResponse } from "next/server"
import { dbConnect } from "../../lib/db"
import Land from "../../models/lands"

export async function GET() {
    await dbConnect();
    const landsWithTrees: any = [];
    const timestamp = new Date().getTime();

    const landsArray = await Land.find({
        treesTimestamp: { $gt: timestamp, $lt: timestamp + 120 * 60 * 1000 }
    })

    landsArray.forEach((land) => {
        land.treesTimestamp.forEach((treeTimestamp: any) => {
          if (treeTimestamp > timestamp && treeTimestamp < timestamp + 15 * 60 * 1000) {
            landsWithTrees.push({ land: land.land, treeTimestamp: treeTimestamp, guild: land.guild });
          }
        });
    });

    let grouped = landsWithTrees.reduce((acc: any, obj: any) => {
        let key = obj.land;
        let guild = obj.guild;
        if (!acc[key]) {
          acc[key] = { land: key, treesTimestamps: [], guild: guild };
        }
        acc[key].treesTimestamps.push(obj.treeTimestamp);
        return acc;
    }, {});

    const lands = Object.values(grouped)
    
    return NextResponse.json({ lands })
}